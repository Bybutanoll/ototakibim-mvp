'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  Car,
  Calendar,
  DollarSign,
  Star,
  ArrowLeft,
  UserPlus,
  Building,
  CreditCard
} from 'lucide-react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  vehicles: Array<{
    _id: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
  }>;
  totalSpent: number;
  lastVisit: Date;
  status: 'active' | 'inactive' | 'vip' | 'new';
  loyaltyPoints: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const statusOptions = [
  { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Pasif', color: 'bg-gray-100 text-gray-800' },
  { value: 'vip', label: 'VIP', color: 'bg-purple-100 text-purple-800' },
  { value: 'new', label: 'Yeni', color: 'bg-blue-100 text-blue-800' }
];

export default function CustomersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      loadCustomers();
    }
  }, [user]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      
      // Mock data - will be replaced with real API calls
      const mockCustomers: Customer[] = [
        {
          _id: '1',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet@email.com',
          phone: '0532 123 45 67',
          company: 'Yılmaz Ltd. Şti.',
          address: {
            street: 'Atatürk Caddesi No:123',
            city: 'İstanbul',
            state: 'Kadıköy',
            zipCode: '34700',
            country: 'Türkiye'
          },
          vehicles: [
            {
              _id: 'v1',
              plate: '34 ABC 123',
              brand: 'BMW',
              model: '320i',
              year: 2020
            },
            {
              _id: 'v2',
              plate: '34 DEF 456',
              brand: 'Mercedes',
              model: 'C200',
              year: 2019
            }
          ],
          totalSpent: 8500,
          lastVisit: new Date('2024-09-01'),
          status: 'vip',
          loyaltyPoints: 1250,
          notes: 'VIP müşteri, premium hizmet tercih ediyor',
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date('2024-09-01')
        },
        {
          _id: '2',
          firstName: 'Fatma',
          lastName: 'Demir',
          email: 'fatma@email.com',
          phone: '0533 987 65 43',
          address: {
            street: 'İnönü Sokak No:45',
            city: 'Ankara',
            state: 'Çankaya',
            zipCode: '06690',
            country: 'Türkiye'
          },
          vehicles: [
            {
              _id: 'v3',
              plate: '06 XYZ 789',
              brand: 'Audi',
              model: 'A4',
              year: 2021
            }
          ],
          totalSpent: 3200,
          lastVisit: new Date('2024-08-28'),
          status: 'active',
          loyaltyPoints: 480,
          notes: 'Düzenli bakım yaptırıyor',
          createdAt: new Date('2023-06-20'),
          updatedAt: new Date('2024-08-28')
        },
        {
          _id: '3',
          firstName: 'Mehmet',
          lastName: 'Kaya',
          email: 'mehmet@email.com',
          phone: '0534 555 44 33',
          company: 'Kaya Otomotiv',
          address: {
            street: 'Sanayi Caddesi No:78',
            city: 'İzmir',
            state: 'Bornova',
            zipCode: '35000',
            country: 'Türkiye'
          },
          vehicles: [
            {
              _id: 'v4',
              plate: '35 GHI 012',
              brand: 'Volkswagen',
              model: 'Passat',
              year: 2018
            }
          ],
          totalSpent: 1800,
          lastVisit: new Date('2024-07-15'),
          status: 'active',
          loyaltyPoints: 270,
          notes: 'Şirket araçları için toplu hizmet alıyor',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-07-15')
        }
      ];

      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Customers loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
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

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getTotalCustomers = () => customers.length;
  const getActiveCustomers = () => customers.filter(c => c.status === 'active').length;
  const getVipCustomers = () => customers.filter(c => c.status === 'vip').length;
  const getTotalRevenue = () => customers.reduce((sum, c) => sum + c.totalSpent, 0);

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
          <p className="mt-4 text-gray-600">Müşteriler yükleniyor...</p>
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
                <p className="text-gray-600">Tüm müşteri profillerini yönetin ve takip edin</p>
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalCustomers()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{getActiveCustomers()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">VIP Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{getVipCustomers()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalRevenue())}</p>
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
                  placeholder="Müşteri adı, email veya telefon ara..."
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
                    ? 'border-purple-500 text-purple-600 bg-purple-50' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtreler</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/customers/add')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Müşteri</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customers List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Müşteriler ({filteredCustomers.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredCustomers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                  <div key={customer._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-600">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {getStatusLabel(customer.status)}
                          </span>
                        </div>
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

                    {/* Contact Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{customer.phone}</span>
                      </div>
                      {customer.company && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{customer.company}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {customer.address.city}, {customer.address.state}
                        </span>
                      </div>
                    </div>

                    {/* Vehicles */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <Car className="w-4 h-4" />
                        <span>Araçlar ({customer.vehicles.length})</span>
                      </h5>
                      <div className="space-y-2">
                        {customer.vehicles.map((vehicle) => (
                          <div key={vehicle._id} className="text-sm bg-gray-50 p-2 rounded">
                            <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                            <span className="text-gray-600 ml-2">({vehicle.plate})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Toplam Harcama</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(customer.totalSpent)}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Loyalty Puanı</p>
                        <p className="text-lg font-bold text-green-600">{customer.loyaltyPoints}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>Son Ziyaret: {formatDate(customer.lastVisit)}</span>
                        <span>Kayıt: {formatDate(customer.createdAt)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Detay Görüntüle
                        </button>
                        <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Düzenle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Müşteri Bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Arama kriterlerinize uygun müşteri bulunamadı.' 
                    : 'Henüz müşteri eklenmemiş.'}
                </p>
                <button
                  onClick={() => router.push('/dashboard/customers/add')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  İlk Müşteriyi Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
