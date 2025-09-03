'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointment, getAvailableTimeSlots, getNextAvailableDate, isDateAvailable } from '@/contexts/AppointmentContext';
import { 
  Calendar, 
  Clock, 
  Car, 
  Wrench, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  CalendarDays,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function NewAppointmentPage() {
  const router = useRouter();
  const { state: authState } = useAuth();
  const { state, createAppointment, clearError } = useAppointment();
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceId: '',
    appointmentDate: getNextAvailableDate(),
    appointmentTime: '09:00',
    notes: ''
  });

  const [selectedService, setSelectedService] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock vehicles data (in real app, this would come from vehicle context)
  const mockVehicles = [
    { _id: '1', brand: 'BMW', model: '320i', year: '2020', plate: '34 ABC 123' },
    { _id: '2', brand: 'Mercedes', model: 'C200', year: '2019', plate: '06 XYZ 789' }
  ];

  // Mock services data (in real app, this would come from appointment context)
  const mockServices = [
    {
      _id: '1',
      name: 'Yağ Değişimi',
      description: 'Motor yağı ve filtre değişimi',
      duration: 60,
      price: 450,
      category: 'maintenance'
    },
    {
      _id: '2',
      name: 'Fren Kontrolü',
      description: 'Fren sistemi kontrolü ve ayarı',
      duration: 90,
      price: 300,
      category: 'inspection'
    },
    {
      _id: '3',
      name: 'Genel Bakım',
      description: 'Kapsamlı araç bakımı',
      duration: 180,
      price: 800,
      category: 'maintenance'
    },
    {
      _id: '4',
      name: 'Araç Yıkama',
      description: 'Detaylı araç yıkama ve temizlik',
      duration: 120,
      price: 200,
      category: 'maintenance'
    }
  ];

  const timeSlots = getAvailableTimeSlots();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isAuthenticated, router]);

  useEffect(() => {
    if (state.error) {
      setErrors({ appointment: state.error });
    }
  }, [state.error]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Araç seçimi gerekli';
    }

    if (!formData.serviceId) {
      newErrors.serviceId = 'Servis seçimi gerekli';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Tarih seçimi gerekli';
    } else if (!isDateAvailable(formData.appointmentDate)) {
      newErrors.appointmentDate = 'Seçilen tarih uygun değil';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Saat seçimi gerekli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      await createAppointment(formData);
      
      // Success - redirect to confirmation
      router.push('/appointments/success');
    } catch (error) {
      console.error('Appointment creation error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update selected service when service changes
    if (name === 'serviceId') {
      const service = mockServices.find(s => s._id === value);
      setSelectedService(service);
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.vehicleId && formData.serviceId) {
      setStep(2);
    } else if (step === 2 && formData.appointmentDate && formData.appointmentTime) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return 'completed';
    if (stepNumber === step) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (stepNumber: number, status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    if (status === 'current') {
      return <Calendar className="h-6 w-6 text-blue-500" />;
    }
    return <Calendar className="h-6 w-6 text-gray-400" />;
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Yeni Randevu</h1>
                <p className="text-sm text-gray-500">Servis randevusu oluşturun</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: 'Araç & Servis', description: 'Araç ve servis seçimi' },
              { number: 2, title: 'Tarih & Saat', description: 'Randevu zamanı' },
              { number: 3, title: 'Onay', description: 'Randevu onayı' }
            ].map((stepInfo) => {
              const status = getStepStatus(stepInfo.number);
              return (
                <div key={stepInfo.number} className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 bg-white">
                    {getStepIcon(stepInfo.number, status)}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-sm font-medium ${
                      status === 'completed' ? 'text-green-600' :
                      status === 'current' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stepInfo.title}
                    </div>
                    <div className="text-xs text-gray-400">{stepInfo.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Vehicle & Service Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Araç ve Servis Seçimi</h2>
                  
                  {/* Vehicle Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Araç Seçin
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockVehicles.map((vehicle) => (
                        <div
                          key={vehicle._id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            formData.vehicleId === vehicle._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, vehicleId: vehicle._id }));
                            setErrors(prev => ({ ...prev, vehicleId: '' }));
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <Car className="h-8 w-8 text-blue-500" />
                            <div>
                              <div className="font-semibold text-slate-900">
                                {vehicle.brand} {vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {vehicle.year} • {vehicle.plate}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.vehicleId && (
                      <p className="mt-2 text-sm text-red-600">{errors.vehicleId}</p>
                    )}
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Servis Seçin
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockServices.map((service) => (
                        <div
                          key={service._id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            formData.serviceId === service._id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, serviceId: service._id }));
                            setSelectedService(service);
                            setErrors(prev => ({ ...prev, serviceId: '' }));
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <Wrench className="h-8 w-8 text-green-500 mt-1" />
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">{service.name}</div>
                              <div className="text-sm text-gray-600 mb-2">{service.description}</div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                  <Clock className="h-4 w-4 inline mr-1" />
                                  {service.duration} dk
                                </span>
                                <span className="font-semibold text-green-600">
                                  ₺{service.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.serviceId && (
                      <p className="mt-2 text-sm text-red-600">{errors.serviceId}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Tarih ve Saat Seçimi</h2>
                  
                  {/* Date Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Tarih Seçin
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      min={getNextAvailableDate()}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.appointmentDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {errors.appointmentDate && (
                      <p className="mt-2 text-sm text-red-600">{errors.appointmentDate}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Hafta sonları ve geçmiş tarihler seçilemez
                    </p>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Saat Seçin
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, appointmentTime: time }));
                            setErrors(prev => ({ ...prev, appointmentTime: '' }));
                          }}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            formData.appointmentTime === time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {errors.appointmentTime && (
                      <p className="mt-2 text-sm text-red-600">{errors.appointmentTime}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Ek Notlar (Opsiyonel)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Araç hakkında özel bilgiler, sorunlar veya isteklerinizi yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Randevu Onayı</h2>
                  
                  {/* Appointment Summary */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Randevu Detayları</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Vehicle Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Car className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium text-slate-900">Araç</div>
                            <div className="text-sm text-gray-600">
                              {mockVehicles.find(v => v._id === formData.vehicleId)?.brand} {' '}
                              {mockVehicles.find(v => v._id === formData.vehicleId)?.model} {' '}
                              ({mockVehicles.find(v => v._id === formData.vehicleId)?.year})
                            </div>
                            <div className="text-sm text-gray-500">
                              {mockVehicles.find(v => v._id === formData.vehicleId)?.plate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Wrench className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium text-slate-900">Servis</div>
                            <div className="text-sm text-gray-600">
                              {selectedService?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedService?.duration} dakika • ₺{selectedService?.price}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="font-medium text-slate-900">Tarih</div>
                            <div className="text-sm text-gray-600">
                              {new Date(formData.appointmentDate).toLocaleDateString('tr-TR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-medium text-slate-900">Saat</div>
                            <div className="text-sm text-gray-600">
                              {formData.appointmentTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {formData.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="font-medium text-slate-900 mb-2">Ek Notlar</div>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                          {formData.notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service Center Info */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Servis Merkezi Bilgileri</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium text-slate-900">Adres</div>
                          <div className="text-sm text-gray-600">
                            Levent Mahallesi, No:123<br />
                            İstanbul, Türkiye
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium text-slate-900">Telefon</div>
                          <div className="text-sm text-gray-600">+90 (212) 555 0123</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="font-medium text-slate-900">E-posta</div>
                          <div className="text-sm text-gray-600">info@ototakibim.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {errors.appointment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-600">{errors.appointment}</p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Geri
                </button>
              )}
              
              <div className="ml-auto">
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (step === 1 && (!formData.vehicleId || !formData.serviceId)) ||
                      (step === 2 && (!formData.appointmentDate || !formData.appointmentTime))
                    }
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Devam Et
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={state.isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {state.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Randevu Oluşturuluyor...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Randevuyu Onayla</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
