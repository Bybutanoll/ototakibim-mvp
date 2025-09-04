'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Car, 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2,
  Save,
  X
} from 'lucide-react';

interface VehicleFormData {
  plate: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  engineSize: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg';
  transmission: 'manual' | 'automatic' | 'semi-automatic';
  mileage: number;
  color: string;
  description: string;
  photos: File[];
  documents: Array<{
    name: string;
    type: 'insurance' | 'registration' | 'inspection' | 'other';
    file: File;
  }>;
}

// Önceden tanımlanmış araç markaları
const carBrands = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick', 'Cadillac',
  'Chevrolet', 'Chrysler', 'Citroën', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis',
  'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini',
  'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz',
  'MINI', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Plymouth', 'Pontiac', 'Porsche',
  'Ram', 'Renault', 'Rolls-Royce', 'Saab', 'Saturn', 'Scion', 'Seat', 'Škoda',
  'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo', 'Diğer'
];

const fuelTypes = [
  { value: 'gasoline', label: 'Benzin' },
  { value: 'diesel', label: 'Dizel' },
  { value: 'electric', label: 'Elektrik' },
  { value: 'hybrid', label: 'Hibrit' },
  { value: 'lpg', label: 'LPG' }
];

const transmissionTypes = [
  { value: 'manual', label: 'Manuel' },
  { value: 'automatic', label: 'Otomatik' },
  { value: 'semi-automatic', label: 'Yarı Otomatik' }
];

const documentTypes = [
  { value: 'insurance', label: 'Sigorta' },
  { value: 'registration', label: 'Ruhsat' },
  { value: 'inspection', label: 'Muayene' },
  { value: 'other', label: 'Diğer' }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function AddVehiclePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>({
    plate: '',
    brand: '',
    model: '',
    year: currentYear,
    vin: '',
    engineSize: '',
    fuelType: 'gasoline',
    transmission: 'manual',
    mileage: 0,
    color: '',
    description: '',
    photos: [],
    documents: []
  });

  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, {
        name: '',
        type: 'insurance',
        file: new File([], '')
      }]
    }));
  };

  const updateDocument = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) => 
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<VehicleFormData> = {};

    if (!formData.plate.trim()) {
      newErrors.plate = 'Plaka gerekli';
    } else if (!/^[0-9]{2}\s*[A-Z]{1,3}\s*[0-9]{2,4}$/.test(formData.plate.trim())) {
      newErrors.plate = 'Geçerli plaka formatı: 34 ABC 123';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Marka gerekli';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model gerekli';
    }

    if (!formData.vin.trim()) {
      newErrors.vin = 'VIN numarası gerekli';
    } else if (formData.vin.length !== 17) {
      newErrors.vin = 'VIN numarası 17 karakter olmalı';
    }

    if (!formData.engineSize.trim()) {
      newErrors.engineSize = 'Motor hacmi gerekli';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Renk gerekli';
    }

    if (formData.mileage < 0) {
      newErrors.mileage = 'Kilometre 0\'dan küçük olamaz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Prepare form data for API
      const vehicleData = {
        plate: formData.plate,
        brand: formData.brand,
        vehicleModel: formData.model,
        year: formData.year,
        vin: formData.vin,
        engineSize: formData.engineSize,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        mileage: formData.mileage,
        color: formData.color,
        description: formData.description
      };

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/vehicles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vehicle');
      }

      router.push('/dashboard/vehicles');
    } catch (error) {
      console.error('Vehicle creation error:', error);
      alert('Araç oluşturulurken hata oluştu: ' + (error as Error).message);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-gray-900">Yeni Araç Ekle</h1>
                <p className="text-gray-600">Araç bilgilerini girerek sisteme ekleyin</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-6">Temel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plaka *
                </label>
                <input
                  type="text"
                  value={formData.plate}
                  onChange={(e) => handleInputChange('plate', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.plate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="34 ABC 123"
                />
                {errors.plate && (
                  <p className="mt-1 text-sm text-red-600">{errors.plate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN Numarası *
                </label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="17 karakter"
                  maxLength={17}
                />
                {errors.vin && (
                  <p className="mt-1 text-sm text-red-600">{errors.vin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marka *
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="" className="text-gray-500">Marka seçiniz</option>
                  {carBrands.map(brand => (
                    <option key={brand} value={brand} className="text-gray-900">{brand}</option>
                  ))}
                </select>
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="320i"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yıl *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {years.map(year => (
                    <option key={year} value={year} className="text-gray-900">{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renk *
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.color ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Beyaz"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motor Hacmi *
                </label>
                <input
                  type="text"
                  value={formData.engineSize}
                  onChange={(e) => handleInputChange('engineSize', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.engineSize ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2.0L"
                />
                {errors.engineSize && (
                  <p className="mt-1 text-sm text-red-600">{errors.engineSize}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yakıt Tipi *
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {fuelTypes.map(type => (
                    <option key={type.value} value={type.value} className="text-gray-900">{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vites Tipi *
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {transmissionTypes.map(type => (
                    <option key={type.value} value={type.value} className="text-gray-900">{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometre *
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mileage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.mileage && (
                  <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Araç hakkında ek bilgiler..."
              />
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Fotoğraflar</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Fotoğraf Ekle</p>
                </div>
              </label>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Belgeler</h3>
              <button
                type="button"
                onClick={addDocument}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Belge Ekle</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => updateDocument(index, 'name', e.target.value)}
                      placeholder="Belge adı"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  
                  <select
                    value={doc.type}
                    onChange={(e) => updateDocument(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value} className="text-gray-900">{type.label}</option>
                    ))}
                  </select>
                  
                  <input
                    type="file"
                    onChange={(e) => updateDocument(index, 'file', e.target.files?.[0] || new File([], ''))}
                    className="flex-1"
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.documents.length === 0 && (
                <p className="text-gray-500 text-center py-8">Henüz belge eklenmemiş</p>
              )}
            </div>
          </div>

          {/* Submit */}
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Aracı Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
