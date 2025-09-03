'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon,
  ClockIcon,
  WrenchIcon,
  TruckIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';

// Validation Schema
const appointmentSchema = yup.object({
  serviceType: yup.string().required('Servis türü seçilmelidir'),
  vehicleId: yup.string().required('Araç seçilmelidir'),
  preferredDate: yup.date().required('Tarih seçilmelidir'),
  preferredTime: yup.string().required('Saat seçilmelidir'),
  description: yup.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
  urgency: yup.string().required('Öncelik seviyesi seçilmelidir'),
  contactPhone: yup.string().required('Telefon numarası gerekli'),
  notes: yup.string()
});

interface AppointmentFormData {
  serviceType: string;
  vehicleId: string;
  preferredDate: Date;
  preferredTime: string;
  description: string;
  urgency: string;
  contactPhone: string;
  notes: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  healthScore: number;
}

interface ServiceType {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  estimatedCost: string;
  category: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: '1',
    name: 'Periyodik Bakım',
    description: 'Rutin bakım ve kontroller',
    estimatedDuration: '2-3 saat',
    estimatedCost: '₺800-1,200',
    category: 'Bakım'
  },
  {
    id: '2',
    name: 'Yağ Değişimi',
    description: 'Motor yağı ve filtre değişimi',
    estimatedDuration: '1 saat',
    estimatedCost: '₺400-600',
    category: 'Bakım'
  },
  {
    id: '3',
    name: 'Fren Bakımı',
    description: 'Fren sistemi kontrolü ve bakımı',
    estimatedDuration: '2-3 saat',
    estimatedCost: '₺1,200-2,000',
    category: 'Güvenlik'
  },
  {
    id: '4',
    name: 'Lastik Değişimi',
    description: 'Lastik değişimi ve balans',
    estimatedDuration: '1-2 saat',
    estimatedCost: '₺800-1,500',
    category: 'Güvenlik'
  },
  {
    id: '5',
    name: 'Motor Arıza',
    description: 'Motor problemleri ve onarım',
    estimatedDuration: '4-8 saat',
    estimatedCost: '₺2,000-5,000',
    category: 'Onarım'
  },
  {
    id: '6',
    name: 'Elektrik Sistemi',
    description: 'Elektrik arızaları ve onarım',
    estimatedDuration: '2-4 saat',
    estimatedCost: '₺1,500-3,000',
    category: 'Onarım'
  },
  {
    id: '7',
    name: 'Klima Servisi',
    description: 'Klima sistemi bakım ve onarım',
    estimatedDuration: '2-3 saat',
    estimatedCost: '₺1,000-2,500',
    category: 'Konfor'
  },
  {
    id: '8',
    name: 'Ekspertiz',
    description: 'Detaylı araç inceleme',
    estimatedDuration: '1-2 saat',
    estimatedCost: '₺500-1,000',
    category: 'Değerlendirme'
  }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const urgencyLevels = [
  { value: 'low', label: 'Düşük', description: 'Rutin bakım, planlı' },
  { value: 'medium', label: 'Orta', description: 'Kontrol gerekli, 1-2 hafta' },
  { value: 'high', label: 'Yüksek', description: 'Acil, 1-3 gün' },
  { value: 'urgent', label: 'Acil', description: 'Çok acil, aynı gün' }
];

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSubmit: (data: AppointmentFormData) => void;
}

