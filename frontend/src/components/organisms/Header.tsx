import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  showMenuButton = false,
  className = ''
}) => {
  const { user, logout } = useAuth();
  const { getRoleDisplayName } = usePermissions();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Icon icon={Menu} size="md" />
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OT</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
              OtoTakibim
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative"
            >
              <Icon icon={Bell} size="md" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-center">Yeni bildirim yok</p>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              <Avatar
                name={user ? `${user.firstName} ${user.lastName}` : 'User'}
                size="sm"
                status="online"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleDisplayName()}
                </p>
              </div>
              <Icon icon={ChevronDown} size="sm" color="gray" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <a
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon icon={User} size="sm" className="mr-3" />
                    Profil
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon icon={Settings} size="sm" className="mr-3" />
                    Ayarlar
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon icon={LogOut} size="sm" className="mr-3" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
