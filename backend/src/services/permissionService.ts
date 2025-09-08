export type TenantRole = 'owner' | 'manager' | 'technician';
export type GlobalRole = 'super_admin' | 'admin';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  role: TenantRole | GlobalRole;
  permissions: Permission[];
  description: string;
}

export class PermissionService {
  // Define permissions for each role
  static readonly ROLE_PERMISSIONS: Record<TenantRole | GlobalRole, RolePermissions> = {
    // Tenant Roles
    owner: {
      role: 'owner',
      description: 'İşletme sahibi - Tüm yetkilere sahip',
      permissions: [
        { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'manage_roles'] },
        { resource: 'workOrders', actions: ['create', 'read', 'update', 'delete', 'assign'] },
        { resource: 'vehicles', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'appointments', actions: ['create', 'read', 'update', 'delete', 'manage'] },
        { resource: 'inventory', actions: ['create', 'read', 'update', 'delete', 'manage'] },
        { resource: 'reports', actions: ['create', 'read', 'export', 'analytics'] },
        { resource: 'subscription', actions: ['read', 'update', 'cancel', 'billing'] },
        { resource: 'settings', actions: ['read', 'update', 'manage'] },
        { resource: 'integrations', actions: ['read', 'update', 'manage'] },
        { resource: 'notifications', actions: ['read', 'update', 'manage'] },
        { resource: 'backup', actions: ['create', 'restore', 'manage'] }
      ]
    },
    
    manager: {
      role: 'manager',
      description: 'Yönetici - İşletme yönetimi yetkileri',
      permissions: [
        { resource: 'users', actions: ['create', 'read', 'update'] },
        { resource: 'workOrders', actions: ['create', 'read', 'update', 'assign'] },
        { resource: 'vehicles', actions: ['create', 'read', 'update'] },
        { resource: 'customers', actions: ['create', 'read', 'update'] },
        { resource: 'appointments', actions: ['create', 'read', 'update', 'manage'] },
        { resource: 'inventory', actions: ['create', 'read', 'update'] },
        { resource: 'reports', actions: ['read', 'export'] },
        { resource: 'subscription', actions: ['read'] },
        { resource: 'settings', actions: ['read', 'update'] },
        { resource: 'notifications', actions: ['read', 'update'] }
      ]
    },
    
    technician: {
      role: 'technician',
      description: 'Teknisyen - İş emri ve araç yönetimi yetkileri',
      permissions: [
        { resource: 'workOrders', actions: ['read', 'update', 'assign'] },
        { resource: 'vehicles', actions: ['read', 'update'] },
        { resource: 'customers', actions: ['read'] },
        { resource: 'appointments', actions: ['read', 'update'] },
        { resource: 'inventory', actions: ['read', 'update'] },
        { resource: 'reports', actions: ['read'] },
        { resource: 'notifications', actions: ['read'] }
      ]
    },
    
    // Global Roles
    super_admin: {
      role: 'super_admin',
      description: 'Süper yönetici - Sistem geneli tüm yetkiler',
      permissions: [
        { resource: 'tenants', actions: ['create', 'read', 'update', 'delete', 'manage'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'manage_roles'] },
        { resource: 'subscriptions', actions: ['read', 'update', 'cancel', 'analytics'] },
        { resource: 'system', actions: ['read', 'update', 'manage', 'monitor'] },
        { resource: 'analytics', actions: ['read', 'export', 'global'] },
        { resource: 'backup', actions: ['create', 'restore', 'manage', 'global'] }
      ]
    },
    
    admin: {
      role: 'admin',
      description: 'Yönetici - Sistem yönetimi yetkileri',
      permissions: [
        { resource: 'tenants', actions: ['read', 'update'] },
        { resource: 'users', actions: ['read', 'update'] },
        { resource: 'subscriptions', actions: ['read', 'analytics'] },
        { resource: 'system', actions: ['read', 'monitor'] },
        { resource: 'analytics', actions: ['read', 'export'] }
      ]
    }
  };

  // Check if user has permission for specific resource and action
  static hasPermission(
    userRole: TenantRole | GlobalRole, 
    resource: string, 
    action: string
  ): boolean {
    const rolePermissions = this.ROLE_PERMISSIONS[userRole];
    if (!rolePermissions) return false;

    const permission = rolePermissions.permissions.find(p => p.resource === resource);
    if (!permission) return false;

    return permission.actions.includes(action) || permission.actions.includes('*');
  }

  // Get all permissions for a role
  static getRolePermissions(role: TenantRole | GlobalRole): Permission[] {
    const rolePermissions = this.ROLE_PERMISSIONS[role];
    return rolePermissions ? rolePermissions.permissions : [];
  }

  // Get role description
  static getRoleDescription(role: TenantRole | GlobalRole): string {
    const rolePermissions = this.ROLE_PERMISSIONS[role];
    return rolePermissions ? rolePermissions.description : '';
  }

  // Check if user can perform multiple actions
  static hasAnyPermission(
    userRole: TenantRole | GlobalRole, 
    resource: string, 
    actions: string[]
  ): boolean {
    return actions.some(action => this.hasPermission(userRole, resource, action));
  }

  // Check if user can perform all actions
  static hasAllPermissions(
    userRole: TenantRole | GlobalRole, 
    resource: string, 
    actions: string[]
  ): boolean {
    return actions.every(action => this.hasPermission(userRole, resource, action));
  }

  // Get available actions for a resource
  static getAvailableActions(userRole: TenantRole | GlobalRole, resource: string): string[] {
    const rolePermissions = this.ROLE_PERMISSIONS[userRole];
    if (!rolePermissions) return [];

    const permission = rolePermissions.permissions.find(p => p.resource === resource);
    return permission ? permission.actions : [];
  }

  // Check if role is tenant role
  static isTenantRole(role: string): role is TenantRole {
    return ['owner', 'manager', 'technician'].includes(role);
  }

  // Check if role is global role
  static isGlobalRole(role: string): role is GlobalRole {
    return ['super_admin', 'admin'].includes(role);
  }

  // Get role hierarchy level (higher number = more permissions)
  static getRoleLevel(role: TenantRole | GlobalRole): number {
    const levels = {
      technician: 1,
      manager: 2,
      owner: 3,
      admin: 4,
      super_admin: 5
    };
    return levels[role] || 0;
  }

  // Check if user role is higher than or equal to required role
  static hasRoleLevel(userRole: TenantRole | GlobalRole, requiredRole: TenantRole | GlobalRole): boolean {
    return this.getRoleLevel(userRole) >= this.getRoleLevel(requiredRole);
  }

  // Get all available roles
  static getAllRoles(): Array<{ role: TenantRole | GlobalRole; description: string }> {
    return Object.values(this.ROLE_PERMISSIONS).map(rp => ({
      role: rp.role,
      description: rp.description
    }));
  }

  // Get tenant roles only
  static getTenantRoles(): Array<{ role: TenantRole; description: string }> {
    return Object.values(this.ROLE_PERMISSIONS)
      .filter(rp => this.isTenantRole(rp.role))
      .map(rp => ({
        role: rp.role as TenantRole,
        description: rp.description
      }));
  }

  // Get global roles only
  static getGlobalRoles(): Array<{ role: GlobalRole; description: string }> {
    return Object.values(this.ROLE_PERMISSIONS)
      .filter(rp => this.isGlobalRole(rp.role))
      .map(rp => ({
        role: rp.role as GlobalRole,
        description: rp.description
      }));
  }
}

export default PermissionService;
