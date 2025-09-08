import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

export interface Permission {
  resource: string;
  action: string;
}

export const usePermissions = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Check if user has specific permission
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    const userRole = user.tenantRole || user.globalRole;
    if (!userRole) return false;

    // Super admin and admin have all permissions
    if (['super_admin', 'admin'].includes(userRole)) {
      return true;
    }

    // Define role-based permissions
    const rolePermissions: Record<string, Record<string, string[]>> = {
      owner: {
        users: ['create', 'read', 'update', 'delete', 'manage_roles'],
        workOrders: ['create', 'read', 'update', 'delete', 'assign'],
        vehicles: ['create', 'read', 'update', 'delete'],
        customers: ['create', 'read', 'update', 'delete'],
        appointments: ['create', 'read', 'update', 'delete', 'manage'],
        inventory: ['create', 'read', 'update', 'delete', 'manage'],
        reports: ['create', 'read', 'export', 'analytics'],
        subscription: ['read', 'update', 'cancel', 'billing'],
        settings: ['read', 'update', 'manage'],
        integrations: ['read', 'update', 'manage'],
        notifications: ['read', 'update', 'manage'],
        backup: ['create', 'restore', 'manage']
      },
      manager: {
        users: ['create', 'read', 'update'],
        workOrders: ['create', 'read', 'update', 'assign'],
        vehicles: ['create', 'read', 'update'],
        customers: ['create', 'read', 'update'],
        appointments: ['create', 'read', 'update', 'manage'],
        inventory: ['create', 'read', 'update'],
        reports: ['read', 'export'],
        subscription: ['read'],
        settings: ['read', 'update'],
        notifications: ['read', 'update']
      },
      technician: {
        workOrders: ['read', 'update', 'assign'],
        vehicles: ['read', 'update'],
        customers: ['read'],
        appointments: ['read', 'update'],
        inventory: ['read', 'update'],
        reports: ['read'],
        notifications: ['read']
      }
    };

    const permissions = rolePermissions[userRole];
    if (!permissions) return false;

    const resourcePermissions = permissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions.includes(action) || resourcePermissions.includes('*');
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (resource: string, actions: string[]): boolean => {
    return actions.some(action => hasPermission(resource, action));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (resource: string, actions: string[]): boolean => {
    return actions.every(action => hasPermission(resource, action));
  };

  // Check if user has specific role
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;

    const userRole = user.tenantRole || user.globalRole;
    if (!userRole) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  };

  // Check if user has role level (higher number = more permissions)
  const hasRoleLevel = (requiredRole: string): boolean => {
    if (!user) return false;

    const userRole = user.tenantRole || user.globalRole;
    if (!userRole) return false;

    const roleLevels: Record<string, number> = {
      technician: 1,
      manager: 2,
      owner: 3,
      admin: 4,
      super_admin: 5
    };

    const userLevel = roleLevels[userRole] || 0;
    const requiredLevel = roleLevels[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  // Check if user can access feature based on subscription
  const canAccessFeature = (feature: string): boolean => {
    if (!subscription) return false;
    return subscription.features?.includes(feature) || false;
  };

  // Check if user is within usage limits
  const isWithinLimits = (): boolean => {
    if (!subscription) return false;
    return subscription.isWithinLimits;
  };

  // Get user's available actions for a resource
  const getAvailableActions = (resource: string): string[] => {
    if (!user) return [];

    const userRole = user.tenantRole || user.globalRole;
    if (!userRole) return [];

    // Super admin and admin have all actions
    if (['super_admin', 'admin'].includes(userRole)) {
      return ['create', 'read', 'update', 'delete', 'manage', 'assign', 'export', 'analytics'];
    }

    const rolePermissions: Record<string, Record<string, string[]>> = {
      owner: {
        users: ['create', 'read', 'update', 'delete', 'manage_roles'],
        workOrders: ['create', 'read', 'update', 'delete', 'assign'],
        vehicles: ['create', 'read', 'update', 'delete'],
        customers: ['create', 'read', 'update', 'delete'],
        appointments: ['create', 'read', 'update', 'delete', 'manage'],
        inventory: ['create', 'read', 'update', 'delete', 'manage'],
        reports: ['create', 'read', 'export', 'analytics'],
        subscription: ['read', 'update', 'cancel', 'billing'],
        settings: ['read', 'update', 'manage'],
        integrations: ['read', 'update', 'manage'],
        notifications: ['read', 'update', 'manage'],
        backup: ['create', 'restore', 'manage']
      },
      manager: {
        users: ['create', 'read', 'update'],
        workOrders: ['create', 'read', 'update', 'assign'],
        vehicles: ['create', 'read', 'update'],
        customers: ['create', 'read', 'update'],
        appointments: ['create', 'read', 'update', 'manage'],
        inventory: ['create', 'read', 'update'],
        reports: ['read', 'export'],
        subscription: ['read'],
        settings: ['read', 'update'],
        notifications: ['read', 'update']
      },
      technician: {
        workOrders: ['read', 'update', 'assign'],
        vehicles: ['read', 'update'],
        customers: ['read'],
        appointments: ['read', 'update'],
        inventory: ['read', 'update'],
        reports: ['read'],
        notifications: ['read']
      }
    };

    const permissions = rolePermissions[userRole];
    if (!permissions) return [];

    return permissions[resource] || [];
  };

  // Get user role display name
  const getRoleDisplayName = (): string => {
    if (!user) return 'Misafir';

    const userRole = user.tenantRole || user.globalRole;
    if (!userRole) return 'Kullanıcı';

    const roleNames: Record<string, string> = {
      owner: 'İşletme Sahibi',
      manager: 'Yönetici',
      technician: 'Teknisyen',
      admin: 'Yönetici',
      super_admin: 'Süper Yönetici'
    };

    return roleNames[userRole] || userRole;
  };

  // Get user role color
  const getRoleColor = (): string => {
    if (!user) return 'gray';

    const userRole = user.tenantRole || user.globalRole;
    if (!userRole) return 'gray';

    const roleColors: Record<string, string> = {
      owner: 'purple',
      manager: 'blue',
      technician: 'green',
      admin: 'orange',
      super_admin: 'red'
    };

    return roleColors[userRole] || 'gray';
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasRoleLevel,
    canAccessFeature,
    isWithinLimits,
    getAvailableActions,
    getRoleDisplayName,
    getRoleColor,
    userRole: user?.tenantRole || user?.globalRole,
    isOwner: hasRole('owner'),
    isManager: hasRole('manager'),
    isTechnician: hasRole('technician'),
    isAdmin: hasRole(['admin', 'super_admin']),
    isSuperAdmin: hasRole('super_admin')
  };
};
