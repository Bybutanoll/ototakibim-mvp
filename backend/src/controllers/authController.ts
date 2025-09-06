import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { 
  generateTokenPair, 
  verifyAccessToken, 
  verifyRefreshToken,
  generateAccessToken,
  TokenPayload 
} from '../utils/jwt';
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

    // Generate token pair
    const tokenPair = generateTokenPair({
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    // Store refresh token in database
    user.refreshTokens = [tokenPair.refreshToken];
    await user.save();

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
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn
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

    // Demo mode - hardcoded demo users
    if (process.env.DEMO_MODE === 'true') {
      const demoUsers = [
        {
          _id: 'demo_user_1',
          email: 'mehmet@demo.com',
          password: 'demo123456',
          firstName: 'Mehmet',
          lastName: 'Usta',
          phone: '+90 555 123 4567',
          role: 'technician',
          isActive: true,
          onboardingCompleted: true,
          businessName: 'Mehmet Usta Oto Servis',
          businessType: 'Oto Tamir',
          address: 'İstanbul, Türkiye',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'demo_user_2',
          email: 'ayse@demo.com',
          password: 'demo123456',
          firstName: 'Ayşe',
          lastName: 'Demir',
          phone: '+90 555 987 6543',
          role: 'manager',
          isActive: true,
          onboardingCompleted: true,
          businessName: 'Demir Fleet Management',
          businessType: 'Fleet Yönetimi',
          address: 'Ankara, Türkiye',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const demoUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (!demoUser) {
        return res.status(401).json({
          status: 'error',
          message: 'Geçersiz email veya şifre'
        });
      }

      // Generate token pair for demo
      const tokenPair = generateTokenPair({
        id: demoUser._id,
        email: demoUser.email,
        role: demoUser.role
      });

      return res.status(200).json({
        status: 'success',
        message: 'Giriş başarılı (Demo Mod)',
        user: {
          _id: demoUser._id,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          email: demoUser.email,
          phone: demoUser.phone,
          role: demoUser.role,
          isActive: demoUser.isActive,
          onboardingCompleted: demoUser.onboardingCompleted,
          businessName: demoUser.businessName,
          businessType: demoUser.businessType,
          address: demoUser.address,
          createdAt: demoUser.createdAt,
          updatedAt: demoUser.updatedAt
        },
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        expiresIn: tokenPair.expiresIn
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz email veya şifre'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        status: 'error',
        message: 'Hesabınız geçici olarak kilitlendi. Lütfen daha sonra tekrar deneyin.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
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

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token pair
    const tokenPair = generateTokenPair({
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    // Store refresh token in database
    user.refreshTokens = [tokenPair.refreshToken];
    await user.save();

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
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token gereklidir'
      });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz refresh token'
      });
    }

    // Find user and check if refresh token exists
    const user = await User.findById(payload.id).select('+refreshTokens');
    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz refresh token'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Hesabınız aktif değil'
      });
    }

    // Generate new token pair
    const tokenPair = generateTokenPair({
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    // Update refresh tokens (remove old, add new)
    user.refreshTokens = [tokenPair.refreshToken];
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Token yenilendi',
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const userId = (req as any).user?.id;

    if (refreshToken && userId) {
      // Remove refresh token from database
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Çıkış başarılı'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email adresi gereklidir'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        status: 'success',
        message: 'Eğer bu email adresi sistemimizde kayıtlıysa, şifre sıfırlama linki gönderilecektir'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail({
        email: user.email,
        firstName: user.firstName,
        resetToken: resetToken
      });
    } catch (emailError) {
      console.error('Password reset email error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      status: 'success',
      message: 'Eğer bu email adresi sistemimizde kayıtlıysa, şifre sıfırlama linki gönderilecektir'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Token ve yeni şifre gereklidir'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Geçersiz veya süresi dolmuş token'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Şifre başarıyla sıfırlandı'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Mevcut şifre ve yeni şifre gereklidir'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Mevcut şifre yanlış'
      });
    }

    // Update password
    user.password = newPassword;
    user.refreshTokens = []; // Invalidate all refresh tokens
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

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Demo mode - return demo user data
    if (process.env.DEMO_MODE === 'true') {
      const demoUsers = [
        {
          _id: 'demo_user_1',
          email: 'mehmet@demo.com',
          firstName: 'Mehmet',
          lastName: 'Usta',
          phone: '+90 555 123 4567',
          role: 'technician',
          isActive: true,
          onboardingCompleted: true,
          businessName: 'Mehmet Usta Oto Servis',
          businessType: 'Oto Tamir',
          address: 'İstanbul, Türkiye',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'demo_user_2',
          email: 'ayse@demo.com',
          firstName: 'Ayşe',
          lastName: 'Demir',
          phone: '+90 555 987 6543',
          role: 'manager',
          isActive: true,
          onboardingCompleted: true,
          businessName: 'Demir Fleet Management',
          businessType: 'Fleet Yönetimi',
          address: 'Ankara, Türkiye',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const userId = (req as any).user?.id;
      const demoUser = demoUsers.find(u => u._id === userId);
      
      if (!demoUser) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı'
        });
      }

      return res.status(200).json({
        status: 'success',
        user: {
          _id: demoUser._id,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          email: demoUser.email,
          phone: demoUser.phone,
          role: demoUser.role,
          isActive: demoUser.isActive,
          onboardingCompleted: demoUser.onboardingCompleted,
          businessName: demoUser.businessName,
          businessType: demoUser.businessType,
          address: demoUser.address,
          createdAt: demoUser.createdAt,
          updatedAt: demoUser.updatedAt
        }
      });
    }

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