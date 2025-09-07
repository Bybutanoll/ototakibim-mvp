'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PauseIcon,
  XCircleIcon,
  PencilIcon,
  PhotoIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: {
    street: string;
    district: string;
    city: string;
    postalCode: string;
  };
}

interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  vehicleModel: string;
  year: number;
  vin?: string;
  engineSize?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  color?: string;
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
  taxRate: number;
  scheduledDate: string;
  startDate?: string;
  completedDate?: string;
  customer: Customer;
  vehicle: Vehicle;
  assignedTechnician?: Technician;
  parts: Array<{
    name: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    supplier?: string;
    warranty?: string;
  }>;
  workSteps: Array<{
    stepNumber: number;
    description: string;
    estimatedTime: number;
    actualTime?: number;
    status: 'pending' | 'in-progress' | 'completed';
    notes?: string;
    completedBy?: string;
    completedAt?: string;
  }>;
  workflow: {
    currentStep: number;
    totalSteps: number;
    steps: Array<{
      stepNumber: number;
      name: string;
      status: 'pending' | 'in-progress' | 'completed' | 'skipped';
      estimatedTime: number;
      actualTime?: number;
      completedAt?: string;
      completedBy?: string;
      notes?: string;
    }>;
  };
  statusHistory: Array<{
    fromStatus: string;
    toStatus: string;
    changedAt: string;
    changedBy: string;
    reason?: string;
    notes?: string;
  }>;
  customerApproval: {
    required: boolean;
    requestedAt?: string;
    approvedAt?: string;
    approvedBy?: string;
    notes?: string;
  };
  photos: string[];
  documents: Array<{
    name: string;
    type: 'invoice' | 'warranty' | 'manual' | 'other';
    url: string;
    uploadedAt: string;
  }>;
  notes: Array<{
    author: string;
    content: string;
    createdAt: string;
    isInternal: boolean;
  }>;
  qualityCheck: {
    performedBy?: string;
    performedAt?: string;
    passed: boolean;
    notes?: string;
    checklist: Array<{
      item: string;
      checked: boolean;
      notes?: string;
    }>;
  };
  warranty: {
    type: 'none' | 'parts' | 'labor' | 'full';
    duration: number;
    startDate?: string;
    terms?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const WorkOrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    if (params.id) {
      loadWorkOrder(params.id as string);
    }
  }, [params.id]);

  const loadWorkOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/work-orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('İş emri yüklenirken hata oluştu');
      }

      const data = await response.json();
      setWorkOrder(data.data);
    } catch (error) {
      console.error('Error loading work order:', error);
      toast.error('İş emri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">İş emri bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">Aradığınız iş emri mevcut değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Geri Dön
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{workOrder.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(workOrder.status)}
                <span className="text-lg font-medium text-gray-900">
                  {getStatusLabel(workOrder.status)}
                </span>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(workOrder.priority)}`}>
                {workOrder.priority.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                {getTypeLabel(workOrder.type)}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <PencilIcon className="h-4 w-4" />
              Düzenle
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <PlayIcon className="h-4 w-4" />
              Başlat
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Genel Bakış' },
            { id: 'workflow', label: 'Workflow' },
            { id: 'parts', label: 'Parçalar' },
            { id: 'steps', label: 'İş Adımları' },
            { id: 'history', label: 'Geçmiş' },
            { id: 'documents', label: 'Belgeler' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Açıklama</h3>
              <p className="text-gray-700">{workOrder.description}</p>
            </div>

            {/* Customer & Vehicle Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri & Araç Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Müşteri</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <strong>Ad:</strong> {workOrder.customer.firstName} {workOrder.customer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Telefon:</strong> {workOrder.customer.phone}
                    </p>
                    {workOrder.customer.email && (
                      <p className="text-sm text-gray-600">
                        <strong>E-posta:</strong> {workOrder.customer.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Araç</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <strong>Plaka:</strong> {workOrder.vehicle.plate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Marka/Model:</strong> {workOrder.vehicle.brand} {workOrder.vehicle.vehicleModel}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Yıl:</strong> {workOrder.vehicle.year}
                    </p>
                    {workOrder.vehicle.mileage && (
                      <p className="text-sm text-gray-600">
                        <strong>Kilometre:</strong> {workOrder.vehicle.mileage.toLocaleString('tr-TR')} km
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {workOrder.notes.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notlar</h3>
                <div className="space-y-4">
                  {workOrder.notes.map((note, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {note.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                      {note.isInternal && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mt-2">
                          İç Not
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Durum</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mevcut Durum</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(workOrder.status)}
                    <span className="text-sm font-medium">{getStatusLabel(workOrder.status)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Öncelik</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(workOrder.priority)}`}>
                    {workOrder.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tip</span>
                  <span className="text-sm font-medium">{getTypeLabel(workOrder.type)}</span>
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zamanlama</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Planlanan Tarih</span>
                  <span className="text-sm font-medium">{formatDate(workOrder.scheduledDate)}</span>
                </div>
                {workOrder.startDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Başlangıç</span>
                    <span className="text-sm font-medium">{formatDate(workOrder.startDate)}</span>
                  </div>
                )}
                {workOrder.completedDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tamamlanma</span>
                    <span className="text-sm font-medium">{formatDate(workOrder.completedDate)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tahmini Süre</span>
                  <span className="text-sm font-medium">{workOrder.estimatedDuration}h</span>
                </div>
                {workOrder.actualDuration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gerçek Süre</span>
                    <span className="text-sm font-medium">{workOrder.actualDuration}h</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cost */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maliyet</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tahmini Maliyet</span>
                  <span className="text-sm font-medium">₺{workOrder.estimatedCost.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">İşçilik</span>
                  <span className="text-sm font-medium">₺{workOrder.laborCost.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Parçalar</span>
                  <span className="text-sm font-medium">₺{workOrder.partsCost.toLocaleString('tr-TR')}</span>
                </div>
                {workOrder.actualCost && (
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-900">Gerçek Maliyet</span>
                    <span className="text-sm font-bold text-green-600">₺{workOrder.actualCost.toLocaleString('tr-TR')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Technician */}
            {workOrder.assignedTechnician && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Atanan Teknisyen</h3>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {workOrder.assignedTechnician.firstName} {workOrder.assignedTechnician.lastName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'workflow' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Workflow İlerlemesi</h3>
          <div className="space-y-4">
            {workOrder.workflow.steps.map((step, index) => (
              <div key={step.stepNumber} className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-500 text-white' :
                  step.status === 'in-progress' ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.stepNumber}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{step.estimatedTime} dk</span>
                      {step.actualTime && (
                        <span className="text-sm text-gray-500">({step.actualTime} dk)</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status === 'completed' ? 'Tamamlandı' :
                       step.status === 'in-progress' ? 'Devam Ediyor' :
                       'Beklemede'}
                    </span>
                  </div>
                  {step.notes && (
                    <p className="mt-2 text-sm text-gray-600">{step.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'parts' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Kullanılan Parçalar</h3>
          {workOrder.parts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parça Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parça No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miktar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Birim Fiyat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tedarikçi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workOrder.parts.map((part, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {part.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.partNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₺{part.unitPrice.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₺{(part.quantity * part.unitPrice).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.supplier || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Henüz parça eklenmemiş.</p>
          )}
        </div>
      )}

      {activeTab === 'steps' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">İş Adımları</h3>
          {workOrder.workSteps.length > 0 ? (
            <div className="space-y-4">
              {workOrder.workSteps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      Adım {step.stepNumber}: {step.description}
                    </h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status === 'completed' ? 'Tamamlandı' :
                       step.status === 'in-progress' ? 'Devam Ediyor' :
                       'Beklemede'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Tahmini: {step.estimatedTime} dk</span>
                    {step.actualTime && <span>Gerçek: {step.actualTime} dk</span>}
                    {step.completedAt && <span>Tamamlanma: {formatDate(step.completedAt)}</span>}
                  </div>
                  {step.notes && (
                    <p className="mt-2 text-sm text-gray-600">{step.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Henüz iş adımı eklenmemiş.</p>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Durum Geçmişi</h3>
          <div className="space-y-4">
            {workOrder.statusHistory.map((history, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <ClockIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {getStatusLabel(history.fromStatus)} → {getStatusLabel(history.toStatus)}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(history.changedAt)}
                    </span>
                  </div>
                  {history.reason && (
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Sebep:</strong> {history.reason}
                    </p>
                  )}
                  {history.notes && (
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Not:</strong> {history.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Belgeler</h3>
          {workOrder.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workOrder.documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Henüz belge yüklenmemiş.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkOrderDetailPage;
