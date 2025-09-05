'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import VehicleForm from '@/components/VehicleForm';
import {
  Car,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  MapPin,
  Wrench,
  FileText,
  ArrowLeft,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  vehicleModel: string;
  year: number;
  color: string;
  vin: string;
  engineSize: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg';
  transmission: 'manual' | 'automatic' | 'semi-automatic';
  mileage: number;
  owner: Customer;
  description?: string;
  photos: string[];
  documents: any[];
  maintenanceHistory: Array<{
    date: Date;
    type: 'service' | 'repair' | 'inspection';
    description: string;
    cost: number;
    mileage: number;
    workshop?: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statusOptions = [
  { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
  { value: 'maintenance', label: 'Bakımda', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'retired', label: 'Emekli', color: 'bg-gray-100 text-gray-800' }
];

const fuelOptions = ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit', 'Hidrojen'];
const transmissionOptions = ['Manuel', 'Otomatik', 'Yarı Otomatik', 'CVT'];

export default function VehiclesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (user) {
      loadVehicles();
      loadCustomers();
    }
  }, [user]);

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      setVehicles(data.data || []);
    } catch (error) {
      console.error('Vehicles loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Customers loading error:', error);
    }
  };

  const handleSaveVehicle = async (vehicleData: any) => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('plate', vehicleData.plate);
      formData.append('brand', vehicleData.brand);
      formData.append('vehicleModel', vehicleData.vehicleModel);
      formData.append('year', vehicleData.year.toString());
      formData.append('color', vehicleData.color);
      formData.append('vin', vehicleData.vin);
      formData.append('engineSize', vehicleData.engineSize);
      formData.append('fuelType', vehicleData.fuelType);
      formData.append('transmission', vehicleData.transmission);
      formData.append('mileage', vehicleData.mileage.toString());
      formData.append('owner', vehicleData.owner);
      formData.append('description', vehicleData.description);

      // Append photos
      vehicleData.photos.forEach((photo: File, index: number) => {
        formData.append('photos', photo);
      });

      const url = editingVehicle 
        ? `${API_BASE_URL}/api/vehicles/${editingVehicle._id}`
        : `${API_BASE_URL}/api/vehicles`;

      const response = await fetch(url, {
        method: editingVehicle ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await loadVehicles();
        setEditingVehicle(null);
        setShowVehicleForm(false);
      } else {
        throw new Error('Vehicle save failed');
      }
    } catch (error) {
      console.error('Vehicle save error:', error);
      throw error;
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await loadVehicles();
      } else {
        throw new Error('Vehicle delete failed');
      }
    } catch (error) {
      console.error('Vehicle delete error:', error);
    }
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowVehicleForm(true);
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('tr-TR').format(mileage);
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://ototakibim-mvp.onrender.com/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete vehicle');
      }

      // Remove vehicle from local state
      setVehicles(vehicles.filter(v => v._id !== vehicleId));
      alert('Araç başarıyla silindi');
    } catch (error) {
      console.error('Delete vehicle error:', error);
      alert('Araç silinirken hata oluştu: ' + (error as Error).message);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.owner.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = brandFilter === 'all' || vehicle.brand === brandFilter;
    const matchesStatus = statusFilter === 'all' || (vehicle.isActive ? 'active' : 'retired') === statusFilter;
    const matchesYear = yearFilter === 'all' || vehicle.year.toString() === yearFilter;

    return matchesSearch && matchesBrand && matchesStatus && matchesYear;
  });

  const getUniqueBrands = () => {
    const brands = vehicles.map(v => v.brand);
    return ['all', ...Array.from(new Set(brands))];
  };

  const getUniqueYears = () => {
    const years = vehicles.map(v => v.year);
    return ['all', ...Array.from(new Set(years)).sort((a, b) => b - a)];
  };

  const toggleVehicleExpansion = (vehicleId: string) => {
    setExpandedVehicle(expandedVehicle === vehicleId ? null : vehicleId);
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
          <p className="mt-4 text-gray-600">Araçlar yükleniyor...</p>
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
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Araçlarım</h1>
                <p className="text-gray-600">Tüm araçları yönetin ve takip edin</p>
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
                  placeholder="Plaka, marka, model veya müşteri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                onClick={handleAddVehicle}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Araç Ekle</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
                  <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tümü</option>
                    {getUniqueBrands().slice(1).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tümü</option>
                    {getUniqueYears().slice(1).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicles List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Araçlar ({filteredVehicles.length})
            </h3>
          </div>

          <div className="p-6">
            {filteredVehicles.length > 0 ? (
              <div className="space-y-4">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle._id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Vehicle Header */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Car className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {vehicle.brand} {vehicle.vehicleModel}
                            </h4>
                            <p className="text-gray-600">{vehicle.plate}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.isActive ? 'active' : 'retired')}`}>
                            {getStatusLabel(vehicle.isActive ? 'active' : 'retired')}
                          </span>
                          <button
                            onClick={() => toggleVehicleExpansion(vehicle._id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {expandedVehicle === vehicle._id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Basic Info Row */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{vehicle.year}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{vehicle.color}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wrench className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{formatMileage(vehicle.mileage)} km</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{vehicle.owner.firstName} {vehicle.owner.lastName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedVehicle === vehicle._id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Technical Details */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <Wrench className="w-4 h-4 mr-2" />
                              Teknik Detaylar
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">VIN:</span>
                                <span className="font-medium">{vehicle.vin}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Motor:</span>
                                <span className="font-medium">{vehicle.engineSize}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Yakıt:</span>
                                <span className="font-medium">{vehicle.fuelType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Vites:</span>
                                <span className="font-medium">{vehicle.transmission}</span>
                              </div>
                            </div>
                          </div>

                          {/* Maintenance Info */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Bakım Bilgileri
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Son Bakım:</span>
                                <span className="font-medium">{formatDate(vehicle.lastMaintenance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sonraki Bakım:</span>
                                <span className="font-medium">{formatDate(vehicle.nextMaintenance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Açıklama:</span>
                                <span className="font-medium">{vehicle.description}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-end space-x-3">
                          <button 
                            onClick={() => router.push(`/dashboard/vehicles/${vehicle._id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditVehicle(vehicle)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteVehicle(vehicle._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Araç Bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || brandFilter !== 'all' || statusFilter !== 'all' || yearFilter !== 'all'
                    ? 'Arama kriterlerinize uygun araç bulunamadı.'
                    : 'Henüz araç eklenmemiş.'}
                </p>
                <button
                  onClick={handleAddVehicle}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  İlk Aracı Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Form Modal */}
      <VehicleForm
        isOpen={showVehicleForm}
        onClose={() => {
          setShowVehicleForm(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
        editingVehicle={editingVehicle}
        customers={customers}
      />
    </div>
  );
}
