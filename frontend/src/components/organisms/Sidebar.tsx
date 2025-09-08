import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Icon from '../atoms/Icon';
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
  FileText,
  X
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  permissions?: {
    resource: string;
    action: string;
  };
  roles?: string[];
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { hasPermission, hasRole } = usePermissions();

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
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-modal w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OT</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">OtoTakibim</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Icon icon={X} size="md" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent
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
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>OtoTakibim v1.0.0</p>
              <p>© 2024 Tüm hakları saklıdır</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
