import React from 'react';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import Icon from '../atoms/Icon';
import { MoreVertical, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

export interface UserCardProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    tenantRole: 'owner' | 'manager' | 'technician';
    isActive: boolean;
    lastLogin?: string;
  };
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  onToggleStatus?: (userId: string, currentStatus: boolean) => void;
  showActions?: boolean;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  showActions = true,
  className = ''
}) => {
  const getRoleBadgeColor = (role: string) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      technician: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleDisplayName = (role: string) => {
    const names = {
      owner: 'İşletme Sahibi',
      manager: 'Yönetici',
      technician: 'Teknisyen'
    };
    return names[role as keyof typeof names] || role;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            size="md"
            status={user.isActive ? 'online' : 'offline'}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-500 truncate">{user.phone}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Badge
                text={getRoleDisplayName(user.tenantRole)}
                color="secondary"
                className={getRoleBadgeColor(user.tenantRole)}
              />
              <Badge
                text={user.isActive ? 'Aktif' : 'Deaktif'}
                color={user.isActive ? 'success' : 'error'}
              />
            </div>
            {user.lastLogin && (
              <p className="text-xs text-gray-400 mt-1">
                Son giriş: {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
              </p>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(user._id)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Düzenle"
              >
                <Icon icon={Edit} size="sm" />
              </button>
            )}
            {onToggleStatus && (
              <button
                onClick={() => onToggleStatus(user._id, user.isActive)}
                className={`p-1 transition-colors ${
                  user.isActive 
                    ? 'text-gray-400 hover:text-red-600' 
                    : 'text-gray-400 hover:text-green-600'
                }`}
                title={user.isActive ? 'Deaktif Et' : 'Aktif Et'}
              >
                <Icon icon={user.isActive ? UserX : UserCheck} size="sm" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(user._id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Sil"
              >
                <Icon icon={Trash2} size="sm" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
