import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { emailService } from '../services/emailService';

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Bu email adresi zaten kullanılıyor'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || 'technician'
    });

    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
      console.log('📧 Hoş geldin email gönderildi:', user.email);
    } catch (emailError) {
      console.error('📧 Email gönderilirken hata:', emailError);
      // Email hatası kullanıcı kaydını engellemez
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      status: 'success',
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz email veya şifre'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz email veya şifre'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Hesabınız aktif değil'
      });
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(200).json({
      status: 'success',
      message: 'Giriş başarılı',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.status(200).json({
      status: 'success',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { firstName, lastName, phone } = req.body;
    const userId = req.user?.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profil güncellendi',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Mevcut şifre yanlış'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Şifre başarıyla değiştirildi'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { businessName, businessType, address, phone } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        {
          businessName,
          businessType,
          address,
          phone,
          onboardingCompleted: true
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı'
        });
      }

      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            businessName: user.businessName,
            businessType: user.businessType,
            address: user.address,
            phone: user.phone,
            onboardingCompleted: user.onboardingCompleted
          }
        },
        message: 'Onboarding başarıyla tamamlandı'
      });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Onboarding tamamlanırken hata oluştu'
      });
    }
};

export const getOnboardingStatus = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const user = await User.findById(userId).select('onboardingCompleted businessName businessType address phone');

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı'
        });
      }

      res.json({
        status: 'success',
        data: {
          onboardingCompleted: user.onboardingCompleted,
          businessName: user.businessName,
          businessType: user.businessType,
          address: user.address,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Get onboarding status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Onboarding durumu yüklenirken hata oluştu'
      });
    }
};