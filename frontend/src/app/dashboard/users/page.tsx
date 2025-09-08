'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';
import DashboardLayout from '../../../components/templates/DashboardLayout';
import RoleGuard from '../../../components/auth/RoleGuard';
import { Button, Input, Badge } from '../../../components/atoms';
import { UserCard, DataTable } from '../../../components/molecules';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tenantRole: 'owner' | 'manager' | 'technician';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission, getRoleDisplayName, getRoleColor } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        _id: '1',
        email: 'owner@example.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '+90 555 123 4567',
        tenantRole: 'owner',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2024-01-20T14:30:00Z'
      },
      {
        _id: '2',
        email: 'manager@example.com',
        firstName: 'Ayşe',
        lastName: 'Demir',
        phone: '+90 555 234 5678',
        tenantRole: 'manager',
        isActive: true,
        createdAt: '2024-01-16T09:00:00Z',
        lastLogin: '2024-01-20T13:15:00Z'
      },
      {
        _id: '3',
        email: 'technician@example.com',
        firstName: 'Mehmet',
        lastName: 'Kaya',
        phone: '+90 555 345 6789',
        tenantRole: 'technician',
        isActive: true,
        createdAt: '2024-01-17T11:00:00Z',
        lastLogin: '2024-01-20T12:00:00Z'
      }
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.tenantRole === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      technician: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateUser = () => {
    if (!hasPermission('users', 'create')) {
      toast.error('Kullanıcı oluşturma yetkiniz yok');
      return;
    }
    setShowCreateModal(true);
  };

  const handleEditUser = (userId: string) => {
    if (!hasPermission('users', 'update')) {
      toast.error('Kullanıcı düzenleme yetkiniz yok');
      return;
    }
    toast.success('Kullanıcı düzenleme özelliği yakında eklenecek');
  };

  const handleDeleteUser = (userId: string) => {
    if (!hasPermission('users', 'delete')) {
      toast.error('Kullanıcı silme yetkiniz yok');
      return;
    }
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      toast.success('Kullanıcı silme özelliği yakında eklenecek');
    }
  };

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    if (!hasPermission('users', 'update')) {
      toast.error('Kullanıcı durumu değiştirme yetkiniz yok');
      return;
    }
    toast.success(`Kullanıcı ${currentStatus ? 'deaktif' : 'aktif'} edildi`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <RoleGuard allowedRoles={['owner', 'manager']}>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600">İşletmenizin kullanıcılarını yönetin</p>
          </div>
          <button
            onClick={handleCreateUser}
            disabled={!hasPermission('users', 'create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kullanıcı
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Yönetici</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => ['owner', 'manager'].includes(u.tenantRole)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <UserX className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Deaktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => !u.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Roller</option>
                <option value="owner">İşletme Sahibi</option>
                <option value="manager">Yönetici</option>
                <option value="technician">Teknisyen</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Deaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Giriş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.tenantRole)}`}>
                        {getRoleDisplayName()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Deaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('tr-TR')
                        : 'Hiç giriş yapmamış'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user._id)}
                          disabled={!hasPermission('users', 'update')}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                          disabled={!hasPermission('users', 'update')}
                          className={`${
                            user.isActive 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={!hasPermission('users', 'delete')}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Kullanıcı bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinize uygun kullanıcı bulunamadı.
            </p>
          </div>
        )}
        </div>
      </RoleGuard>
    </DashboardLayout>
  );
};

export default UsersPage;
