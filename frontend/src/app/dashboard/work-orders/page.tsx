'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  WrenchScrewdriverIcon,
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PauseIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  vehicleModel: string;
  year: number;
}

interface Technician {
  _id: string;
  firstName: string;
  lastName: string;
}

interface WorkOrder {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold' | 'waiting-parts' | 'waiting-approval' | 'quality-check';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'maintenance' | 'repair' | 'inspection' | 'diagnostic' | 'emergency';
  estimatedDuration: number;
  actualDuration?: number;
  estimatedCost: number;
  actualCost?: number;
  laborCost: number;
  partsCost: number;
  scheduledDate: string;
  startDate?: string;
  completedDate?: string;
  customer: Customer;
  vehicle: Vehicle;
  assignedTechnician?: Technician;
  workflow: {
    currentStep: number;
    totalSteps: number;
    steps: Array<{
      stepNumber: number;
      name: string;
      status: 'pending' | 'in-progress' | 'completed' | 'skipped';
      estimatedTime: number;
      actualTime?: number;
    }>;
  };
  statusHistory: Array<{
    fromStatus: string;
    toStatus: string;
    changedAt: string;
    changedBy: string;
    reason?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const WorkOrdersPage = () => {
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [stats, setStats] = useState<any>(null);

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    loadWorkOrders();
    loadStats();
  }, []);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/work-orders?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('İş emirleri yüklenirken hata oluştu');
      }

      const data = await response.json();
      setWorkOrders(data.data || []);
    } catch (error) {
      console.error('Error loading work orders:', error);
      toast.error('İş emirleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/work-orders/stats`, {
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
      loadWorkOrders();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'on-hold':
        return <PauseIcon className="h-5 w-5 text-orange-500" />;
      case 'waiting-parts':
        return <ExclamationTriangleIcon className="h-5 w-5 text-purple-500" />;
      case 'waiting-approval':
        return <UserIcon className="h-5 w-5 text-indigo-500" />;
      case 'quality-check':
        return <CheckCircleIcon className="h-5 w-5 text-cyan-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pending': 'Beklemede',
      'in-progress': 'Devam Ediyor',
      'completed': 'Tamamlandı',
      'cancelled': 'İptal Edildi',
      'on-hold': 'Bekletildi',
      'waiting-parts': 'Parça Bekliyor',
      'waiting-approval': 'Onay Bekliyor',
      'quality-check': 'Kalite Kontrol'
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'maintenance': 'Bakım',
      'repair': 'Onarım',
      'inspection': 'Muayene',
      'diagnostic': 'Tanı',
      'emergency': 'Acil'
    };
    return labels[type] || type;
  };

  const filteredWorkOrders = workOrders.filter(workOrder => {
    const matchesSearch = 
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || workOrder.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">İş Emri Yönetimi</h1>
        <p className="text-gray-600">İş emirlerinizi yönetin ve takip edin</p>
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
                <WrenchScrewdriverIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam İş Emri</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
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
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Devam Eden</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
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
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{stats.totalRevenue?.toLocaleString('tr-TR')}</p>
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
            placeholder="İş emri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="pending">Beklemede</option>
          <option value="in-progress">Devam Ediyor</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal Edildi</option>
          <option value="on-hold">Bekletildi</option>
          <option value="waiting-parts">Parça Bekliyor</option>
          <option value="waiting-approval">Onay Bekliyor</option>
          <option value="quality-check">Kalite Kontrol</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Öncelikler</option>
          <option value="urgent">Acil</option>
          <option value="high">Yüksek</option>
          <option value="medium">Orta</option>
          <option value="low">Düşük</option>
        </select>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Yeni İş Emri
        </button>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">İş emirleri yükleniyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İş Emri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri & Araç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum & Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknisyen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maliyet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorkOrders.map((workOrder) => (
                  <motion.tr
                    key={workOrder._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <WrenchScrewdriverIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {workOrder.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getTypeLabel(workOrder.type)} • {workOrder.estimatedDuration}h
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {workOrder.customer.firstName} {workOrder.customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {workOrder.vehicle.plate} • {workOrder.vehicle.brand} {workOrder.vehicle.vehicleModel}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(workOrder.status)}
                        <span className="text-sm font-medium text-gray-900">
                          {getStatusLabel(workOrder.status)}
                        </span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(workOrder.priority)}`}>
                        {workOrder.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workOrder.assignedTechnician ? (
                        <div>
                          <div className="font-medium">
                            {workOrder.assignedTechnician.firstName} {workOrder.assignedTechnician.lastName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Atanmamış</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₺{workOrder.estimatedCost.toLocaleString('tr-TR')}
                      </div>
                      {workOrder.actualCost && (
                        <div className="text-sm text-gray-500">
                          Gerçek: ₺{workOrder.actualCost.toLocaleString('tr-TR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(workOrder.workflow.currentStep / workOrder.workflow.totalSteps) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {workOrder.workflow.currentStep}/{workOrder.workflow.totalSteps}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
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

      {filteredWorkOrders.length === 0 && !loading && (
        <div className="text-center py-12">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">İş emri bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Arama kriterlerinize uygun iş emri bulunamadı.'
              : 'Henüz hiç iş emri oluşturulmamış.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkOrdersPage;