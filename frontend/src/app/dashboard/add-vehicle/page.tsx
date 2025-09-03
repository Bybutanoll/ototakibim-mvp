'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  TruckIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface VehicleForm {
  brand: string;
  model: string;
  year: string;
  plate: string;
  vin: string;
  mileage: string;
  fuelType: string;
  engineSize: string;
  color: string;
  description: string;
}

const brands = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 
  'Ford', 'Renault', 'Peugeot', 'Fiat', 'Hyundai', 'Kia', 'Opel'
];

const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit'];
const engineSizes = ['1.0', '1.2', '1.4', '1.6', '1.8', '2.0', '2.5', '3.0', '3.5', '4.0'];

export default function AddVehiclePage() {
  const router = useRouter();
  const [form, setForm] = useState<VehicleForm>({
    brand: '',
    model: '',
    year: '',
    plate: '',
    vin: '',
    mileage: '',
    fuelType: '',
    engineSize: '',
    color: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (field: keyof VehicleForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // AI önerileri için trigger
    if (field === 'brand' && value.length > 2) {
      generateAISuggestions(field, value);
    }
  };

  const generateAISuggestions = (field: string, value: string) => {
    // Mock AI önerileri
    const suggestions = [
      `${value} için en popüler modeller: ${value} 3 Serisi, ${value} 5 Serisi`,
      `${value} araçlarında dikkat edilmesi gerekenler: Motor yağı, fren sistemi`,
      `${value} bakım önerileri: 10.000 km'de yağ değişimi, 20.000 km'de filtre`
    ];
    setAiSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success - redirect to dashboard
    router.push('/dashboard');
  };

  const isFormValid = form.brand && form.model && form.year && form.plate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Araç Ekle</h1>
                <p className="text-sm text-gray-400">AI destekli araç kaydı</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8"
        >
          {/* AI Assistant Banner */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 mb-8 border border-blue-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <SparklesIcon className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">AI Asistan Aktif</h2>
            </div>
            <p className="text-gray-300">
              Aracınızın bilgilerini girerken AI destekli öneriler alacaksınız. 
              Bu sayede daha doğru ve detaylı kayıt oluşturabilirsiniz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Marka *
                </label>
                <select
                  value={form.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Marka seçin</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Model adı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Üretim Yılı *
                </label>
                <select
                  value={form.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Yıl seçin</option>
                  {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plaka *
                </label>
                <input
                  type="text"
                  value={form.plate}
                  onChange={(e) => handleInputChange('plate', e.target.value.toUpperCase())}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="34 ABC 123"
                  required
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  VIN Numarası
                </label>
                <input
                  type="text"
                  value={form.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="17 karakter"
                  maxLength={17}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kilometre
                </label>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Yakıt Tipi
                </label>
                <select
                  value={form.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçin</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Motor Hacmi
                </label>
                <select
                  value={form.engineSize}
                  onChange={(e) => handleInputChange('engineSize', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçin</option>
                  {engineSizes.map(size => (
                    <option key={size} value={size}>{size}L</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Renk
                </label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Araç rengi"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Açıklama
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Aracınız hakkında ek bilgiler, özel durumlar, modifikasyonlar..."
              />
            </div>

            {/* AI Suggestions */}
            {showSuggestions && aiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <CogIcon className="h-5 w-5 text-blue-400 animate-spin" />
                  <h3 className="text-lg font-semibold text-white">AI Önerileri</h3>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                İptal
              </button>
              
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isFormValid && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Ekleniyor...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Aracı Ekle</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
