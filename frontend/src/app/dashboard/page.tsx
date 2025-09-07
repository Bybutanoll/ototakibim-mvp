'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AIChatbot from '@/components/AIChatbot';
import { LogoHeader } from '@/components/ui/Logo';
import { vehicleService, Vehicle } from '../../services/vehicleService';
import { workOrderService, WorkOrder } from '../../services/workOrderService';
import { appointmentService, Appointment } from '../../services/appointmentService';
import { 
  LoadingOverlay, 
  InlineLoading, 
  SkeletonCard, 
  useLoadingState 
} from '@/components/LoadingStates';
import { 
  ErrorMessage, 
  NetworkError, 
  EmptyState, 
  useErrorHandler 
} from '@/components/ErrorHandling';
import { SEO, SEOConfigs } from '@/components/SEO';
import { 
  Car, 
  Wrench, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Bell,
  BarChart3,
  Package,
  Smartphone,
  Target,
  Shield,
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  LogOut,
  FileText,
  Brain
} from 'lucide-react';

// Using types from services

interface DashboardStats {
  totalVehicles: number;
  activeWorkOrders: number;
  upcomingAppointments: number;
  monthlyRevenue: number;
  completedServices: number;
  customerSatisfaction: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, state, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeWorkOrders: 0,
    upcomingAppointments: 0,
    monthlyRevenue: 0,
    completedServices: 0,
    customerSatisfaction: 0
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiInsights, setAiInsights] = useState<any>(null);
  
  // Loading and error states
  const { isLoading, startLoading, stopLoading } = useLoadingState(true);
  const { error, handleError, clearError, hasError } = useErrorHandler();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.isLoading, state.isAuthenticated, router]);

  // Redirect to onboarding if not completed (commented out for now)
  // useEffect(() => {
  //   if (user && !user.onboardingCompleted) {
  //     router.push('/dashboard/onboarding');
  //   }
  // }, [user, router]);

  useEffect(() => {
    if (user && state.isAuthenticated) {
      loadDashboardData();
      loadAIInsights();
    }
  }, [user, state.isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      startLoading();
      clearError();
      
      // Load all data in parallel using service layer
      const [vehiclesData, workOrdersData, appointmentsData, vehicleStats, workOrderStats, appointmentStats] = await Promise.allSettled([
        vehicleService.getAllVehicles({ limit: 10 }),
        workOrderService.getAllWorkOrders({ limit: 10 }),
        appointmentService.getAllAppointments({ limit: 10 }),
        vehicleService.getVehicleStats(),
        workOrderService.getWorkOrderStats(),
        appointmentService.getAppointmentStats()
      ]);

      // Process vehicles data
      if (vehiclesData.status === 'fulfilled') {
        setVehicles(vehiclesData.value.vehicles);
      } else if (vehiclesData.status === 'rejected') {
        console.error('Vehicles data failed:', vehiclesData.reason);
      }

      // Process work orders data
      if (workOrdersData.status === 'fulfilled') {
        setWorkOrders(workOrdersData.value.workOrders);
      } else if (workOrdersData.status === 'rejected') {
        console.error('Work orders data failed:', workOrdersData.reason);
      }

      // Process appointments data
      if (appointmentsData.status === 'fulfilled') {
        setAppointments(appointmentsData.value.appointments);
      } else if (appointmentsData.status === 'rejected') {
        console.error('Appointments data failed:', appointmentsData.reason);
      }

      // Calculate dashboard stats from all sources
      const totalVehicles = vehiclesData.status === 'fulfilled' ? vehiclesData.value.total : 0;
      const activeWorkOrders = workOrderStats.status === 'fulfilled' ? 
        workOrderStats.value.pending + workOrderStats.value.in_progress : 0;
      const upcomingAppointments = appointmentStats.status === 'fulfilled' ? 
        appointmentStats.value.scheduled + appointmentStats.value.confirmed : 0;
      const monthlyRevenue = workOrderStats.status === 'fulfilled' ? 
        workOrderStats.value.totalRevenue : 0;
      const completedServices = workOrderStats.status === 'fulfilled' ? 
        workOrderStats.value.completed : 0;
      const customerSatisfaction = 4.8; // Default value, can be calculated from feedback

      setStats({
        totalVehicles,
        activeWorkOrders,
        upcomingAppointments,
        monthlyRevenue,
        completedServices,
        customerSatisfaction
      });

      // Check if all critical data failed
      const criticalFailures = [vehiclesData, workOrdersData, appointmentsData].filter(
        result => result.status === 'rejected'
      ).length;

      if (criticalFailures >= 2) {
        handleError('Veriler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.', 'dashboard_data_load');
      }

    } catch (error) {
      console.error('Dashboard veri yükleme hatası:', error);
      handleError(error instanceof Error ? error : new Error('Beklenmeyen bir hata oluştu'), 'dashboard_load');
    } finally {
      stopLoading();
    }
  };

  const loadAIInsights = async () => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE_URL}/api/ai/dashboard-insights`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.data);
      }
    } catch (error) {
      console.error('AI insights loading error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'on-hold':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  // Show loading while auth is being checked or data is loading
  // Show loading state
  if (state.isLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <SkeletonCard className="h-20" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage 
            error={error!} 
            onRetry={loadDashboardData}
            onDismiss={clearError}
            variant="inline"
          />
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!state.isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <SEO {...SEOConfigs.dashboard} />
      <div className="min-h-screen bg-gray-50">
        {/* Header - Premium Design */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <LogoHeader />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hoş geldin, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  OtoTakibim Dashboard - Araçlarını ve hizmetlerini yönet
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/work-orders/add')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni İş Emri</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/appointments/add')}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Randevu Al</span>
              </button>
              <button
                onClick={() => {
                  logout();
                }}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Premium Design */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Genel Bakış', icon: TrendingUp },
              { id: 'vehicles', name: 'Araçlarım', icon: Car },
              { id: 'work-orders', name: 'İş Emirleri', icon: Wrench },
              { id: 'appointments', name: 'Randevular', icon: Calendar },
              { id: 'customers', name: 'Müşteriler', icon: Users },
              { id: 'finance', name: 'Finans', icon: DollarSign },
              { id: 'payments', name: 'Ödemeler', icon: CreditCard },
              { id: 'inventory', name: 'Envanter', icon: Package },
              { id: 'analytics', name: 'Analitik', icon: BarChart3 },
              { id: 'reports', name: 'Raporlar', icon: FileText },
              { id: 'smart-pricing', name: 'AI Fiyatlandırma', icon: Target },
              { id: 'security', name: 'Güvenlik', icon: Shield },
              { id: 'mobile', name: 'Mobil', icon: Smartphone },
              { id: 'notifications', name: 'Bildirimler', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'vehicles') {
                    router.push('/dashboard/vehicles');
                  } else if (tab.id === 'work-orders') {
                    router.push('/dashboard/work-orders');
                  } else if (tab.id === 'appointments') {
                    router.push('/dashboard/appointments');
                  } else if (tab.id === 'customers') {
                    router.push('/dashboard/customers');
                  } else if (tab.id === 'finance') {
                    router.push('/dashboard/finance');
                  } else if (tab.id === 'payments') {
                    router.push('/dashboard/payments');
                  } else if (tab.id === 'inventory') {
                    router.push('/dashboard/inventory');
                  } else if (tab.id === 'analytics') {
                    router.push('/dashboard/analytics');
                  } else if (tab.id === 'reports') {
                    router.push('/dashboard/reports');
                  } else if (tab.id === 'smart-pricing') {
                    router.push('/dashboard/smart-pricing');
                  } else if (tab.id === 'security') {
                    router.push('/dashboard/security');
                  } else if (tab.id === 'mobile') {
                    router.push('/dashboard/mobile');
                  } else if (tab.id === 'notifications') {
                    router.push('/dashboard/notifications');
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`py-4 px-3 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-300 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards - Premium Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Araç</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aktif İş Emirleri</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeWorkOrders}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Yaklaşan Randevular</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tamamlanan Hizmetler</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Müşteri Memnuniyeti</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.customerSatisfaction}/5.0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Section */}
            {aiInsights && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-3">🤖 AI Öngörüleri</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Insights Summary */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">📊 Özet</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toplam Araç:</span>
                        <span className="font-medium">{aiInsights.totalVehicles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dikkat Gereken:</span>
                        <span className="font-medium text-orange-600">{aiInsights.vehiclesNeedingAttention}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">💡 Öneriler</h4>
                    <div className="space-y-2">
                      {aiInsights.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vehicle Insights */}
                {aiInsights.insights && aiInsights.insights.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">🚗 Araç Detayları</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aiInsights.insights.map((insight: any, index: number) => (
                        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
                          <h5 className="font-medium text-gray-900 mb-2">{insight.vehicleName}</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Acil Bakım:</span>
                              <span className="font-medium text-orange-600">{insight.urgentPredictions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sonraki Servis:</span>
                              <span className="font-medium">{new Date(insight.nextService).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tahmini Maliyet:</span>
                              <span className="font-medium text-green-600">{formatCurrency(insight.estimatedCost)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Vehicles */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Son Eklenen Araçlar</h3>
                  <button
                    onClick={() => router.push('/dashboard/vehicles')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Tümünü Gör
                  </button>
                </div>
                <div className="p-6">
                  {vehicles.length > 0 ? (
                    <div className="space-y-4">
                      {vehicles.slice(0, 3).map((vehicle) => (
                        <div key={vehicle._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{vehicle.brand} {vehicle.vehicleModel}</h4>
                            <p className="text-sm text-gray-600">{vehicle.plate}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {vehicle.year} • {vehicle.mileage.toLocaleString('tr-TR')} km
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => router.push(`/dashboard/vehicles/${vehicle._id}`)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Detay
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Henüz araç eklenmemiş</p>
                      <button
                        onClick={() => router.push('/dashboard/vehicles/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        İlk Aracını Ekle
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Yaklaşan Randevular</h3>
                </div>
                <div className="p-6">
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{appointment.serviceType}</h4>
                            <p className="text-sm text-gray-600">{appointment.vehicle?.plate}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status === 'scheduled' && 'Planlandı'}
                                {appointment.status === 'confirmed' && 'Onaylandı'}
                                {appointment.status === 'in_progress' && 'İşlemde'}
                                {appointment.status === 'completed' && 'Tamamlandı'}
                                {appointment.status === 'cancelled' && 'İptal Edildi'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{appointment.scheduledTime}</p>
                            <p className="text-sm text-gray-600">{formatDate(new Date(appointment.scheduledDate))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Yaklaşan randevu bulunmuyor</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Car className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Araç Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tüm araçlarınızı detaylı bir şekilde görüntüleyin, yönetin ve bakım takibi yapın.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/vehicles')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Araçları Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/vehicles/add')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Yeni Araç Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs will be implemented similarly */}
        {activeTab === 'work-orders' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Wrench className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">İş Emirleri Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tüm iş emirlerini detaylı bir şekilde görüntüleyin, yönetin ve takip edin.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/work-orders')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İş Emirlerini Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/work-orders/add')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Yeni İş Emri Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Randevu Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tüm randevuları planlayın, yönetin ve müşteri takvimi oluşturun.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/appointments')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Randevuları Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/appointments/add')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Randevu Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Müşteri Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Müşteri profillerini yönetin, iletişim bilgilerini güncelleyin ve geçmiş hizmetleri takip edin.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/customers')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Müşterileri Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/customers/add')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Müşteri Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Finans Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Gelir, gider ve kâr analizlerini görüntüleyin, faturaları yönetin ve finansal raporları inceleyin.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/finance')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Finansal Raporları Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/finance/add')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Finansal Kayıt
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ödeme Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Fatura oluşturma, ödeme takibi, çoklu ödeme yöntemleri ve finansal raporlama ile ödemelerinizi yönetin.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/payments')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ödeme Merkezi
                </button>
                <button
                  onClick={() => router.push('/dashboard/payments')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Fatura Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Package className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Envanter Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Parça stok takibi, otomatik sipariş sistemi ve tedarikçi yönetimi ile envanterinizi optimize edin.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/inventory')}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Envanteri Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/inventory')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Parça Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analitik & Raporlar</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Detaylı performans analizi, finansal raporlar ve müşteri analitikleri ile işletmenizi optimize edin.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/analytics')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Analitikleri Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/analytics')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Rapor İndir
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gelişmiş Raporlama</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Kapsamlı rapor şablonları, PDF/Excel export, e-posta gönderimi ve paylaşım özellikleri ile profesyonel raporlar oluşturun.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/reports')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Rapor Merkezi
                </button>
                <button
                  onClick={() => router.push('/dashboard/reports')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Yeni Rapor Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'smart-pricing' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Fiyatlandırma</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                AI destekli fiyat optimizasyonu, pazar analizi ve rekabetçi fiyatlandırma önerileri ile gelirinizi artırın.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/smart-pricing')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Fiyat Analizi
                </button>
                <button
                  onClick={() => router.push('/dashboard/smart-pricing')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Pazar Analizi
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Güvenlik & Uyumluluk</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Veri güvenliği, GDPR uyumluluğu, denetim logları ve yedekleme sistemi ile verilerinizi koruyun.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/security')}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Güvenlik Merkezi
                </button>
                <button
                  onClick={() => router.push('/dashboard/security')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Denetim Logları
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mobile' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Smartphone className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobil Uygulama</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                AI destekli mobil uygulama ile aracınızın sağlığını 7/24 takip edin, push bildirimleri alın ve çevrimdışı çalışın.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/mobile')}
                  className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Mobil Uygulamayı Görüntüle
                </button>
                <button
                  onClick={() => router.push('/mobile')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İndirme Linkleri
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <Bell className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bildirim Yönetimi</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                SMS, Email ve Push bildirimlerini yönetin, şablonlar oluşturun ve müşteri iletişimini otomatikleştirin.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard/notifications')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Bildirimleri Görüntüle
                </button>
                <button
                  onClick={() => router.push('/dashboard/notifications')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Bildirim Gönder
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mobile' && (
          <div className="space-y-6">
            {/* Mobile Features Overview */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-8">
                <Smartphone className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobil Uygulama Özellikleri</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  PWA teknolojisi ile geliştirilmiş, offline çalışabilen, push bildirim destekli mobil deneyim.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">PWA Desteği</h4>
                  <p className="text-sm text-gray-600">Ana ekrana eklenebilir, native app deneyimi</p>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🔄</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Offline Çalışma</h4>
                  <p className="text-sm text-gray-600">İnternet olmadan da veri girişi ve görüntüleme</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🔔</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Push Bildirimler</h4>
                  <p className="text-sm text-gray-600">Gerçek zamanlı bildirimler ve hatırlatmalar</p>
                </div>

                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mobil Dashboard</h4>
                  <p className="text-sm text-gray-600">Touch-friendly arayüz ve kolay navigasyon</p>
                </div>

                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Hızlı Erişim</h4>
                  <p className="text-sm text-gray-600">Kısayollar ve hızlı işlem butonları</p>
                </div>

                <div className="text-center p-6 bg-indigo-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🔄</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Otomatik Senkronizasyon</h4>
                  <p className="text-sm text-gray-600">Bağlantı geri geldiğinde otomatik veri senkronizasyonu</p>
                </div>
              </div>
            </div>

            {/* Installation Instructions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mobil Uygulamayı Yükle</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">📱</span>
                    iOS (iPhone/iPad)
                  </h4>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                      Safari tarayıcısında siteyi açın
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                      Paylaş butonuna (⬆️) dokunun
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                      "Ana Ekrana Ekle" seçeneğini seçin
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                      "Ekle" butonuna dokunun
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🤖</span>
                    Android
                  </h4>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                      Chrome tarayıcısında siteyi açın
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                      Menü butonuna (⋮) dokunun
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                      "Ana ekrana ekle" seçeneğini seçin
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                      "Ekle" butonuna dokunun
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-xl">💡</span>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">İpucu</h4>
                    <p className="text-sm text-blue-800">
                      Uygulamayı ana ekrana ekledikten sonra, native mobil uygulama gibi kullanabilirsiniz. 
                      Offline çalışma, push bildirimler ve hızlı erişim özelliklerinin tümü aktif olacaktır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mobil Hızlı İşlemler</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push('/dashboard/vehicles/add')}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-2xl mb-2">🚗</span>
                  <span className="text-sm font-medium text-blue-900">Araç Ekle</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/appointments/add')}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-2xl mb-2">📅</span>
                  <span className="text-sm font-medium text-green-900">Randevu Al</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/work-orders/add')}
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <span className="text-2xl mb-2">🔧</span>
                  <span className="text-sm font-medium text-orange-900">İş Emri</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/customers/add')}
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-2xl mb-2">👤</span>
                  <span className="text-sm font-medium text-purple-900">Müşteri Ekle</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
      </div>
    </>
  );
}
