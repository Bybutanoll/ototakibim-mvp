'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  Package,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowLeft,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface DashboardAnalytics {
  overview: {
    totalVehicles: number;
    totalCustomers: number;
    totalWorkOrders: number;
    totalInventoryItems: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalOrders: number;
  };
  trends: {
    monthlyRevenue: Array<{
      _id: { year: number; month: number };
      revenue: number;
      orders: number;
    }>;
    vehicleAgeDistribution: Array<{
      _id: string;
      count: number;
    }>;
    serviceTypeDistribution: Array<{
      _id: string;
      count: number;
      totalCost: number;
    }>;
    customerRetention: Array<{
      _id: string;
      count: number;
    }>;
  };
  inventory: {
    totalValue: number;
    totalItems: number;
    lowStockItems: number;
  };
  alerts: Array<any>;
}

const periodOptions = [
  { value: '7d', label: 'Son 7 Gün' },
  { value: '30d', label: 'Son 30 Gün' },
  { value: '90d', label: 'Son 90 Gün' },
  { value: '1y', label: 'Son 1 Yıl' }
];

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/bi/dashboard?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Analytics loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'maintenance': 'Bakım',
      'repair': 'Onarım',
      'inspection': 'Muayene',
      'cleaning': 'Temizlik',
      'other': 'Diğer'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
        </div>
      </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">İş Zekası & Analitik</h1>
                <p className="text-gray-600">Detaylı işletme analizleri ve raporlar</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={loadAnalytics}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                { id: 'revenue', label: 'Gelir Analizi', icon: DollarSign },
                { id: 'customers', label: 'Müşteri Analizi', icon: Users },
                { id: 'inventory', label: 'Envanter Analizi', icon: Package },
                { id: 'performance', label: 'Performans', icon: Target }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.overview.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{formatNumber(analytics.overview.totalOrders)} sipariş</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ortalama Sipariş Değeri</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(analytics.overview.averageOrderValue)}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <Car className="w-4 h-4 mr-1" />
                  <span>{formatNumber(analytics.overview.totalVehicles)} araç</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                    <p className="text-2xl font-bold text-purple-600">{formatNumber(analytics.overview.totalCustomers)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-1" />
                  <span>{formatNumber(analytics.overview.totalInventoryItems)} parça</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Envanter Değeri</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.inventory.totalValue)}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span>{analytics.inventory.lowStockItems} düşük stok</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Gelir Trendi</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 mx-auto mb-2" />
                    <p>Grafik verisi yükleniyor...</p>
                    </div>
                </div>
              </div>

              {/* Service Type Distribution */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hizmet Türü Dağılımı</h3>
                <div className="space-y-3">
                  {analytics.trends.serviceTypeDistribution.slice(0, 5).map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-red-500' : 'bg-purple-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">
                          {getServiceTypeLabel(service._id)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{service.count}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(service.totalCost)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Age Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Araç Yaş Dağılımı</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {analytics.trends.vehicleAgeDistribution.map((age, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{age.count}</div>
                    <div className="text-sm text-gray-600">{age._id}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Retention */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Sadakati</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {analytics.trends.customerRetention.map((retention, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{retention.count}</div>
                    <div className="text-sm text-gray-600">{retention._id}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 mb-4">
              {activeTab === 'revenue' && <DollarSign className="w-16 h-16 mx-auto" />}
              {activeTab === 'customers' && <Users className="w-16 h-16 mx-auto" />}
              {activeTab === 'inventory' && <Package className="w-16 h-16 mx-auto" />}
              {activeTab === 'performance' && <Target className="w-16 h-16 mx-auto" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'revenue' && 'Gelir Analizi'}
              {activeTab === 'customers' && 'Müşteri Analizi'}
              {activeTab === 'inventory' && 'Envanter Analizi'}
              {activeTab === 'performance' && 'Performans Metrikleri'}
            </h3>
            <p className="text-gray-600">
              Bu özellik yakında eklenecek. Detaylı analizler ve grafikler için geliştirme devam ediyor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}