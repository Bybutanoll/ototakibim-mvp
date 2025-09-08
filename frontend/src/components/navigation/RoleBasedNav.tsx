import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  Car, 
  Calendar, 
  BarChart3, 
  Settings, 
  CreditCard,
  Shield,
  Package,
  Bell,
  FileText
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  permissions?: {
    resource: string;
    action: string;
  };
  roles?: string[];
  badge?: string;
}

const RoleBasedNav: React.FC = () => {
  const pathname = usePathname();
  const { hasPermission, hasRole, canAccessFeature } = usePermissions();

  const navigationItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      permissions: { resource: 'dashboard', action: 'read' }
    },
    {
      name: 'İş Emirleri',
      href: '/dashboard/work-orders',
      icon: Wrench,
      permissions: { resource: 'workOrders', action: 'read' }
    },
    {
      name: 'Araçlar',
      href: '/dashboard/vehicles',
      icon: Car,
      permissions: { resource: 'vehicles', action: 'read' }
    },
    {
      name: 'Müşteriler',
      href: '/dashboard/customers',
      icon: Users,
      permissions: { resource: 'customers', action: 'read' }
    },
    {
      name: 'Randevular',
      href: '/dashboard/appointments',
      icon: Calendar,
      permissions: { resource: 'appointments', action: 'read' }
    },
    {
      name: 'Envanter',
      href: '/dashboard/inventory',
      icon: Package,
      permissions: { resource: 'inventory', action: 'read' }
    },
    {
      name: 'Raporlar',
      href: '/dashboard/reports',
      icon: BarChart3,
      permissions: { resource: 'reports', action: 'read' }
    },
    {
      name: 'Kullanıcılar',
      href: '/dashboard/users',
      icon: Shield,
      permissions: { resource: 'users', action: 'read' },
      roles: ['owner', 'manager']
    },
    {
      name: 'Abonelik',
      href: '/subscription',
      icon: CreditCard,
      permissions: { resource: 'subscription', action: 'read' },
      roles: ['owner']
    },
    {
      name: 'Bildirimler',
      href: '/dashboard/notifications',
      icon: Bell,
      permissions: { resource: 'notifications', action: 'read' }
    },
    {
      name: 'Ayarlar',
      href: '/dashboard/settings',
      icon: Settings,
      permissions: { resource: 'settings', action: 'read' }
    }
  ];

  const filteredNavigation = navigationItems.filter(item => {
    // Check role-based access
    if (item.roles && !item.roles.some(role => hasRole(role))) {
      return false;
    }

    // Check permission-based access
    if (item.permissions && !hasPermission(item.permissions.resource, item.permissions.action)) {
      return false;
    }

    return true;
  });

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-1">
      {filteredNavigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              active
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default RoleBasedNav;
