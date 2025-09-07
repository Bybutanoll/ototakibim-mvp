import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any; // Full user document
      tenantId?: string;
      tenant?: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token gereklidir'
      });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz token'
      });
    }

    // Fetch full user document with tenant information
    const user = await User.findById(decoded.id)
      .select('-password -refreshTokens -passwordResetToken -emailVerificationToken')
      .populate('tenantId', 'companyName subscription');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Kullanıcı bulunamadı'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Hesap deaktif'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(401).json({
        status: 'error',
        message: 'Hesap kilitli. Lütfen daha sonra tekrar deneyin.'
      });
    }

    // Attach user and tenant info to request
    req.user = user;
    req.tenantId = user.tenantId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Geçersiz token'
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Yetkilendirme gereklidir'
      });
    }

    const userRole = req.user.tenantRole || req.user.globalRole;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    next();
  };
};

// Multi-tenant role checks
export const requireOwner = authorizeRoles('owner');
export const requireManager = authorizeRoles('manager', 'owner');
export const requireTechnician = authorizeRoles('technician', 'manager', 'owner');

// Global role checks
export const requireSuperAdmin = authorizeRoles('super_admin');
export const requireGlobalAdmin = authorizeRoles('super_admin', 'admin');

// Legacy role checks (for backward compatibility)
export const requireAdmin = authorizeRoles('admin', 'super_admin');
export const requireTechnicianOrAdmin = authorizeRoles('technician', 'manager', 'owner', 'admin', 'super_admin');
export const requireManagerOrAdmin = authorizeRoles('manager', 'owner', 'admin', 'super_admin');
