'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  WrenchIcon, 
  UserIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface WorkOrder {
  _id: string;
  customerId: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  };
  vehicleId: {
    _id: string;
    brand: string;
    vehicleModel: string;
    year: number;
    plate: string;
    vin: string;
    color: string;
    mileage: number;
  };
  assignedTechnicianId?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  problemDescription: string;
  estimatedCost: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedDuration?: number;
  notes: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workOrderId = params.id as string;
  
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchWorkOrder();
  }, [workOrderId]);

  const fetchWorkOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/work-orders/${workOrderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setWorkOrder(result.data.workOrder);
        setEditData({
          problemDescription: result.data.workOrder.problemDescription,
          estimatedCost: result.data.workOrder.estimatedCost,
          priority: result.data.workOrder.priority,
          estimatedDuration: result.data.workOrder.estimatedDuration,
          notes: result.data.workOrder.notes,
          status: result.data.workOrder.status
        });
      } else {
        toast.error('İş emri bulunamadı');
        router.push('/work-orders');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('İş emri yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/work-orders/${workOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const result = await response.json();
        setWorkOrder(result.data.workOrder);
        setIsEditing(false);
        toast.success('İş emri başarıyla güncellendi');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Güncelleme başarısız');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/work-orders/${workOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const result = await response.json();
        setWorkOrder(result.data.workOrder);
        toast.success('Durum başarıyla güncellendi');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Durum güncellenemedi');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Durum güncellenirken hata oluştu');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu iş emrini silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/work-orders/${workOrderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        toast.success('İş emri silindi');
        router.push('/work-orders');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Silme başarısız');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Silme sırasında hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'in-progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5" />;
      case 'pending':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'cancelled':
        return <XMarkIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'normal':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-600/20 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">İş Emri Bulunamadı</h1>
          <button
            onClick={() => router.push('/work-orders')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white"
          >
            İş Emirlerine Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle-container">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/work-orders')}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                İş Emri #{workOrder._id.slice(-6)}
              </h1>
                             <p className="text-xl text-blue-200">
                 {workOrder.customerId.firstName} {workOrder.customerId.lastName} - {workOrder.vehicleId.brand} {workOrder.vehicleId.vehicleModel}
               </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 flex items-center space-x-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>{isEditing ? 'İptal' : 'Düzenle'}</span>
            </button>
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Sil</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Priority */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Durum ve Öncelik</h2>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(workOrder.status)} flex items-center space-x-1`}>
                    {getStatusIcon(workOrder.status)}
                    <span>
                      {workOrder.status === 'in-progress' ? 'Devam Ediyor' : 
                       workOrder.status === 'completed' ? 'Tamamlandı' : 
                       workOrder.status === 'pending' ? 'Bekliyor' : 'İptal Edildi'}
                    </span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(workOrder.priority)}`}>
                    {workOrder.priority === 'urgent' ? 'Acil' :
                     workOrder.priority === 'high' ? 'Yüksek' :
                     workOrder.priority === 'normal' ? 'Normal' : 'Düşük'} Öncelik
                  </span>
                </div>
              </div>
              
              {/* Quick Status Update */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={workOrder.status === status}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      workOrder.status === status
                        ? 'bg-blue-500 text-white cursor-default'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {status === 'in-progress' ? 'Devam Et' : 
                     status === 'completed' ? 'Tamamla' : 
                     status === 'pending' ? 'Beklet' : 'İptal Et'}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <WrenchIcon className="h-5 w-5 mr-2 text-blue-400" />
                Problem Açıklaması
              </h2>
              
              {isEditing ? (
                <textarea
                  value={editData.problemDescription}
                  onChange={(e) => setEditData({...editData, problemDescription: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {workOrder.problemDescription}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-emerald-400" />
                Notlar
              </h2>
              
              {isEditing ? (
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                  placeholder="Ek notlar..."
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {workOrder.notes || 'Not bulunmuyor'}
                </p>
              )}
            </div>

            {/* Save Button for Edit Mode */}
            {isEditing && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50"
                  >
                    {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-cyan-400" />
                Müşteri Bilgileri
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Ad Soyad:</span>
                  <span className="text-white font-medium">
                    {workOrder.customerId.firstName} {workOrder.customerId.lastName}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{workOrder.customerId.phone}</span>
                </div>
                
                {workOrder.customerId.email && (
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{workOrder.customerId.email}</span>
                  </div>
                )}
                
                {workOrder.customerId.address && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-white text-sm">{workOrder.customerId.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-emerald-400" />
                Araç Bilgileri
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Marka/Model:</span>
                                     <span className="text-white font-medium">
                     {workOrder.vehicleId.brand} {workOrder.vehicleId.vehicleModel}
                   </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Yıl:</span>
                  <span className="text-white">{workOrder.vehicleId.year}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Plaka:</span>
                  <span className="text-white font-medium">{workOrder.vehicleId.plate}</span>
                </div>
                
                {workOrder.vehicleId.vin && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">VIN:</span>
                    <span className="text-white text-sm">{workOrder.vehicleId.vin}</span>
                  </div>
                )}
                
                {workOrder.vehicleId.color && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Renk:</span>
                    <span className="text-white">{workOrder.vehicleId.color}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Kilometre:</span>
                  <span className="text-white">{workOrder.vehicleId.mileage.toLocaleString()} km</span>
                </div>
              </div>
            </div>

            {/* Work Order Details */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-400" />
                İş Emri Detayları
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Tahmini Maliyet:</span>
                  <span className="text-white font-medium">₺{workOrder.estimatedCost.toLocaleString()}</span>
                </div>
                
                {workOrder.estimatedDuration && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Tahmini Süre:</span>
                    <span className="text-white">{workOrder.estimatedDuration} saat</span>
                  </div>
                )}
                
                {workOrder.assignedTechnicianId && (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Teknisyen:</span>
                    <span className="text-white">
                      {workOrder.assignedTechnicianId.firstName} {workOrder.assignedTechnicianId.lastName}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Oluşturulma:</span>
                  <span className="text-white text-sm">
                    {new Date(workOrder.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Güncellenme:</span>
                  <span className="text-white text-sm">
                    {new Date(workOrder.updatedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
