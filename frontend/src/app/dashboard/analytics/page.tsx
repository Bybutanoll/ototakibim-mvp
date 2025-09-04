'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  AlertCircle
} from 'lucide-react';

interface AnalyticsData {
  financial: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    monthlyRevenue: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
    revenueByCategory: Array<{ category: string; amount: number; percentage: number }>;
    expensesByCategory: Array<{ category: string; amount: number; percentage: number }>;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
    averageCustomerValue: number;
    topCustomers: Array<{ name: string; totalSpent: number; visits: number }>;
  };
  vehicles: {
    totalVehicles: number;
    activeVehicles: number;
    maintenanceCompleted: number;
    averageMaintenanceCost: number;
    maintenanceByType: Array<{ type: string; count: number; cost: number }>;
  };
  performance: {
    totalWorkOrders: number;
    completedWorkOrders: number;
    averageCompletionTime: number;
    customerSatisfaction: number;
    efficiency: number;
    productivity: number;
  };
  trends: {
    revenueGrowth: number;
    customerGrowth: number;
    maintenanceGrowth: number;
    efficiencyGrowth: number;
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('financial');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://ototakibim-mvp.onrender.com/api/analytics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      } else {
        // Fallback to mock data for demo
        const mockData: AnalyticsData = {
          financial: {
            totalRevenue: 125000,
            totalExpenses: 85000,
            netProfit: 40000,
            monthlyRevenue: [
              { month: 'Ocak', revenue: 15000, expenses: 10000, profit: 5000 },
              { month: 'Şubat', revenue: 18000, expenses: 12000, profit: 6000 },
              { month: 'Mart', revenue: 22000, expenses: 14000, profit: 8000 },
              { month: 'Nisan', revenue: 19000, expenses: 13000, profit: 6000 },
              { month: 'Mayıs', revenue: 25000, expenses: 16000, profit: 9000 },
              { month: 'Haziran', revenue: 28000, expenses: 18000, profit: 10000 }
            ],
            revenueByCategory: [
              { category: 'Servis Geliri', amount: 75000, percentage: 60 },
              { category: 'Parça Satışı', amount: 30000, percentage: 24 },
              { category: 'Muayene Ücreti', amount: 15000, percentage: 12 },
              { category: 'Diğer', amount: 5000, percentage: 4 }
            ],
            expensesByCategory: [
              { category: 'Personel Maaşı', amount: 40000, percentage: 47 },
              { category: 'Parça Alımı', amount: 25000, percentage: 29 },
              { category: 'Kira', amount: 8000, percentage: 9 },
              { category: 'Elektrik/Su', amount: 5000, percentage: 6 },
              { category: 'Diğer', amount: 7000, percentage: 9 }
            ]
          },
          customers: {
            totalCustomers: 156,
            newCustomers: 23,
            returningCustomers: 133,
            customerRetentionRate: 85.3,
            averageCustomerValue: 801,
            topCustomers: [
              { name: 'Ahmet Yılmaz', totalSpent: 8500, visits: 12 },
              { name: 'Fatma Demir', totalSpent: 6200, visits: 8 },
              { name: 'Mehmet Kaya', totalSpent: 4800, visits: 6 },
              { name: 'Ayşe Özkan', totalSpent: 4200, visits: 5 },
              { name: 'Ali Çelik', totalSpent: 3800, visits: 4 }
            ]
          },
          vehicles: {
            totalVehicles: 89,
            activeVehicles: 76,
            maintenanceCompleted: 234,
            averageMaintenanceCost: 534,
            maintenanceByType: [
              { type: 'Motor Yağı Değişimi', count: 45, cost: 13500 },
              { type: 'Fren Sistemi', count: 32, cost: 19200 },
              { type: 'Klima Bakımı', count: 28, cost: 8400 },
              { type: 'Genel Bakım', count: 25, cost: 12500 },
              { type: 'Lastik Değişimi', count: 18, cost: 10800 }
            ]
          },
          performance: {
            totalWorkOrders: 156,
            completedWorkOrders: 142,
            averageCompletionTime: 2.3,
            customerSatisfaction: 4.7,
            efficiency: 91.0,
            productivity: 88.5
          },
          trends: {
            revenueGrowth: 12.5,
            customerGrowth: 8.3,
            maintenanceGrowth: 15.2,
            efficiencyGrowth: 5.7
          }
        };
        setAnalyticsData(mockData);
      }
    } catch (error) {
      console.error('Analytics loading error:', error);
      setAnalyticsData(null);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const exportReport = () => {
    if (!analyticsData) return;
    
    const reportData = {
      dateRange,
      generatedAt: new Date().toISOString(),
      ...analyticsData
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${dateRange}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analitik veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Veri Yüklenemedi</h2>
          <p className="text-gray-600 mb-4">Analitik veriler yüklenirken bir hata oluştu</p>
          <button
            onClick={loadAnalyticsData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analitik & Raporlar</h1>
                <p className="text-gray-600">Detaylı performans analizi ve raporlar</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Son 7 Gün</option>
                <option value="30days">Son 30 Gün</option>
                <option value="90days">Son 90 Gün</option>
                <option value="1year">Son 1 Yıl</option>
              </select>
              <button
                onClick={loadAnalyticsData}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yenile</span>
              </button>
              <button
                onClick={exportReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Rapor İndir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'financial', name: 'Finansal', icon: DollarSign },
                { id: 'customers', name: 'Müşteri', icon: Users },
                { id: 'vehicles', name: 'Araç', icon: Car },
                { id: 'performance', name: 'Performans', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMetric(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    selectedMetric === tab.id
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

        {/* Financial Analytics */}
        {selectedMetric === 'financial' && (
          <div className="space-y-6">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.financial.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`flex items-center ${getGrowthColor(analyticsData.trends.revenueGrowth)}`}>
                    {getGrowthIcon(analyticsData.trends.revenueGrowth)}
                    <span className="ml-1 text-sm font-medium">
                      {formatPercentage(analyticsData.trends.revenueGrowth)}
                    </span>
                  </span>
                  <span className="ml-2 text-sm text-gray-500">önceki döneme göre</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.financial.totalExpenses)}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Kâr</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.financial.netProfit)}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Kâr Marjı: {formatPercentage((analyticsData.financial.netProfit / analyticsData.financial.totalRevenue) * 100)}
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gelir Kategorileri</h3>
                <div className="space-y-3">
                  {analyticsData.financial.revenueByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</p>
                        <p className="text-xs text-gray-500">{formatPercentage(item.percentage)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gider Kategorileri</h3>
                <div className="space-y-3">
                  {analyticsData.financial.expensesByCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</p>
                        <p className="text-xs text-gray-500">{formatPercentage(item.percentage)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Analytics */}
        {selectedMetric === 'customers' && (
          <div className="space-y-6">
            {/* Customer Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.customers.totalCustomers}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Yeni Müşteri</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.customers.newCustomers}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sadakat Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.customers.customerRetentionRate)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ort. Müşteri Değeri</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.customers.averageCustomerValue)}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">En Değerli Müşteriler</h3>
              <div className="space-y-3">
                {analyticsData.customers.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.visits} ziyaret</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Analytics */}
        {selectedMetric === 'vehicles' && (
          <div className="space-y-6">
            {/* Vehicle Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Araç</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.vehicles.totalVehicles}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktif Araç</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.vehicles.activeVehicles}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tamamlanan Bakım</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.vehicles.maintenanceCompleted}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ort. Bakım Maliyeti</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.vehicles.averageMaintenanceCost)}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance by Type */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bakım Türlerine Göre Dağılım</h3>
              <div className="space-y-3">
                {analyticsData.vehicles.maintenanceByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{item.count} adet</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(item.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics */}
        {selectedMetric === 'performance' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tamamlanma Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.performance.efficiency)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ort. Tamamlanma Süresi</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.averageCompletionTime} gün</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Müşteri Memnuniyeti</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.customerSatisfaction}/5</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">İş Emri Durumu</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Toplam İş Emri</span>
                    <span className="text-sm font-bold text-gray-900">{analyticsData.performance.totalWorkOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Tamamlanan</span>
                    <span className="text-sm font-bold text-green-600">{analyticsData.performance.completedWorkOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Bekleyen</span>
                    <span className="text-sm font-bold text-yellow-600">{analyticsData.performance.totalWorkOrders - analyticsData.performance.completedWorkOrders}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performans Metrikleri</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Verimlilik</span>
                    <span className="text-sm font-bold text-gray-900">{formatPercentage(analyticsData.performance.efficiency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Üretkenlik</span>
                    <span className="text-sm font-bold text-gray-900">{formatPercentage(analyticsData.performance.productivity)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Müşteri Memnuniyeti</span>
                    <span className="text-sm font-bold text-gray-900">{analyticsData.performance.customerSatisfaction}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
