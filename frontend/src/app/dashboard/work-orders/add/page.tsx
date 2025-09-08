'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '../../../../contexts/AuthContext';
import {
  ArrowLeft,
  Wrench,
  Plus,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  Car,
  User,
  FileText,
  Camera,
  Upload
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

interface WorkStep {
  step: string;
  estimatedDuration: number;
  notes: string;
}

interface Part {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function AddWorkOrderPage() {
  const router = useRouter();
  // const { user } = useAuth();
  const user = { name: 'Demo User', email: 'demo@example.com' };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerId: '',
    vehicleId: '',
    priority: 'medium',
    estimatedDuration: '',
    scheduledDate: '',
    estimatedCost: '',
    workSteps: [{ step: '', estimatedDuration: '', notes: '' }],
    parts: [{ name: '', quantity: '', unitPrice: '', totalPrice: '' }],
    customerNotes: '',
    technicianNotes: ''
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (user) {
      loadCustomers();
      loadVehicles();
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkStepChange = (index: number, field: string, value: string) => {
    const newWorkSteps = [...formData.workSteps];
    newWorkSteps[index] = { ...newWorkSteps[index], [field]: value };
    setFormData(prev => ({ ...prev, workSteps: newWorkSteps }));
  };

  const addWorkStep = () => {
    setFormData(prev => ({
      ...prev,
      workSteps: [...prev.workSteps, { step: '', estimatedDuration: '', notes: '' }]
    }));
  };

  const removeWorkStep = (index: number) => {
    if (formData.workSteps.length > 1) {
      const newWorkSteps = formData.workSteps.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, workSteps: newWorkSteps }));
    }
  };

  const handlePartChange = (index: number, field: string, value: string) => {
    const newParts = [...formData.parts];
    newParts[index] = { ...newParts[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(field === 'quantity' ? value : newParts[index].quantity) || 0;
      const unitPrice = parseFloat(field === 'unitPrice' ? value : newParts[index].unitPrice) || 0;
      newParts[index].totalPrice = quantity * unitPrice;
    }
    
    setFormData(prev => ({ ...prev, parts: newParts }));
  };

  const addPart = () => {
    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, { name: '', quantity: '', unitPrice: '', totalPrice: 0 }]
    }));
  };

  const removePart = (index: number) => {
    if (formData.parts.length > 1) {
      const newParts = formData.parts.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, parts: newParts }));
    }
  };

  const calculateTotalCost = () => {
    const partsCost = formData.parts.reduce((sum, part) => sum + (part.totalPrice || 0), 0);
    const laborCost = parseFloat(formData.estimatedCost) || 0;
    return partsCost + laborCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/work-orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create work order');
      }

      // Redirect to work orders list
      router.push('/dashboard/work-orders');
    } catch (error) {
      console.error('Error creating work order:', error);
      alert('İş emri oluşturulurken hata oluştu: ' + (error as Error).message);
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Yeni İş Emri</h1>
                <p className="text-gray-600">Yeni iş emri oluşturun ve planlayın</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Temel Bilgiler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İş Emri Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Örn: Motor Yağı Değişimi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="İş emrinin detaylı açıklaması..."
                />
              </div>
            </div>
          </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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

          {/* Scheduling and Duration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Planlama ve Süre
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planlanan Tarih *
                </label>
                <input
                  type="date"
                  required
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahmini Süre (Saat) *
                </label>
                <input
                  type="number"
                  required
                  min="0.5"
                  step="0.5"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahmini İşçilik Maliyeti (₺) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="500.00"
                />
              </div>
            </div>
          </div>

          {/* Work Steps */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                İş Adımları
              </h3>
              <button
                type="button"
                onClick={addWorkStep}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Adım Ekle</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.workSteps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Adım {index + 1}</h4>
                    {formData.workSteps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkStep(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İş Adımı *
                      </label>
                      <input
                        type="text"
                        required
                        value={step.step}
                        onChange={(e) => handleWorkStepChange(index, 'step', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Örn: Motor yağı boşaltma"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tahmini Süre (Dakika)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={step.estimatedDuration}
                        onChange={(e) => handleWorkStepChange(index, 'estimatedDuration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notlar
                      </label>
                      <input
                        type="text"
                        value={step.notes}
                        onChange={(e) => handleWorkStepChange(index, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Özel notlar..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parts */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Parçalar
              </h3>
              <button
                type="button"
                onClick={addPart}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Parça Ekle</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.parts.map((part, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Parça {index + 1}</h4>
                    {formData.parts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePart(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parça Adı
                      </label>
                      <input
                        type="text"
                        value={part.name}
                        onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Örn: Motor Yağı 5W-30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Miktar
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={part.quantity}
                        onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birim Fiyat (₺)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={part.unitPrice}
                        onChange={(e) => handlePartChange(index, 'unitPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="200.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Toplam Fiyat (₺)
                      </label>
                      <input
                        type="number"
                        value={part.totalPrice || 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ))}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Teknisyen için özel notlar..."
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Maliyet Özeti
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-blue-700">İşçilik Maliyeti</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₺{parseFloat(formData.estimatedCost) || 0}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-blue-700">Parça Maliyeti</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₺{formData.parts.reduce((sum, part) => sum + (part.totalPrice || 0), 0)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-blue-700">Toplam Maliyet</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₺{calculateTotalCost()}
                </p>
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>İş Emri Oluştur</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
