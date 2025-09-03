'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Car, 
  Wrench, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  lastService?: Date;
}

interface WorkOrder {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  vehicle: Vehicle;
  estimatedCost: number;
  scheduledDate: Date;
  assignedTechnician?: string;
}

interface Appointment {
  _id: string;
  title: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  startTime: string;
  vehicle: Vehicle;
  serviceType: string;
}

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
  const { user } = useAuth();
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - will be replaced with real API calls
      const mockStats: DashboardStats = {
        totalVehicles: 3,
        activeWorkOrders: 2,
        upcomingAppointments: 1,
        monthlyRevenue: 2500,
        completedServices: 15,
        customerSatisfaction: 4.8
      };

      const mockVehicles: Vehicle[] = [
        {
          _id: '1',
          plate: '34 ABC 123',
          brand: 'BMW',
          model: '320i',
          year: 2020,
          color: 'Beyaz',
          mileage: 45000,
          lastService: new Date('2024-08-15')
        },
        {
          _id: '2',
          plate: '06 XYZ 789',
          brand: 'Mercedes',
          model: 'C200',
          year: 2019,
          color: 'Siyah',
          mileage: 62000,
          lastService: new Date('2024-07-20')
        },
        {
          _id: '3',
          plate: '35 DEF 456',
          brand: 'Audi',
          model: 'A4',
          year: 2021,
          color: 'Gri',
          mileage: 28000,
          lastService: new Date('2024-09-01')
        }
      ];

      const mockWorkOrders: WorkOrder[] = [
        {
          _id: '1',
          title: 'Fren Sistemi Bakımı',
          status: 'in-progress',
          priority: 'high',
          vehicle: mockVehicles[0],
          estimatedCost: 800,
          scheduledDate: new Date('2024-09-05'),
          assignedTechnician: 'Ahmet Teknisyen'
        },
        {
          _id: '2',
          title: 'Yağ Değişimi',
          status: 'pending',
          priority: 'medium',
          vehicle: mockVehicles[1],
          estimatedCost: 300,
          scheduledDate: new Date('2024-09-10')
        }
      ];

      const mockAppointments: Appointment[] = [
        {
          _id: '1',
          title: 'Genel Kontrol',
          status: 'scheduled',
          scheduledDate: new Date('2024-09-08'),
          startTime: '10:00',
          vehicle: mockVehicles[2],
          serviceType: 'inspection'
        }
      ];

      setStats(mockStats);
      setVehicles(mockVehicles);
      setWorkOrders(mockWorkOrders);
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Dashboard veri yükleme hatası:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hoş geldin, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                OtoTakibim Dashboard - Araçlarını ve hizmetlerini yönet
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/work-orders/add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni İş Emri</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/appointments/add')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Randevu Al</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Genel Bakış', icon: TrendingUp },
              { id: 'vehicles', name: 'Araçlarım', icon: Car },
              { id: 'work-orders', name: 'İş Emirleri', icon: Wrench },
              { id: 'appointments', name: 'Randevular', icon: Calendar },
              { id: 'customers', name: 'Müşteriler', icon: Users },
              { id: 'finance', name: 'Finans', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Araç</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Wrench className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aktif İş Emirleri</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeWorkOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Yaklaşan Randevular</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Work Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Son İş Emirleri</h3>
                </div>
                <div className="p-6">
                  {workOrders.length > 0 ? (
                    <div className="space-y-4">
                      {workOrders.map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{order.title}</h4>
                            <p className="text-sm text-gray-600">{order.vehicle.plate}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status === 'pending' && 'Beklemede'}
                                {order.status === 'in-progress' && 'İşlemde'}
                                {order.status === 'completed' && 'Tamamlandı'}
                                {order.status === 'cancelled' && 'İptal Edildi'}
                                {order.status === 'on-hold' && 'Duraklatıldı'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                                {order.priority === 'urgent' && 'Acil'}
                                {order.priority === 'high' && 'Yüksek'}
                                {order.priority === 'medium' && 'Orta'}
                                {order.priority === 'low' && 'Düşük'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(order.estimatedCost)}</p>
                            <p className="text-sm text-gray-600">{formatDate(order.scheduledDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Henüz iş emri bulunmuyor</p>
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
                            <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                            <p className="text-sm text-gray-600">{appointment.vehicle.plate}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status === 'scheduled' && 'Planlandı'}
                                {appointment.status === 'confirmed' && 'Onaylandı'}
                                {appointment.status === 'in-progress' && 'İşlemde'}
                                {appointment.status === 'completed' && 'Tamamlandı'}
                                {appointment.status === 'cancelled' && 'İptal Edildi'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{appointment.startTime}</p>
                            <p className="text-sm text-gray-600">{formatDate(appointment.scheduledDate)}</p>
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
      </div>
    </div>
  );
}
