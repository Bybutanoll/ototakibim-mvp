'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  Mail,
  MessageSquare,
  Settings,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search
} from 'lucide-react';

interface Notification {
  _id: string;
  type: 'email' | 'sms' | 'push';
  title: string;
  message: string;
  recipient: string;
  status: 'sent' | 'pending' | 'failed' | 'scheduled';
  scheduledDate?: Date;
  sentDate?: Date;
  template: string;
  relatedEntity?: {
    type: 'appointment' | 'work_order' | 'maintenance' | 'customer';
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationTemplate {
  _id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadTemplates();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      } else {
        // Fallback to mock data for demo
        const mockNotifications: Notification[] = [
          {
            _id: '1',
            type: 'email',
            title: 'Randevu Hatırlatması',
            message: 'Yarın saat 10:00\'da BMW 320i aracınız için randevunuz bulunmaktadır.',
            recipient: 'ahmet@email.com',
            status: 'sent',
            sentDate: new Date('2024-09-03T09:00:00'),
            template: 'appointment_reminder',
            relatedEntity: {
              type: 'appointment',
              id: 'apt-001',
              name: 'BMW 320i - Motor Yağı Değişimi'
            },
            createdAt: new Date('2024-09-03T08:30:00'),
            updatedAt: new Date('2024-09-03T09:00:00')
          },
          {
            _id: '2',
            type: 'sms',
            title: 'Bakım Tamamlandı',
            message: 'Aracınızın bakımı tamamlanmıştır. Teslim alabilirsiniz.',
            recipient: '+905321234567',
            status: 'sent',
            sentDate: new Date('2024-09-02T16:30:00'),
            template: 'maintenance_complete',
            relatedEntity: {
              type: 'work_order',
              id: 'wo-002',
              name: 'Mercedes C200 - Fren Sistemi'
            },
            createdAt: new Date('2024-09-02T16:25:00'),
            updatedAt: new Date('2024-09-02T16:30:00')
          },
          {
            _id: '3',
            type: 'email',
            title: 'Bakım Hatırlatması',
            message: 'Aracınızın bir sonraki bakımı yaklaşıyor. Randevu almanızı öneririz.',
            recipient: 'fatma@email.com',
            status: 'scheduled',
            scheduledDate: new Date('2024-09-05T10:00:00'),
            template: 'maintenance_reminder',
            relatedEntity: {
              type: 'maintenance',
              id: 'maint-003',
              name: 'Audi A4 - Genel Bakım'
            },
            createdAt: new Date('2024-09-01T14:00:00'),
            updatedAt: new Date('2024-09-01T14:00:00')
          }
        ];
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Notifications loading error:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/notification-templates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data || []);
      } else {
        // Fallback to mock templates
        const mockTemplates: NotificationTemplate[] = [
          {
            _id: '1',
            name: 'Randevu Hatırlatması',
            type: 'email',
            subject: 'Randevu Hatırlatması - {{vehicle}}',
            content: 'Sayın {{customer}}, {{date}} tarihinde {{time}} saatinde {{vehicle}} aracınız için randevunuz bulunmaktadır.',
            variables: ['customer', 'date', 'time', 'vehicle'],
            isActive: true,
            createdAt: new Date('2024-08-01')
          },
          {
            _id: '2',
            name: 'Bakım Tamamlandı',
            type: 'sms',
            content: 'Aracınızın bakımı tamamlanmıştır. Teslim alabilirsiniz. - OtoTakibim',
            variables: [],
            isActive: true,
            createdAt: new Date('2024-08-01')
          },
          {
            _id: '3',
            name: 'Bakım Hatırlatması',
            type: 'email',
            subject: 'Bakım Hatırlatması - {{vehicle}}',
            content: 'Sayın {{customer}}, {{vehicle}} aracınızın bir sonraki bakımı yaklaşıyor. Randevu almanızı öneririz.',
            variables: ['customer', 'vehicle'],
            isActive: true,
            createdAt: new Date('2024-08-01')
          }
        ];
        setTemplates(mockTemplates);
      }
    } catch (error) {
      console.error('Templates loading error:', error);
      setTemplates([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent': return 'Gönderildi';
      case 'pending': return 'Bekliyor';
      case 'failed': return 'Başarısız';
      case 'scheduled': return 'Zamanlanmış';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Bildirimler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bildirim Yönetimi</h1>
                <p className="text-gray-600">SMS, Email ve Push bildirimleri</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Şablonlar</span>
              </button>
              <button
                onClick={() => setShowNewNotification(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Bildirim Gönder</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Bildirim ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtreler</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="sent">Gönderildi</option>
                    <option value="pending">Bekliyor</option>
                    <option value="failed">Başarısız</option>
                    <option value="scheduled">Zamanlanmış</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Bildirimler ({filteredNotifications.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div key={notification._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            <span className="text-sm font-medium text-gray-900">{notification.title}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                            {getStatusLabel(notification.status)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Alıcı: {notification.recipient}</span>
                          {notification.sentDate && (
                            <span>Gönderim: {formatDate(notification.sentDate)}</span>
                          )}
                          {notification.scheduledDate && (
                            <span>Zamanlanmış: {formatDate(notification.scheduledDate)}</span>
                          )}
                          {notification.relatedEntity && (
                            <span>İlgili: {notification.relatedEntity.name}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Henüz bildirim bulunmuyor</p>
                <button
                  onClick={() => setShowNewNotification(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İlk Bildirimi Gönder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
