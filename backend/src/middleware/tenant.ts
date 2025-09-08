import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Tenant from '../models/Tenant';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenant?: any;
      tenantContext?: {
        tenantId: string;
        tenant: any;
      };
      user?: any;
    }
  }
}

/**
 * Multi-tenant middleware
 * Extracts tenant information from JWT token or subdomain
 */
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tenantId: string | null = null;

    // Method 1: Extract from JWT token (for authenticated requests)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        if (decoded.tenantId) {
          tenantId = decoded.tenantId;
        }
      } catch (error) {
        // Token invalid, continue to other methods
      }
    }

    // Method 2: Extract from subdomain (for unauthenticated requests)
    if (!tenantId) {
      const host = req.get('host') || '';
      const subdomain = host.split('.')[0];
      
      // Skip if it's a known domain (www, api, app, etc.)
      const skipSubdomains = ['www', 'api', 'app', 'admin', 'localhost', '127.0.0.1'];
      if (!skipSubdomains.includes(subdomain) && subdomain !== host) {
        tenantId = subdomain;
      }
    }

    // Method 3: Extract from query parameter (for development/testing)
    if (!tenantId && req.query.tenant) {
      tenantId = req.query.tenant as string;
    }

    // Method 4: Extract from header (for API clients)
    if (!tenantId && req.headers['x-tenant-id']) {
      tenantId = req.headers['x-tenant-id'] as string;
    }

    // If no tenant found, use default tenant for development
    if (!tenantId && process.env.NODE_ENV === 'development') {
      tenantId = 'default-tenant';
    }

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required. Provide via subdomain, JWT token, query parameter, or x-tenant-id header.'
      });
    }

    // Validate tenant exists and is active
    const tenant = await Tenant.findOne({ tenantId, isActive: true });
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found or inactive'
      });
    }

    // Check if tenant subscription is active
    if (tenant.subscription.status !== 'active' && tenant.subscription.status !== 'trial') {
      return res.status(403).json({
        success: false,
        message: 'Tenant subscription is not active',
        subscription: {
          status: tenant.subscription.status,
          expiresAt: tenant.subscription.expiresAt
        }
      });
    }

    // Attach tenant info to request
    req.tenantId = tenantId;
    req.tenant = tenant;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in tenant middleware'
    });
  }
};

/**
 * Optional tenant middleware - doesn't fail if no tenant found
 */
export const optionalTenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tenantId: string | null = null;

    // Same extraction logic as above
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        if (decoded.tenantId) {
          tenantId = decoded.tenantId;
        }
      } catch (error) {
        // Token invalid, continue
      }
    }

    if (!tenantId) {
      const host = req.get('host') || '';
      const subdomain = host.split('.')[0];
      const skipSubdomains = ['www', 'api', 'app', 'admin', 'localhost', '127.0.0.1'];
      if (!skipSubdomains.includes(subdomain) && subdomain !== host) {
        tenantId = subdomain;
      }
    }

    if (!tenantId && req.query.tenant) {
      tenantId = req.query.tenant as string;
    }

    if (!tenantId && req.headers['x-tenant-id']) {
      tenantId = req.headers['x-tenant-id'] as string;
    }

    if (tenantId) {
      const tenant = await Tenant.findOne({ tenantId, isActive: true });
      if (tenant && (tenant.subscription.status === 'active' || tenant.subscription.status === 'trial')) {
        req.tenantId = tenantId;
        req.tenant = tenant;
      }
    }

    next();
  } catch (error) {
    console.error('Optional tenant middleware error:', error);
    next(); // Continue even if error
  }
};

/**
 * Permission middleware - checks if user has required permission
 */
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!req.user.hasPermission(permission)) {
        return res.status(403).json({
          success: false,
          message: `Permission '${permission}' required`
        });
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error in permission middleware'
      });
    }
  };
};

/**
 * Role middleware - checks if user has required role
 */
export const requireRole = (roles: string | string[]) => {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.tenantRole || req.user.globalRole;
      if (!roleArray.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Role '${roleArray.join(' or ')}' required`
        });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error in role middleware'
      });
    }
  };
};

/**
 * Usage limit middleware - checks if tenant is within usage limits
 */
export const checkUsageLimit = (type: 'workOrders' | 'users' | 'storage' | 'apiCalls') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.tenant) {
        return res.status(400).json({
          success: false,
          message: 'Tenant information required'
        });
      }

      const limit = req.tenant.subscription.limits[type];
      const usage = req.tenant.usage[type];

      // -1 means unlimited
      if (limit !== -1 && usage >= limit) {
        return res.status(429).json({
          success: false,
          message: `Usage limit exceeded for ${type}`,
          limit,
          usage
        });
      }

      next();
    } catch (error) {
      console.error('Usage limit middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error in usage limit middleware'
      });
    }
  };
};

/**
 * Feature access middleware - checks if tenant has required feature
 */
export const requireFeature = (feature: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.tenant) {
        return res.status(400).json({
          success: false,
          message: 'Tenant information required'
        });
      }

      if (!req.tenant.hasFeature(feature)) {
        return res.status(403).json({
          success: false,
          message: `Feature '${feature}' not available in current plan`,
          currentPlan: req.tenant.subscription.plan
        });
      }

      next();
    } catch (error) {
      console.error('Feature middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error in feature middleware'
      });
    }
  };
};

/**
 * Tenant context middleware - adds tenant context to all queries
 */
export const tenantContext = (req: Request, res: Response, next: NextFunction) => {
  if (req.tenantId) {
    // Add tenant context to request for use in controllers
    req.tenantContext = {
      tenantId: req.tenantId,
      tenant: req.tenant
    };
  }
  next();
};
