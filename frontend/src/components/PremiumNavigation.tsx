'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Car, 
  Wrench, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  User,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: NavigationItem[];
  badge?: string | number;
  active?: boolean;
}

export interface PremiumNavigationProps {
  items: NavigationItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onItemClick?: (item: NavigationItem) => void;
  onUserMenuClick?: (action: string) => void;
  className?: string;
}

const PremiumNavigation: React.FC<PremiumNavigationProps> = ({
  items,
  user,
  onItemClick,
  onUserMenuClick,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      onItemClick?.(item);
      setIsOpen(false);
    }
  };

  const defaultItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      active: true,
    },
    {
      id: 'vehicles',
      label: 'Araçlar',
      icon: Car,
      href: '/vehicles',
      badge: 12,
    },
    {
      id: 'maintenance',
      label: 'Bakım',
      icon: Wrench,
      href: '/maintenance',
      children: [
        { id: 'scheduled', label: 'Planlanan Bakımlar', icon: Wrench, href: '/maintenance/scheduled' },
        { id: 'history', label: 'Bakım Geçmişi', icon: BarChart3, href: '/maintenance/history' },
      ],
    },
    {
      id: 'customers',
      label: 'Müşteriler',
      icon: Users,
      href: '/customers',
    },
    {
      id: 'analytics',
      label: 'Analitik',
      icon: BarChart3,
      href: '/analytics',
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: Settings,
      href: '/settings',
    },
  ];

  const navigationItems = items.length > 0 ? items : defaultItems;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-white border-r border-gray-200 shadow-xl lg:shadow-none
          flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">OtoTakibim</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavigationItemComponent
              key={item.id}
              item={item}
              expandedItems={expandedItems}
              onItemClick={handleItemClick}
              level={0}
            />
          ))}
        </nav>

        {/* User Menu */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => onUserMenuClick?.('profile')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Profil</span>
                    </button>
                    <button
                      onClick={() => onUserMenuClick?.('settings')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Ayarlar</span>
                    </button>
                    <hr className="border-gray-200" />
                    <button
                      onClick={() => onUserMenuClick?.('logout')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Çıkış Yap</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
};

// Navigation Item Component
interface NavigationItemComponentProps {
  item: NavigationItem;
  expandedItems: string[];
  onItemClick: (item: NavigationItem) => void;
  level: number;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = ({
  item,
  expandedItems,
  onItemClick,
  level,
}) => {
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <motion.button
        onClick={() => onItemClick(item)}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
          ${item.active 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50'
          }
          ${level > 0 ? 'ml-4' : ''}
        `}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-500'}`} />
        <span className="flex-1 text-left font-medium">{item.label}</span>
        
        {item.badge && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {item.badge}
          </span>
        )}
        
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
        )}
      </motion.button>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1">
              {item.children!.map((child) => (
                <NavigationItemComponent
                  key={child.id}
                  item={child}
                  expandedItems={expandedItems}
                  onItemClick={onItemClick}
                  level={level + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Top Navigation Bar
export interface TopNavigationProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  notifications?: number;
  onNotificationClick?: () => void;
  className?: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  title,
  breadcrumbs,
  actions,
  notifications = 0,
  onNotificationClick,
  className = '',
}) => {
  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 mt-1">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span className="text-gray-400">/</span>}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {actions}
          
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default PremiumNavigation;
