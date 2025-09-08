import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import SubscriptionService from '../services/subscriptionService';

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { email, password, firstName, lastName, phone, tenantRole } = req.body;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kullanılıyor'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      tenantId,
      tenantRole,
      isActive: true
    });

    await user.save();

    // Update usage
    await SubscriptionService.updateUsage(tenantId, 'users', 1);

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        tenantRole: user.tenantRole,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı oluşturulurken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Get all users in tenant
export const getUsers = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { page = 1, limit = 10, search, role, isActive } = req.query;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    // Build query
    const query: any = { tenantId };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.tenantRole = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcılar alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Get specific user
export const getUser = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const user = await User.findOne({ _id: id, tenantId }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    const { id } = req.params;
    const { firstName, lastName, phone, isActive } = req.body;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    // Check if user is updating themselves or has permission
    const isUpdatingSelf = userId === id;
    const userRole = req.user?.tenantRole;

    if (!isUpdatingSelf && !['owner', 'manager'].includes(userRole || '')) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    const user = await User.findOne({ _id: id, tenantId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (isActive !== undefined && ['owner', 'manager'].includes(userRole || '')) {
      user.isActive = isActive;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla güncellendi',
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        tenantRole: user.tenantRole,
        isActive: user.isActive,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı güncellenirken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { tenantRole } = req.body;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const user = await User.findOne({ _id: id, tenantId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Prevent changing owner role
    if (user.tenantRole === 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Owner rolü değiştirilemez'
      });
    }

    user.tenantRole = tenantRole;
    await user.save();

    res.json({
      success: true,
      message: 'Kullanıcı rolü başarıyla güncellendi',
      data: {
        id: user._id,
        email: user.email,
        tenantRole: user.tenantRole
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı rolü güncellenirken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const user = await User.findOne({ _id: id, tenantId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Prevent deleting owner
    if (user.tenantRole === 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Owner kullanıcısı silinemez'
      });
    }

    await User.findByIdAndDelete(id);

    // Update usage
    await SubscriptionService.updateUsage(tenantId, 'users', -1);

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı silinirken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};
