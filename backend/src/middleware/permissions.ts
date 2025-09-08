import { Request, Response, NextFunction } from 'express';
import PermissionService from '../services/permissionService';

// Middleware to check specific permission
export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Yetkilendirme gereklidir'
        });
      }

      const userRole = req.user.tenantRole || req.user.globalRole;
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'Kullanıcı rolü bulunamadı'
        });
      }

      const hasPermission = PermissionService.hasPermission(userRole, resource, action);
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `${resource} kaynağında ${action} işlemi için yetkiniz yok`,
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredPermission: { resource, action },
          userRole
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Yetki kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};

// Middleware to check multiple permissions (any one required)
export const requireAnyPermission = (resource: string, actions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Yetkilendirme gereklidir'
        });
      }

      const userRole = req.user.tenantRole || req.user.globalRole;
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'Kullanıcı rolü bulunamadı'
        });
      }

      const hasPermission = PermissionService.hasAnyPermission(userRole, resource, actions);
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `${resource} kaynağında gerekli yetkilerden en az birine sahip değilsiniz`,
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredPermissions: { resource, actions },
          userRole
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Yetki kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};

// Middleware to check multiple permissions (all required)
export const requireAllPermissions = (resource: string, actions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Yetkilendirme gereklidir'
        });
      }

      const userRole = req.user.tenantRole || req.user.globalRole;
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'Kullanıcı rolü bulunamadı'
        });
      }

      const hasPermission = PermissionService.hasAllPermissions(userRole, resource, actions);
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `${resource} kaynağında tüm gerekli yetkilere sahip değilsiniz`,
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredPermissions: { resource, actions },
          userRole
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Yetki kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};

// Middleware to check role level
export const requireRoleLevel = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Yetkilendirme gereklidir'
        });
      }

      const userRole = req.user.tenantRole || req.user.globalRole;
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'Kullanıcı rolü bulunamadı'
        });
      }

      const hasLevel = PermissionService.hasRoleLevel(userRole, requiredRole as any);
      if (!hasLevel) {
        return res.status(403).json({
          success: false,
          message: `Bu işlem için ${requiredRole} seviyesinde yetki gereklidir`,
          code: 'INSUFFICIENT_ROLE_LEVEL',
          requiredRole,
          userRole
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Rol seviyesi kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};

// Common permission checks
export const canManageUsers = requirePermission('users', 'manage_roles');
export const canCreateWorkOrders = requirePermission('workOrders', 'create');
export const canDeleteWorkOrders = requirePermission('workOrders', 'delete');
export const canManageInventory = requirePermission('inventory', 'manage');
export const canViewReports = requirePermission('reports', 'read');
export const canExportReports = requirePermission('reports', 'export');
export const canManageSubscription = requirePermission('subscription', 'update');
export const canManageSettings = requirePermission('settings', 'manage');
export const canManageTenants = requirePermission('tenants', 'manage');

// Resource ownership checks
export const checkResourceOwnership = (resourceField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Yetkilendirme gereklidir'
        });
      }

      const userRole = req.user.tenantRole || req.user.globalRole;
      const resourceUserId = req.params[resourceField] || req.body[resourceField];

      // Super admin and admin can access all resources
      if (['super_admin', 'admin'].includes(userRole)) {
        return next();
      }

      // Owner and manager can access all resources in their tenant
      if (['owner', 'manager'].includes(userRole)) {
        return next();
      }

      // Technician can only access their own resources
      if (userRole === 'technician' && resourceUserId !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Sadece kendi kaynaklarınıza erişebilirsiniz',
          code: 'RESOURCE_OWNERSHIP_REQUIRED'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Kaynak sahipliği kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};

// Tenant isolation check
export const requireSameTenant = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Yetkilendirme gereklidir'
      });
    }

    const userRole = req.user.tenantRole || req.user.globalRole;
    
    // Super admin and admin can access all tenants
    if (['super_admin', 'admin'].includes(userRole)) {
      return next();
    }

    // For tenant users, ensure they can only access their own tenant's data
    const requestedTenantId = req.params.tenantId || req.body.tenantId;
    const userTenantId = req.user.tenantId;

    if (requestedTenantId && requestedTenantId !== userTenantId) {
      return res.status(403).json({
        success: false,
        message: 'Sadece kendi işletmenizin verilerine erişebilirsiniz',
        code: 'TENANT_ISOLATION_VIOLATION'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Tenant izolasyon kontrolü yapılırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};
