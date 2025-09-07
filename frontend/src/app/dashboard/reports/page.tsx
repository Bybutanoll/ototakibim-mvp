'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Report {
  _id: string;
  reportType: 'revenue' | 'customer' | 'vehicle' | 'work_order' | 'inventory' | 'appointment' | 'payment' | 'custom';
  reportName: string;
  reportDescription?: string;
  dateRange: {
    startDate: string;
    endDate: string;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  };
  data: {
    summary: {
      totalRecords: number;
      totalRevenue?: number;
      totalCost?: number;
      totalProfit?: number;
      averageValue?: number;
      growthRate?: number;
    };
    timeSeries?: Array<{
      date: string;
      value: number;
      label?: string;
    }>;
    categories?: Array<{
      name: string;
      value: number;
      percentage: number;
      color?: string;
    }>;
  };
  chartConfig: {
    type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
    title: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    showLegend: boolean;
    showGrid: boolean;
    colors?: string[];
  };
  status: 'generating' | 'completed' | 'failed' | 'scheduled';
  generatedAt?: string;
  generatedBy: string;
  exportOptions: {
    formats: ('pdf' | 'excel' | 'csv' | 'json')[];
    includeCharts: boolean;
    includeDetails: boolean;
    includeSummary: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState<any>(null);

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    loadReports();
    loadStats();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reports?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Raporlar yüklenirken hata oluştu');
      }

      const data = await response.json();
      setReports(data.data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Raporlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('İstatistikler yüklenirken hata oluştu');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadReports();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <ChartBarIcon className="h-5 w-5 text-green-500" />;
      case 'customer':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'work_order':
        return <DocumentTextIcon className="h-5 w-5 text-orange-500" />;
      case 'payment':
        return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
      case 'inventory':
        return <DocumentTextIcon className="h-5 w-5 text-indigo-500" />;
      case 'appointment':
        return <DocumentTextIcon className="h-5 w-5 text-pink-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'revenue': 'Gelir Raporu',
      'customer': 'Müşteri Raporu',
      'vehicle': 'Araç Raporu',
      'work_order': 'İş Emri Raporu',
      'inventory': 'Stok Raporu',
      'appointment': 'Randevu Raporu',
      'payment': 'Ödeme Raporu',
      'custom': 'Özel Rapor'
    };
    return labels[type] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'scheduled':
        return <CalendarIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'generating': 'Oluşturuluyor',
      'completed': 'Tamamlandı',
      'failed': 'Başarısız',
      'scheduled': 'Zamanlandı'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPeriodLabel = (period: string) => {
    const labels: { [key: string]: string } = {
      'daily': 'Günlük',
      'weekly': 'Haftalık',
      'monthly': 'Aylık',
      'quarterly': 'Çeyreklik',
      'yearly': 'Yıllık',
      'custom': 'Özel'
    };
    return labels[period] || period;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportDescription?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || report.reportType === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlama ve Analitik</h1>
        <p className="text-gray-600">Detaylı raporlar oluşturun ve işletmenizi analiz edin</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Rapor</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedReports}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Zamanlanmış</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledReports}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <ArrowDownTrayIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Export</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExports}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rapor ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Türler</option>
          <option value="revenue">Gelir Raporu</option>
          <option value="customer">Müşteri Raporu</option>
          <option value="work_order">İş Emri Raporu</option>
          <option value="payment">Ödeme Raporu</option>
          <option value="inventory">Stok Raporu</option>
          <option value="appointment">Randevu Raporu</option>
          <option value="custom">Özel Rapor</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="completed">Tamamlandı</option>
          <option value="generating">Oluşturuluyor</option>
          <option value="scheduled">Zamanlandı</option>
          <option value="failed">Başarısız</option>
        </select>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Yeni Rapor
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Raporlar yükleniyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rapor Bilgileri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih Aralığı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Özet Veriler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum & Grafik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <motion.tr
                    key={report._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {getTypeIcon(report.reportType)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reportName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getTypeLabel(report.reportType)}
                          </div>
                          {report.reportDescription && (
                            <div className="text-xs text-gray-400 mt-1">
                              {report.reportDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(report.dateRange.startDate)} - {formatDate(report.dateRange.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getPeriodLabel(report.dateRange.period)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Kayıt: {report.data.summary.totalRecords}
                      </div>
                      {report.data.summary.totalRevenue && (
                        <div className="text-sm text-gray-500">
                          Gelir: {formatCurrency(report.data.summary.totalRevenue)}
                        </div>
                      )}
                      {report.data.summary.totalProfit && (
                        <div className="text-sm text-gray-500">
                          Kar: {formatCurrency(report.data.summary.totalProfit)}
                        </div>
                      )}
                      {report.data.summary.growthRate && (
                        <div className="text-sm text-green-600">
                          Büyüme: %{report.data.summary.growthRate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(report.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(report.status)}`}>
                          {getStatusLabel(report.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {report.chartConfig.type} grafik
                      </div>
                      {report.data.categories && report.data.categories.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {report.data.categories.length} kategori
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(report.createdAt)}
                      </div>
                      {report.generatedAt && (
                        <div className="text-sm text-gray-500">
                          Tamamlandı: {formatDate(report.generatedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredReports.length === 0 && !loading && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Rapor bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Arama kriterlerinize uygun rapor bulunamadı.'
              : 'Henüz hiç rapor oluşturulmamış.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;