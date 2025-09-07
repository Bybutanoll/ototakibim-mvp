'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Trash2,
  Clock,
  User,
  Car,
  FileText,
  AlertCircle,
  CheckCircle
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
  model: string;
  year: number;
  color: string;
}

interface Service {
  _id: string;
  name: string;
  category: string;
  estimatedDuration: number;
  basePrice: number;
}

export default function AddAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    serviceType: '',
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: '',
    priority: 'medium',
    customerNotes: '',
    technicianNotes: '',
    sendNotifications: true,
    recurring: false,
    recurringPattern: 'none'
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadCustomers();
      loadVehicles();
      loadServices();
      generateTimeSlots();
    }
  }, [user]);

  const loadCustomers = async () => {
    // Mock data - will be replaced with real API call
    const mockCustomers: Customer[] = [
      { _id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', phone: '0532 123 45 67', email: 'ahmet@email.com' },
      { _id: '2', firstName: 'Fatma', lastName: 'Demir', phone: '0533 987 65 43', email: 'fatma@email.com' },
      { _id: '3', firstName: 'Mehmet', lastName: 'Kaya', phone: '0534 555 44 33', email: 'mehmet@email.com' }
    ];
    setCustomers(mockCustomers);
  };

  const loadVehicles = async () => {
    // Mock data - will be replaced with real API call
    const mockVehicles: Vehicle[] = [
      { _id: '1', plate: '34 ABC 123', brand: 'BMW', model: '320i', year: 2020, color: 'Beyaz' },
      { _id: '2', plate: '06 XYZ 789', brand: 'Mercedes', model: 'C200', year: 2019, color: 'Siyah' },
      { _id: '3', plate: '35 DEF 456', brand: 'Audi', model: 'A4', year: 2021, color: 'Gri' }
    ];
    setVehicles(mockVehicles);
  };

  const loadServices = async () => {
    // Mock data - will be replaced with real API call
    const mockServices: Service[] = [
      { _id: '1', name: 'Motor Yağı Değişimi', category: 'Bakım', estimatedDuration: 60, basePrice: 300 },
      { _id: '2', name: 'Fren Sistemi Kontrolü', category: 'Güvenlik', estimatedDuration: 90, basePrice: 500 },
      { _id: '3', name: 'Lastik Değişimi', category: 'Bakım', estimatedDuration: 45, basePrice: 200 },
      { _id: '4', name: 'Genel Kontrol', category: 'Kontrol', estimatedDuration: 120, basePrice: 400 },
      { _id: '5', name: 'Klima Bakımı', category: 'Bakım', estimatedDuration: 75, basePrice: 350 }
    ];
    setServices(mockServices);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    setAvailableSlots(slots);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (serviceId: string) => {
    const selectedService = services.find(s => s._id === serviceId);
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        serviceType: serviceId,
        estimatedDuration: selectedService.estimatedDuration.toString(),
        title: selectedService.name
      }));
    }
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, scheduledDate: date }));
    // TODO: Check availability for selected date
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, scheduledTime: time }));
    // TODO: Check availability for selected time
  };

  const calculateEndTime = () => {
    if (!formData.scheduledTime || !formData.estimatedDuration) return '';
    
    const [hours, minutes] = formData.scheduledTime.split(':').map(Number);
    const durationMinutes = parseInt(formData.estimatedDuration);
    const endMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }

      // Redirect to appointments list
      router.push('/dashboard/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Randevu oluşturulurken hata oluştu: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
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
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Yeni Randevu</h1>
                <p className="text-gray-600">Yeni randevu oluşturun ve planlayın</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer and Vehicle */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Müşteri ve Araç Bilgileri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müşteri *
                </label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => handleInputChange('customerId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Müşteri seçin</option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.firstName} {customer.lastName} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç *
                </label>
                <select
                  required
                  value={formData.vehicleId}
                  onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Araç seçin</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.plate}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Hizmet Bilgileri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmet Türü *
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Hizmet seçin</option>
                  {services.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.name} - {service.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Randevu Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Randevu için açıklayıcı başlık..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detaylı Açıklama
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Randevu için detaylı açıklama ve özel gereksinimler..."
                />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Randevu Planlaması
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih *
                </label>
                <input
                  type="date"
                  required
                  value={formData.scheduledDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Saati *
                </label>
                <select
                  required
                  value={formData.scheduledTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Saat seçin</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahmini Süre (Dakika) *
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="60"
                />
              </div>
            </div>

            {/* Time Summary */}
            {formData.scheduledTime && formData.estimatedDuration && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-800">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Zaman Özeti:</span>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Başlangıç:</span>
                    <span className="ml-2 font-medium">{formData.scheduledTime}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Bitiş:</span>
                    <span className="ml-2 font-medium">{calculateEndTime()}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Süre:</span>
                    <span className="ml-2 font-medium">{formData.estimatedDuration} dakika</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recurring Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => handleInputChange('recurring', e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                Tekrarlayan Randevu
              </label>
            </div>

            {formData.recurring && (
              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tekrarlama Sıklığı
                </label>
                <select
                  value={formData.recurringPattern}
                  onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="none">Tekrarlama yok</option>
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="biweekly">İki haftalık</option>
                  <option value="monthly">Aylık</option>
                </select>
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Bildirim Ayarları
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sendNotifications"
                  checked={formData.sendNotifications}
                  onChange={(e) => handleInputChange('sendNotifications', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="sendNotifications" className="text-sm font-medium text-gray-700">
                  Müşteriye bildirim gönder
                </label>
              </div>
              
              <div className="text-sm text-gray-600 ml-7">
                Müşteriye SMS ve email ile randevu hatırlatması gönderilecek
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Notlar
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müşteri Notları
                </label>
                <textarea
                  rows={3}
                  value={formData.customerNotes}
                  onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Müşteri için özel notlar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teknisyen Notları
                </label>
                <textarea
                  rows={3}
                  value={formData.technicianNotes}
                  onChange={(e) => handleInputChange('technicianNotes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Teknisyen için özel notlar..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Randevu Oluştur</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
