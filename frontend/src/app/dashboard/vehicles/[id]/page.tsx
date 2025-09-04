'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Car,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Wrench,
  DollarSign,
  Gauge,
  FileText,
  Clock,
  MapPin,
  Save,
  X
} from 'lucide-react';

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

interface MaintenanceRecord {
  date: string;
  type: 'service' | 'repair' | 'inspection';
  description: string;
  cost: number;
  mileage: number;
  workshop?: string;
}

export default function VehicleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceRecord>({
    date: '',
    type: 'service',
    description: '',
    cost: 0,
    mileage: 0,
    workshop: ''
  });

  useEffect(() => {
    if (user && params.id) {
      loadVehicle();
    }
  }, [user, params.id]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://ototakibim-mvp.onrender.com/api/vehicles/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicle');
      }

      const data = await response.json();
      setVehicle(data.data);
    } catch (error) {
      console.error('Vehicle loading error:', error);
      alert('Araç yüklenirken hata oluştu: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://ototakibim-mvp.onrender.com/api/vehicles/${params.id}/maintenance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add maintenance record');
      }

      // Reload vehicle data
      await loadVehicle();
      setShowAddMaintenance(false);
      setMaintenanceForm({
        date: '',
        type: 'service',
        description: '',
        cost: 0,
        mileage: 0,
        workshop: ''
      });
      alert('Bakım kaydı başarıyla eklendi');
    } catch (error) {
      console.error('Add maintenance error:', error);
      alert('Bakım kaydı eklenirken hata oluştu: ' + (error as Error).message);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getMaintenanceTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Bakım';
      case 'repair': return 'Tamir';
      case 'inspection': return 'Muayene';
      default: return type;
    }
  };

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Araç bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Araç Bulunamadı</h2>
          <p className="text-gray-600 mb-4">Bu araç bulunamadı veya erişim yetkiniz yok</p>
          <button
            onClick={() => router.push('/dashboard/vehicles')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Araçlara Dön
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {vehicle.brand} {vehicle.vehicleModel}
                </h1>
                <p className="text-gray-600">{vehicle.plate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Araç Bilgileri</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plaka:</span>
                  <span className="font-medium">{vehicle.plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marka/Model:</span>
                  <span className="font-medium">{vehicle.brand} {vehicle.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yıl:</span>
                  <span className="font-medium">{vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Renk:</span>
                  <span className="font-medium">{vehicle.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VIN:</span>
                  <span className="font-medium text-sm">{vehicle.vin}</span>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Kilometre:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString('tr-TR')} km</span>
                </div>
              </div>

              {vehicle.description && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Açıklama</h4>
                  <p className="text-gray-600 text-sm">{vehicle.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Records */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Bakım Geçmişi</h3>
                <button
                  onClick={() => setShowAddMaintenance(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Bakım Ekle</span>
                </button>
              </div>

              <div className="p-6">
                {vehicle.maintenanceHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz bakım kaydı bulunmuyor</p>
                    <button
                      onClick={() => setShowAddMaintenance(true)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      İlk Bakım Kaydını Ekle
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vehicle.maintenanceHistory
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaintenanceTypeColor(record.type)}`}>
                                {getMaintenanceTypeLabel(record.type)}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(record.date)}
                              </span>
                            </div>
                            <p className="text-gray-900 font-medium mb-2">{record.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatCurrency(record.cost)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Gauge className="w-4 h-4" />
                                <span>{record.mileage.toLocaleString('tr-TR')} km</span>
                              </div>
                              {record.workshop && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{record.workshop}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Maintenance Modal */}
      {showAddMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Bakım Kaydı Ekle</h3>
              <button
                onClick={() => setShowAddMaintenance(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaintenance} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih
                </label>
                <input
                  type="date"
                  value={maintenanceForm.date}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bakım Türü
                </label>
                <select
                  value={maintenanceForm.type}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="service">Bakım</option>
                  <option value="repair">Tamir</option>
                  <option value="inspection">Muayene</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maliyet (₺)
                  </label>
                  <input
                    type="number"
                    value={maintenanceForm.cost}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, cost: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kilometre
                  </label>
                  <input
                    type="number"
                    value={maintenanceForm.mileage}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, mileage: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servis (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={maintenanceForm.workshop}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, workshop: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Servis adı"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMaintenance(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
