import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { useEffect, useCallback } from 'react';

export interface TenantRoute {
  path: string;
  label: string;
  icon?: string;
  permissions?: {
    resource: string;
    action: string;
  };
  roles?: string[];
  children?: TenantRoute[];
}

export const useTenantRouting = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { currentTenant, settings } = useTenant();

  // Get tenant-specific base path
  const getTenantBasePath = useCallback(() => {
    if (!currentTenant) return '/dashboard';
    
    // If tenant has custom domain, use root path
    if (settings?.branding?.customDomain) {
      return '';
    }
    
    // Otherwise use tenant slug
    return `/t/${currentTenant.slug}`;
  }, [currentTenant, settings]);

  // Get full tenant path
  const getTenantPath = useCallback((path: string) => {
    const basePath = getTenantBasePath();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    if (basePath === '') {
      return cleanPath;
    }
    
    return `${basePath}${cleanPath}`;
  }, [getTenantBasePath]);

  // Navigate to tenant-specific route
  const navigateToTenantRoute = useCallback((path: string) => {
    const fullPath = getTenantPath(path);
    router.push(fullPath);
  }, [router, getTenantPath]);

  // Check if current path is tenant-specific
  const isTenantRoute = useCallback(() => {
    if (!currentTenant) return false;
    
    const basePath = getTenantBasePath();
    if (basePath === '') {
      // Custom domain - all paths are tenant-specific
      return true;
    }
    
    return pathname.startsWith(basePath);
  }, [pathname, currentTenant, getTenantBasePath]);

  // Get current tenant route (without tenant prefix)
  const getCurrentTenantRoute = useCallback(() => {
    if (!isTenantRoute()) return null;
    
    const basePath = getTenantBasePath();
    if (basePath === '') {
      return pathname;
    }
    
    return pathname.replace(basePath, '') || '/';
  }, [pathname, isTenantRoute, getTenantBasePath]);

  // Redirect to tenant dashboard if not on tenant route
  const ensureTenantRoute = useCallback(() => {
    if (!isAuthenticated || !user || !currentTenant) return;
    
    if (!isTenantRoute()) {
      navigateToTenantRoute('/dashboard');
    }
  }, [isAuthenticated, user, currentTenant, isTenantRoute, navigateToTenantRoute]);

  // Auto-redirect on mount
  useEffect(() => {
    ensureTenantRoute();
  }, [ensureTenantRoute]);

  // Tenant-specific routes configuration
  const getTenantRoutes = useCallback((): TenantRoute[] => {
    if (!currentTenant) return [];

    const baseRoutes: TenantRoute[] = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        permissions: { resource: 'dashboard', action: 'read' }
      },
      {
        path: '/work-orders',
        label: 'İş Emirleri',
        icon: 'Wrench',
        permissions: { resource: 'workOrders', action: 'read' }
      },
      {
        path: '/vehicles',
        label: 'Araçlar',
        icon: 'Car',
        permissions: { resource: 'vehicles', action: 'read' }
      },
      {
        path: '/customers',
        label: 'Müşteriler',
        icon: 'Users',
        permissions: { resource: 'customers', action: 'read' }
      },
      {
        path: '/appointments',
        label: 'Randevular',
        icon: 'Calendar',
        permissions: { resource: 'appointments', action: 'read' }
      }
    ];

    // Add feature-based routes
    if (settings?.features?.inventoryManagement) {
      baseRoutes.push({
        path: '/inventory',
        label: 'Envanter',
        icon: 'Package',
        permissions: { resource: 'inventory', action: 'read' }
      });
    }

    if (settings?.features?.aiDiagnostics) {
      baseRoutes.push({
        path: '/ai-diagnostics',
        label: 'AI Tanı',
        icon: 'Brain',
        permissions: { resource: 'aiDiagnostics', action: 'read' }
      });
    }

    baseRoutes.push({
      path: '/reports',
      label: 'Raporlar',
      icon: 'BarChart3',
      permissions: { resource: 'reports', action: 'read' }
    });

    // Add admin routes for owners/managers
    if (user?.tenantRole === 'owner' || user?.tenantRole === 'manager') {
      baseRoutes.push({
        path: '/users',
        label: 'Kullanıcılar',
        icon: 'Shield',
        permissions: { resource: 'users', action: 'read' },
        roles: ['owner', 'manager']
      });
    }

    if (user?.tenantRole === 'owner') {
      baseRoutes.push({
        path: '/subscription',
        label: 'Abonelik',
        icon: 'CreditCard',
        permissions: { resource: 'subscription', action: 'read' },
        roles: ['owner']
      });
    }

    baseRoutes.push({
      path: '/settings',
      label: 'Ayarlar',
      icon: 'Settings',
      permissions: { resource: 'settings', action: 'read' }
    });

    return baseRoutes;
  }, [currentTenant, settings, user]);

  // Get breadcrumbs for current route
  const getBreadcrumbs = useCallback(() => {
    const currentRoute = getCurrentTenantRoute();
    if (!currentRoute) return [];

    const routes = getTenantRoutes();
    const breadcrumbs = [];

    // Find matching route
    const findRoute = (path: string, routeList: TenantRoute[]): TenantRoute | null => {
      for (const route of routeList) {
        if (route.path === path) return route;
        if (route.children) {
          const found = findRoute(path, route.children);
          if (found) return found;
        }
      }
      return null;
    };

    const route = findRoute(currentRoute, routes);
    if (route) {
      breadcrumbs.push({
        label: route.label,
        path: getTenantPath(route.path),
        current: true
      });
    }

    return breadcrumbs;
  }, [getCurrentTenantRoute, getTenantRoutes, getTenantPath]);

  return {
    // State
    currentTenant,
    settings,
    isTenantRoute: isTenantRoute(),
    currentRoute: getCurrentTenantRoute(),
    
    // Navigation
    navigateToTenantRoute,
    getTenantPath,
    getTenantBasePath,
    
    // Routes
    getTenantRoutes,
    getBreadcrumbs,
    
    // Utilities
    ensureTenantRoute
  };
};
