'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  Wrench, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Target,
  Zap
} from 'lucide-react';

interface OnboardingData {
  businessName: string;
  businessType: 'individual' | 'company';
  phone: string;
  email: string;
  address: string;
  experience: string;
  dailyCapacity: number;
  services: string[];
  goals: string[];
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    businessName: '',
    businessType: 'individual',
    phone: '',
    email: '',
    address: '',
    experience: '',
    dailyCapacity: 5,
    services: [],
    goals: []
  });

  const { user } = useAuth();
  const router = useRouter();

  const steps = [
    { id: 1, title: 'İşletme Bilgileri', icon: Building2 },
    { id: 2, title: 'İletişim Bilgileri', icon: Phone },
    { id: 3, title: 'Deneyim & Kapasite', icon: Target },
    { id: 4, title: 'Hizmetler', icon: Wrench },
    { id: 5, title: 'Hedefler', icon: Star },
    { id: 6, title: 'Tamamlandı', icon: CheckCircle }
  ];

  const serviceOptions = [
    'Motor Bakımı',
    'Fren Sistemi',
    'Klima Bakımı',
    'Elektrik Arızaları',
    'Kaporta İşleri',
    'Lastik Değişimi',
    'Akü Değişimi',
    'Egzoz Sistemi',
    'Süspansiyon',
    'Transmisyon'
  ];

  const goalOptions = [
    'Müşteri memnuniyetini artırmak',
    'İş süreçlerini dijitalleştirmek',
    'Maliyetleri düşürmek',
    'Randevu sistemini iyileştirmek',
    'Stok yönetimini optimize etmek',
    'Gelir artışı sağlamak',
    'Müşteri takibini güçlendirmek',
    'Raporlama sistemini geliştirmek'
  ];

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Onboarding verilerini kaydet
      const response = await fetch('https://ototakibim-mvp.onrender.com/api/users/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Dashboard'a yönlendir
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      // Hata olsa bile dashboard'a git
      router.push('/dashboard');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İşletme Adı *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Örn: Mehmet Usta Oto Servisi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                İşletme Türü *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('businessType', 'individual')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.businessType === 'individual'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Bireysel</div>
                  <div className="text-sm text-gray-500">Teknisyen</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('businessType', 'company')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.businessType === 'company'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Building2 className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Şirket</div>
                  <div className="text-sm text-gray-500">Oto Servis</div>
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="+90 5XX XXX XX XX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={3}
                placeholder="İşletme adresinizi girin"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sektördeki Deneyiminiz
              </label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Seçiniz</option>
                <option value="0-1">0-1 yıl</option>
                <option value="1-3">1-3 yıl</option>
                <option value="3-5">3-5 yıl</option>
                <option value="5-10">5-10 yıl</option>
                <option value="10+">10+ yıl</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Günlük Araç Kapasitesi
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={formData.dailyCapacity}
                  onChange={(e) => handleInputChange('dailyCapacity', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-blue-600 min-w-[3rem]">
                  {formData.dailyCapacity} araç
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Günlük ortalama kaç aracı servis edebilirsiniz?
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sunduğunuz Hizmetler (Birden fazla seçebilirsiniz)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.services.includes(service)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Wrench className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{service}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hedefleriniz (Birden fazla seçebilirsiniz)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.goals.includes(goal)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5" />
                      <span className="font-medium">{goal}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Hoş Geldiniz, {formData.businessName}!
              </h3>
              <p className="text-gray-600">
                OtoTakibim'e başarıyla kaydoldunuz. Artık işletmenizi dijitalleştirmeye başlayabilirsiniz.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Sıradaki Adımlar:</h4>
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">İlk araçlarınızı ekleyin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Müşteri bilgilerini girin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">İlk randevularınızı oluşturun</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                OtoTakibim'e Hoş Geldiniz
              </h1>
              <p className="text-gray-600">
                İşletmenizi tanıyalım ve size en uygun deneyimi sunalım
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Adım {currentStep} / {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        {currentStep < steps.length && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>

            <button
              onClick={currentStep === steps.length ? handleComplete : handleNext}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>
                {currentStep === steps.length - 1 ? 'Tamamla' : 'İleri'}
              </span>
              {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {currentStep === steps.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Zap className="w-5 h-5" />
              <span>Dashboard'a Git</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
