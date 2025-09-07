'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Settings,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Bell,
  Globe,
  Server,
  HardDrive,
  Activity
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'data_access' | 'data_export' | 'data_delete' | 'password_change' | 'permission_change';
  user: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

interface DataBackup {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  size: string;
  status: 'completed' | 'in_progress' | 'failed';
  createdAt: Date;
  retentionDays: number;
}

interface ComplianceStatus {
  gdpr: {
    status: 'compliant' | 'partial' | 'non_compliant';
    score: number;
    lastAudit: Date;
    issues: string[];
  };
  dataRetention: {
    status: 'compliant' | 'partial' | 'non_compliant';
    score: number;
    lastAudit: Date;
    issues: string[];
  };
  encryption: {
    status: 'compliant' | 'partial' | 'non_compliant';
    score: number;
    lastAudit: Date;
    issues: string[];
  };
}

export default function SecurityPage() {
  const { user } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [backups, setBackups] = useState<DataBackup[]>([]);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login',
          user: user?.email || 'user@example.com',
          timestamp: new Date('2024-09-03T10:30:00'),
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Başarılı giriş'
        },
        {
          id: '2',
          type: 'data_access',
          user: user?.email || 'user@example.com',
          timestamp: new Date('2024-09-03T10:25:00'),
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Müşteri verilerine erişim'
        },
        {
          id: '3',
          type: 'data_export',
          user: user?.email || 'user@example.com',
          timestamp: new Date('2024-09-02T15:45:00'),
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Finansal rapor dışa aktarıldı'
        },
        {
          id: '4',
          type: 'password_change',
          user: user?.email || 'user@example.com',
          timestamp: new Date('2024-09-01T14:20:00'),
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Şifre başarıyla değiştirildi'
        }
      ];

      const mockBackups: DataBackup[] = [
        {
          id: '1',
          type: 'full',
          size: '2.4 GB',
          status: 'completed',
          createdAt: new Date('2024-09-03T02:00:00'),
          retentionDays: 30
        },
        {
          id: '2',
          type: 'incremental',
          size: '156 MB',
          status: 'completed',
          createdAt: new Date('2024-09-02T02:00:00'),
          retentionDays: 7
        },
        {
          id: '3',
          type: 'incremental',
          size: '89 MB',
          status: 'completed',
          createdAt: new Date('2024-09-01T02:00:00'),
          retentionDays: 7
        }
      ];

      const mockCompliance: ComplianceStatus = {
        gdpr: {
          status: 'compliant',
          score: 95,
          lastAudit: new Date('2024-08-15'),
          issues: []
        },
        dataRetention: {
          status: 'compliant',
          score: 88,
          lastAudit: new Date('2024-08-20'),
          issues: ['Eski müşteri verileri temizlenmeli']
        },
        encryption: {
          status: 'compliant',
          score: 100,
          lastAudit: new Date('2024-08-25'),
          issues: []
        }
      };

      setSecurityEvents(mockEvents);
      setBackups(mockBackups);
      setCompliance(mockCompliance);
    } catch (error) {
      console.error('Security data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'login': return 'Giriş';
      case 'logout': return 'Çıkış';
      case 'data_access': return 'Veri Erişimi';
      case 'data_export': return 'Veri Dışa Aktarma';
      case 'data_delete': return 'Veri Silme';
      case 'password_change': return 'Şifre Değişikliği';
      case 'permission_change': return 'İzin Değişikliği';
      default: return type;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="w-4 h-4" />;
      case 'logout': return <User className="w-4 h-4" />;
      case 'data_access': return <Database className="w-4 h-4" />;
      case 'data_export': return <Download className="w-4 h-4" />;
      case 'data_delete': return <Trash2 className="w-4 h-4" />;
      case 'password_change': return <Key className="w-4 h-4" />;
      case 'permission_change': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'non_compliant': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5" />;
      case 'partial': return <AlertTriangle className="w-5 h-5" />;
      case 'non_compliant': return <AlertTriangle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
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

  const handlePasswordChange = () => {
    // Password change logic
    console.log('Password change requested');
  };

  const handleDataExport = () => {
    // Data export logic
    console.log('Data export requested');
  };

  const handleBackupNow = () => {
    // Backup logic
    console.log('Backup requested');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Güvenlik verileri yükleniyor...</p>
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
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Güvenlik & Uyumluluk</h1>
                <p className="text-gray-600">Veri güvenliği, GDPR uyumluluğu ve denetim logları</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAuditLogs(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Denetim Logları</span>
              </button>
              <button
                onClick={handleBackupNow}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <HardDrive className="w-4 h-4" />
                <span>Yedekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Güvenlik Skoru</p>
                <p className="text-2xl font-bold text-gray-900">94/100</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">GDPR Uyumluluğu</p>
                <p className="text-2xl font-bold text-gray-900">95%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Veri Şifreleme</p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Son Yedekleme</p>
                <p className="text-2xl font-bold text-gray-900">2 saat önce</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Server className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        {compliance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Uyumluluk Durumu</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getComplianceColor(compliance.gdpr.status)}`}>
                    {getComplianceIcon(compliance.gdpr.status)}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">GDPR Uyumluluğu</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{compliance.gdpr.score}%</p>
                  <p className="text-sm text-gray-600">Son denetim: {formatDate(compliance.gdpr.lastAudit)}</p>
                </div>
                
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getComplianceColor(compliance.dataRetention.status)}`}>
                    {getComplianceIcon(compliance.dataRetention.status)}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Veri Saklama</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{compliance.dataRetention.score}%</p>
                  <p className="text-sm text-gray-600">Son denetim: {formatDate(compliance.dataRetention.lastAudit)}</p>
                </div>
                
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getComplianceColor(compliance.encryption.status)}`}>
                    {getComplianceIcon(compliance.encryption.status)}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Şifreleme</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{compliance.encryption.score}%</p>
                  <p className="text-sm text-gray-600">Son denetim: {formatDate(compliance.encryption.lastAudit)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Password Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Şifre Yönetimi</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Şifre Güçlülüğü</p>
                  <p className="text-sm text-gray-600">Güçlü şifre kullanılıyor</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">İki Faktörlü Doğrulama</p>
                  <p className="text-sm text-gray-600">Aktif</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Şifre Değiştir
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Veri Yönetimi</h3>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setShowDataExport(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Verileri Dışa Aktar</span>
              </button>
              <button
                onClick={() => console.log('Data deletion requested')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hesabı Sil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Security Events */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Son Güvenlik Olayları</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {securityEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{getEventTypeLabel(event.type)}</p>
                      <p className="text-sm text-gray-600">{event.details}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.timestamp)} • {event.ip}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                    <span className="text-sm font-medium capitalize">{event.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backup Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Yedekleme Durumu</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {backup.type === 'full' ? 'Tam Yedek' : 
                         backup.type === 'incremental' ? 'Artımlı Yedek' : 'Diferansiyel Yedek'}
                      </p>
                      <p className="text-sm text-gray-600">{backup.size} • {formatDate(backup.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                      backup.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {backup.status === 'completed' ? 'Tamamlandı' :
                       backup.status === 'in_progress' ? 'Devam Ediyor' : 'Başarısız'}
                    </span>
                    <span className="text-xs text-gray-500">{backup.retentionDays} gün</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
