'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Wrench, 
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
  Calendar,
  Car,
  User,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface WorkOrder {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  vehicle: Vehicle;
  customer: Customer;
  estimatedCost: number;
  actualCost?: number;
  scheduledDate: Date;
  startDate?: Date;
  completionDate?: Date;
  assignedTechnician?: string;
  workSteps: Array<{
    step: string;
    completed: boolean;
    notes?: string;
  }>;
  parts: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  customerNotes?: string;
  technicianNotes?: string;
  photos: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const statusOptions = [
  { value: 'pending', label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in-progress', label: 'İşlemde', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
  { value: 'on-hold', label: 'Bekletiliyor', color: 'bg-gray-100 text-gray-800' }
];

const priorityOptions = [
  { value: 'low', label: 'Düşük', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Yüksek', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Acil', color: 'bg-red-100 text-red-800' }
];

export default function WorkOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      loadWorkOrders();
    }
  }, [user]);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      
      // Mock data - will be replaced with real API calls
      const mockWorkOrders: WorkOrder[] = [
        {
          _id: '1',
          title: 'Motor Yağı Değişimi',
          description: 'Motor yağı ve filtre değişimi, genel kontrol',
          status: 'completed',
          priority: 'medium',
          vehicle: {
            _id: 'v1',
            plate: '34 ABC 123',
            brand: 'BMW',
            model: '320i',
            year: 2020,
            color: 'Beyaz'
          },
          customer: {
            _id: 'c1',
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            phone: '0532 123 45 67',
            email: 'ahmet@email.com'
          },
          estimatedCost: 800,
          actualCost: 750,
          scheduledDate: new Date('2024-09-01'),
          startDate: new Date('2024-09-01'),
          completionDate: new Date('2024-09-01'),
          assignedTechnician: 'Mehmet Usta',
          workSteps: [
            { step: 'Motor yağı boşaltma', completed: true },
            { step: 'Yağ filtresi değişimi', completed: true },
            { step: 'Yeni yağ ekleme', completed: true },
            { step: 'Genel kontrol', completed: true }
          ],
          parts: [
            { name: 'Motor Yağı 5W-30', quantity: 1, unitPrice: 200, totalPrice: 200 },
            { name: 'Yağ Filtresi', quantity: 1, unitPrice: 80, totalPrice: 80 }
          ],
          customerNotes: 'Müşteri memnun, tekrar gelecek',
          technicianNotes: 'Motor durumu iyi, yağ seviyesi normal',
          photos: [],
          documents: [],
          createdAt: new Date('2024-09-01'),
          updatedAt: new Date('2024-09-01')
        },
        {
          _id: '2',
          title: 'Fren Sistemi Kontrolü',
          description: 'Fren balataları kontrolü ve gerekirse değişimi',
          status: 'in-progress',
          priority: 'high',
          vehicle: {
            _id: 'v2',
            plate: '06 XYZ 789',
            brand: 'Mercedes',
            model: 'C200',
            year: 2019,
            color: 'Siyah'
          },
          customer: {
            _id: 'c2',
            firstName: 'Fatma',
            lastName: 'Demir',
            phone: '0533 987 65 43',
            email: 'fatma@email.com'
          },
          estimatedCost: 1200,
          scheduledDate: new Date('2024-09-02'),
          startDate: new Date('2024-09-02'),
          assignedTechnician: 'Ali Usta',
          workSteps: [
            { step: 'Fren balataları kontrolü', completed: true },
            { step: 'Balata değişimi', completed: false },
            { step: 'Fren sıvısı kontrolü', completed: false },
            { step: 'Test sürüşü', completed: false }
          ],
          parts: [
            { name: 'Ön Fren Balatası', quantity: 2, unitPrice: 300, totalPrice: 600 },
            { name: 'Arka Fren Balatası', quantity: 2, unitPrice: 250, totalPrice: 500 }
          ],
          technicianNotes: 'Ön balatalar aşınmış, değişim gerekli',
          photos: [],
          documents: [],
          createdAt: new Date('2024-09-02'),
          updatedAt: new Date('2024-09-02')
        }
      ];

      setWorkOrders(mockWorkOrders);
    } catch (error) {
      console.error('Work orders loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find(p => p.value === priority);
    return priorityOption ? priorityOption.color : 'bg-gray-100 text-gray-800';
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

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getPriorityLabel = (priority: string) => {
    const priorityOption = priorityOptions.find(p => p.value === priority);
    return priorityOption ? priorityOption.label : priority;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giriş Gerekli</h2>
          <p className="text-gray-600 mb-4">Bu sayfayı görüntülemek için giriş yapmalısınız</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">İş emirleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">İş Emirleri</h1>
                <p className="text-gray-600">Tüm iş emirlerini yönetin ve takip edin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="İş emri, plaka veya müşteri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg transition-colors flex items-center space-x-2 ${
                  showFilters 
                    ? 'border-blue-500 text-blue-600 bg-blue-50' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtreler</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/work-orders/add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni İş Emri</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tümü</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tümü</option>
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              İş Emirleri ({filteredWorkOrders.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredWorkOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredWorkOrders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{order.title}</h4>
                            <p className="text-gray-600 mb-3">{order.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Status and Priority */}
                        <div className="flex flex-wrap items-center space-x-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                            {getPriorityLabel(order.priority)}
                          </span>
                        </div>

                        {/* Vehicle and Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Car className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{order.vehicle.brand} {order.vehicle.model}</p>
                              <p className="text-sm text-gray-600">{order.vehicle.plate} • {order.vehicle.year}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900">{order.customer.firstName} {order.customer.lastName}</p>
                              <p className="text-sm text-gray-600">{order.customer.phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Work Progress */}
                        {order.workSteps && order.workSteps.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">İş Adımları</h5>
                            <div className="space-y-2">
                              {order.workSteps.map((step, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  {step.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-yellow-600" />
                                  )}
                                  <span className={`text-sm ${step.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                                    {step.step}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Parts */}
                        {order.parts && order.parts.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Parçalar</h5>
                            <div className="space-y-2">
                              {order.parts.map((part, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {part.name} (x{part.quantity})
                                  </span>
                                  <span className="font-medium">{formatCurrency(part.totalPrice)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Side Info */}
                      <div className="lg:ml-6 lg:min-w-[200px]">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Tahmini Maliyet</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(order.estimatedCost)}</p>
                          </div>
                          
                          {order.actualCost && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Gerçek Maliyet</p>
                              <p className="text-lg font-bold text-green-600">{formatCurrency(order.actualCost)}</p>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Planlanan Tarih</p>
                            <p className="font-medium text-gray-900">{formatDate(order.scheduledDate)}</p>
                          </div>
                          
                          {order.assignedTechnician && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Teknisyen</p>
                              <p className="font-medium text-gray-900">{order.assignedTechnician}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">İş Emri Bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                    ? 'Arama kriterlerinize uygun iş emri bulunamadı.' 
                    : 'Henüz iş emri oluşturulmamış.'}
                </p>
                <button
                  onClick={() => router.push('/dashboard/work-orders/add')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İlk İş Emrini Oluştur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