export default function AppointmentForm({ isOpen, onClose, vehicles, onSubmit }: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      urgency: 'medium',
      description: '',
      notes: ''
    }
  });

  const watchedServiceType = watch('serviceType');
  const watchedVehicleId = watch('vehicleId');

  // AI Önerileri
  useEffect(() => {
    if (watchedServiceType && watchedVehicleId) {
      generateAISuggestions();
    }
  }, [watchedServiceType, watchedVehicleId]);

  const generateAISuggestions = () => {
    const vehicle = vehicles.find(v => v.id === watchedVehicleId);
    const service = serviceTypes.find(s => s.id === watchedServiceType);
    
    if (!vehicle || !service) return;

    const suggestions = [
      `${vehicle.brand} ${vehicle.model} için ${service.name} önerileri:`,
      `• Sağlık skoru: ${vehicle.healthScore}/100 - ${vehicle.healthScore >= 80 ? 'İyi durumda' : 'Dikkat gerekli'}`,
      `• Tahmini süre: ${service.estimatedDuration}`,
      `• Tahmini maliyet: ${service.estimatedCost}`,
      `• Önerilen: ${vehicle.healthScore >= 80 ? 'Rutin bakım yeterli' : 'Detaylı inceleme gerekli'}`
    ];
    
    setAiSuggestions(suggestions);
    setShowSuggestions(true);
  };

  // Calendar Logic
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setValue('preferredDate', date);
    setShowCalendar(false);
  };

  const handleFormSubmit = async (data: AppointmentFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const getServiceCategoryColor = (category: string) => {
    switch (category) {
      case 'Bakım': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Güvenlik': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Onarım': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Konfor': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Değerlendirme': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Yeni Randevu Oluştur</h2>
                  <p className="text-sm text-gray-400">AI destekli randevu sistemi</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* AI Suggestions Banner */}
            {showSuggestions && aiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 mb-6 border border-blue-500/30"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <SparklesIcon className="h-5 w-5 text-blue-400 animate-pulse" />
                  <h3 className="text-lg font-semibold text-white">AI Önerileri</h3>
                </div>
                <div className="space-y-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <p key={index} className="text-gray-300 text-sm">{suggestion}</p>
                  ))}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Service Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <WrenchIcon className="h-4 w-4 inline mr-2" />
                  Servis Türü *
                </label>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceTypes.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            field.value === service.id
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-white/20 bg-white/5 hover:border-blue-500/50'
                          }`}
                          onClick={() => field.onChange(service.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white">{service.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getServiceCategoryColor(service.category)}`}>
                              {service.category}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{service.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-400">⏱️ {service.estimatedDuration}</span>
                            <span className="text-green-400">💰 {service.estimatedCost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
                {errors.serviceType && (
                  <p className="text-red-400 text-sm mt-2">{errors.serviceType.message}</p>
                )}
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <TruckIcon className="h-4 w-4 inline mr-2" />
                  Araç Seçimi *
                </label>
                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            field.value === vehicle.id
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-white/20 bg-white/5 hover:border-blue-500/50'
                          }`}
                          onClick={() => field.onChange(vehicle.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{vehicle.brand} {vehicle.model}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle.healthScore >= 80 ? 'bg-green-500/20 text-green-400' :
                              vehicle.healthScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {vehicle.healthScore}/100
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{vehicle.year} • {vehicle.plate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                />
                {errors.vehicleId && (
                  <p className="text-red-400 text-sm mt-2">{errors.vehicleId.message}</p>
                )}
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <CalendarIcon className="h-4 w-4 inline mr-2" />
                    Tarih Seçimi *
                  </label>
                  <Controller
                    name="preferredDate"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCalendar(!showCalendar)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white text-left hover:bg-white/20 transition-colors duration-300"
                        >
                          {field.value ? format(field.value, 'dd MMMM yyyy, EEEE', { locale: tr }) : 'Tarih seçin'}
                        </button>
                        
                        {showCalendar && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 mt-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 z-10 min-w-[300px]"
                          >
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                                <div key={day} className="text-center text-gray-400 text-xs font-medium py-2">
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1">
                              {weekDays.map((date) => (
                                <button
                                  key={date.toISOString()}
                                  type="button"
                                  onClick={() => handleDateSelect(date)}
                                  className={`p-2 text-sm rounded-lg transition-all duration-300 ${
                                    isSameDay(date, today)
                                      ? 'bg-blue-500 text-white'
                                      : date < today
                                      ? 'text-gray-500 cursor-not-allowed'
                                      : 'text-white hover:bg-white/20'
                                  }`}
                                  disabled={date < today}
                                >
                                  {format(date, 'd')}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  />
                  {errors.preferredDate && (
                    <p className="text-red-400 text-sm mt-2">{errors.preferredDate.message}</p>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <ClockIcon className="h-4 w-4 inline mr-2" />
                    Saat Seçimi *
                  </label>
                  <Controller
                    name="preferredTime"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => field.onChange(time)}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                              field.value === time
                                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                : 'border-white/20 bg-white/5 text-white hover:border-blue-500/50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                  {errors.preferredTime && (
                    <p className="text-red-400 text-sm mt-2">{errors.preferredTime.message}</p>
                  )}
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Öncelik Seviyesi *
                </label>
                <Controller
                  name="urgency"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {urgencyLevels.map((level) => (
                        <div
                          key={level.value}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            field.value === level.value
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-white/20 bg-white/5 hover:border-blue-500/50'
                          }`}
                          onClick={() => field.onChange(level.value)}
                        >
                          <h4 className="font-semibold text-white mb-1">{level.label}</h4>
                          <p className="text-gray-400 text-xs">{level.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Sorun Açıklaması *
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Aracınızda yaşadığınız sorunu detaylı olarak açıklayın..."
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-2">{errors.description.message}</p>
                )}
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  İletişim Telefonu *
                </label>
                <Controller
                  name="contactPhone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  )}
                />
                {errors.contactPhone && (
                  <p className="text-red-400 text-sm mt-2">{errors.contactPhone.message}</p>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Ek Notlar
                </label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ek bilgiler, özel istekler, tercihler..."
                    />
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  İptal
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Gönderiliyor...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Randevu Oluştur</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
