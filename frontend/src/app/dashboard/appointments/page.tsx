'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
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
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
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

interface Appointment {
  _id: string;
  title: string;
  description: string;
  serviceType: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  vehicle: Vehicle;
  customer: Customer;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  estimatedDuration: number; // minutes
  actualStartTime?: string;
  actualEndTime?: string;
  assignedTechnician?: string;
  customerNotes?: string;
  technicianNotes?: string;
  reminderSent: boolean;
  photos: string[];
  documents: string[];
  relatedWorkOrder?: string;
  createdAt: Date;
  updatedAt: Date;
}

const statusOptions = [
  { value: 'scheduled', label: 'Planlandı', color: 'bg-blue-100 text-blue-800' },
  { value: 'confirmed', label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
  { value: 'in-progress', label: 'İşlemde', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
  { value: 'no-show', label: 'Gelmedi', color: 'bg-gray-100 text-gray-800' }
];

const priorityOptions = [
  { value: 'low', label: 'Düşük', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Yüksek', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Acil', color: 'bg-red-100 text-red-800' }
];

const serviceTypes = [
  'Motor Yağı Değişimi',
  'Fren Sistemi Kontrolü',
  'Lastik Değişimi',
  'Elektrik Sistemi',
  'Klima Servisi',
  'Genel Bakım',
  'Arıza Tespiti',
  'Diğer'
];

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Mock data - will be replaced with real API calls
      const mockAppointments: Appointment[] = [
        {
          _id: '1',
          title: 'Motor Yağı Değişimi',
          description: 'Motor yağı ve filtre değişimi, genel kontrol',
          serviceType: 'Motor Yağı Değişimi',
          status: 'confirmed',
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
          scheduledDate: new Date('2024-09-03'),
          startTime: '09:00',
          endTime: '11:00',
          estimatedDuration: 120,
          assignedTechnician: 'Mehmet Usta',
          customerNotes: 'Sabah erken gelmek istiyor',
          reminderSent: true,
          photos: [],
          documents: [],
          createdAt: new Date('2024-09-01'),
          updatedAt: new Date('2024-09-01')
        },
        {
          _id: '2',
          title: 'Fren Sistemi Kontrolü',
          description: 'Fren balataları kontrolü ve gerekirse değişimi',
          serviceType: 'Fren Sistemi Kontrolü',
          status: 'scheduled',
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
          scheduledDate: new Date('2024-09-04'),
          startTime: '14:00',
          endTime: '16:00',
          estimatedDuration: 120,
          assignedTechnician: 'Ali Usta',
          customerNotes: 'Öğleden sonra uygun',
          reminderSent: false,
          photos: [],
          documents: [],
          createdAt: new Date('2024-09-02'),
          updatedAt: new Date('2024-09-02')
        },
        {
          _id: '3',
          title: 'Genel Bakım',
          description: 'Yıllık genel bakım ve kontrol',
          serviceType: 'Genel Bakım',
          status: 'completed',
          priority: 'low',
          vehicle: {
            _id: 'v3',
            plate: '35 DEF 456',
            brand: 'Audi',
            model: 'A4',
            year: 2021,
            color: 'Gri'
          },
          customer: {
            _id: 'c3',
            firstName: 'Mehmet',
            lastName: 'Kaya',
            phone: '0534 555 44 33',
            email: 'mehmet@email.com'
          },
          scheduledDate: new Date('2024-09-02'),
          startTime: '10:00',
          endTime: '12:00',
          estimatedDuration: 120,
          actualStartTime: '10:15',
          actualEndTime: '11:45',
          assignedTechnician: 'Hasan Usta',
          customerNotes: 'Müşteri memnun',
          technicianNotes: 'Araç durumu iyi, küçük ayarlamalar yapıldı',
          reminderSent: true,
          photos: [],
          documents: [],
          createdAt: new Date('2024-09-01'),
          updatedAt: new Date('2024-09-02')
        }
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Appointments loading error:', error);
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

  const formatTime = (time: string) => {
    return time;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatDateWithDay = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date();
      matchesDate = appointment.scheduledDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = appointment.scheduledDate.toDateString() === tomorrow.toDateString();
    } else if (dateFilter === 'this-week') {
      const today = new Date();
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);
      matchesDate = appointment.scheduledDate >= today && appointment.scheduledDate <= endOfWeek;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getPriorityLabel = (priority: string) => {
    const priorityOption = priorityOptions.find(p => p.value === priority);
    return priorityOption ? priorityOption.label : priority;
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments
      .filter(apt => apt.scheduledDate >= today && apt.status !== 'cancelled' && apt.status !== 'completed')
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 5);
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
          <p className="mt-4 text-gray-600">Randevular yükleniyor...</p>
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
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Randevular</h1>
                <p className="text-gray-600">Tüm randevuları yönetin ve planlayın</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Randevu</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugün</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => {
                    const today = new Date();
                    return apt.scheduledDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'scheduled').length}
                </p>
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
                  placeholder="Randevu, plaka veya müşteri ara..."
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
                onClick={() => router.push('/dashboard/appointments/add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Randevu</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tüm Tarihler</option>
                    <option value="today">Bugün</option>
                    <option value="tomorrow">Yarın</option>
                    <option value="this-week">Bu Hafta</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Randevular ({filteredAppointments.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredAppointments.length > 0 ? (
              <div className="space-y-6">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{appointment.title}</h4>
                            <p className="text-gray-600 mb-3">{appointment.description}</p>
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
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(appointment.priority)}`}>
                            {getPriorityLabel(appointment.priority)}
                          </span>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {appointment.serviceType}
                          </span>
                        </div>

                        {/* Date and Time */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatDateWithDay(appointment.scheduledDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle and Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Car className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{appointment.vehicle.brand} {appointment.vehicle.model}</p>
                              <p className="text-sm text-gray-600">{appointment.vehicle.plate} • {appointment.vehicle.year}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900">{appointment.customer.firstName} {appointment.customer.lastName}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Phone className="w-3 h-3 text-gray-500" />
                                <span className="text-sm text-gray-600">{appointment.customer.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {(appointment.customerNotes || appointment.technicianNotes) && (
                          <div className="mb-4">
                            {appointment.customerNotes && (
                              <div className="mb-2">
                                <h5 className="font-medium text-gray-900 mb-1">Müşteri Notları:</h5>
                                <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">{appointment.customerNotes}</p>
                              </div>
                            )}
                            {appointment.technicianNotes && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-1">Teknisyen Notları:</h5>
                                <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">{appointment.technicianNotes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Side Info */}
                      <div className="lg:ml-6 lg:min-w-[200px]">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Süre</p>
                            <p className="text-lg font-bold text-gray-900">{appointment.estimatedDuration} dk</p>
                          </div>
                          
                          {appointment.assignedTechnician && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Teknisyen</p>
                              <p className="font-medium text-gray-900">{appointment.assignedTechnician}</p>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Hatırlatma</p>
                            <p className={`font-medium ${appointment.reminderSent ? 'text-green-600' : 'text-yellow-600'}`}>
                              {appointment.reminderSent ? 'Gönderildi' : 'Bekliyor'}
                            </p>
                          </div>

                          {appointment.actualStartTime && appointment.actualEndTime && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Gerçek Süre</p>
                              <p className="font-medium text-gray-900">
                                {appointment.actualStartTime} - {appointment.actualEndTime}
                              </p>
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
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Randevu Bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || dateFilter !== 'all'
                    ? 'Arama kriterlerinize uygun randevu bulunamadı.' 
                    : 'Henüz randevu oluşturulmamış.'}
                </p>
                <button
                  onClick={() => router.push('/dashboard/appointments/add')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İlk Randevuyu Oluştur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
