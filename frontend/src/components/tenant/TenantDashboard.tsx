"use client";

import React, { useState, useEffect } from 'react';
import { useTenantRouting } from '../../hooks/useTenantRouting';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { StatsCard, DataTable } from '../molecules';
import { Card } from '../atoms';
import { 
  Wrench, 
  Car, 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Package,
  Brain,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export interface TenantDashboardProps {
  className?: string;
}

const TenantDashboard: React.FC<TenantDashboardProps> = ({ className = '' }) => {
  const { currentTenant, settings, getTenantRoutes } = useTenantRouting();
  const { user } = useAuth();
  const { hasPermission, hasRole } = usePermissions();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load analytics data
        // const analyticsData = await tenantService.getTenantAnalytics(currentTenant._id);
        // setAnalytics(analyticsData);
        
        // Load recent work orders
        // const workOrders = await workOrderService.getWorkOrders({ limit: 5 });
        // setRecentWorkOrders(workOrders);
        
        // Mock data for now
        setAnalytics({
          workOrders: { total: 24, completed: 18, pending: 4, cancelled: 2 },
          revenue: { total: 125000, average: 5208, growth: 12.5 },
          customers: { total: 156, new: 8, active: 142 },
          vehicles: { total: 89, active: 76, maintenance: 13 }
        });
        
        setRecentWorkOrders([
          { _id: '1', vehicle: 'Toyota Corolla', customer: 'Ahmet Yılmaz', status: 'completed', date: '2024-01-20' },
          { _id: '2', vehicle: 'BMW 320i', customer: 'Ayşe Demir', status: 'pending', date: '2024-01-19' },
          { _id: '3', vehicle: 'Mercedes C200', customer: 'Mehmet Kaya', status: 'in_progress', date: '2024-01-18' }
        ]);
        
      } catch (error) {
        console.error('Dashboard data loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentTenant) {
      loadDashboardData();
    }
  }, [currentTenant]);

  const getRoleDisplayName = () => {
    const roleNames = {
      owner: 'İşletme Sahibi',
      manager: 'Yönetici',
      technician: 'Teknisyen'
    };
    return roleNames[user?.tenantRole as keyof typeof roleNames] || 'Kullanıcı';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      in_progress: 'text-blue-600 bg-blue-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (status: string) => {
    const texts = {
      completed: 'Tamamlandı',
      pending: 'Beklemede',
      in_progress: 'Devam Ediyor',
      cancelled: 'İptal Edildi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Hoş geldiniz, {user?.firstName}!
        </h1>
        <p className="text-blue-100">
          {currentTenant?.name} işletmenizin dashboard'ına hoş geldiniz. 
          Bugün {getRoleDisplayName()} olarak giriş yaptınız.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Toplam İş Emri"
          value={analytics?.workOrders?.total || 0}
          icon={Wrench}
          color="blue"
          change={{ value: '+12%', type: 'positive' }}
        />
        <StatsCard
          title="Aktif Araç"
          value={analytics?.vehicles?.active || 0}
          icon={Car}
          color="green"
          change={{ value: '+8%', type: 'positive' }}
        />
        <StatsCard
          title="Müşteri Sayısı"
          value={analytics?.customers?.total || 0}
          icon={Users}
          color="purple"
          change={{ value: '+5%', type: 'positive' }}
        />
        <StatsCard
          title="Aylık Gelir"
          value={`₺${analytics?.revenue?.total?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="yellow"
          change={{ value: `+${analytics?.revenue?.growth || 0}%`, type: 'positive' }}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getTenantRoutes()
            .filter(route => route.path !== '/dashboard' && route.path !== '/settings')
            .slice(0, 4)
            .map((route) => {
              if (!hasPermission(route.permissions?.resource || '', route.permissions?.action || '')) {
                return null;
              }
              
              return (
                <button
                  key={route.path}
                  onClick={() => window.location.href = route.path}
                  className="p-4 text-center rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-blue-600 mb-2">
                    {route.icon === 'Wrench' && <Wrench className="w-6 h-6 mx-auto" />}
                    {route.icon === 'Car' && <Car className="w-6 h-6 mx-auto" />}
                    {route.icon === 'Users' && <Users className="w-6 h-6 mx-auto" />}
                    {route.icon === 'Calendar' && <Calendar className="w-6 h-6 mx-auto" />}
                    {route.icon === 'Package' && <Package className="w-6 h-6 mx-auto" />}
                    {route.icon === 'Brain' && <Brain className="w-6 h-6 mx-auto" />}
                    {route.icon === 'BarChart3' && <BarChart3 className="w-6 h-6 mx-auto" />}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {route.label}
                  </div>
                </button>
              );
            })}
        </div>
      </Card>

      {/* Recent Work Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İş Emirleri</h3>
          <div className="space-y-3">
            {recentWorkOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.vehicle}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subscription Status */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Abonelik Durumu</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium text-gray-900">
                {currentTenant?.subscription.plan.charAt(0).toUpperCase() + 
                 currentTenant?.subscription.plan.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Durum</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                currentTenant?.subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                currentTenant?.subscription.status === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentTenant?.subscription.status === 'active' ? 'Aktif' :
                 currentTenant?.subscription.status === 'trial' ? 'Deneme' : 'İptal'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Kullanım</span>
              <span className="text-sm text-gray-900">
                {currentTenant?.usage.workOrders || 0} / {currentTenant?.subscription.limits.workOrders === -1 ? '∞' : currentTenant?.subscription.limits.workOrders}
              </span>
            </div>
            {currentTenant?.subscription.status === 'trial' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-800">
                    Deneme süreniz {new Date(currentTenant.subscription.expiresAt).toLocaleDateString('tr-TR')} tarihinde sona eriyor.
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Feature Status */}
      {settings?.features && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Özellik Durumu</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(settings.features).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center space-x-2">
                {enabled ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                )}
                <span className={`text-sm ${enabled ? 'text-green-700' : 'text-gray-500'}`}>
                  {feature === 'aiDiagnostics' ? 'AI Tanı' :
                   feature === 'predictiveMaintenance' ? 'Öngörülü Bakım' :
                   feature === 'inventoryManagement' ? 'Envanter Yönetimi' :
                   feature === 'customerPortal' ? 'Müşteri Portalı' :
                   feature === 'mobileApp' ? 'Mobil Uygulama' :
                   feature === 'apiAccess' ? 'API Erişimi' :
                   feature === 'whiteLabel' ? 'White Label' : feature}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TenantDashboard;
