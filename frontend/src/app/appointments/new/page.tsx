'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, Car, Phone, Mail } from 'lucide-react';

export default function NewAppointmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    description: ''
  });

  const router = useRouter();

  const serviceTypes = [
    'Genel Bakım',
    'Motor Arızası',
    'Fren Sistemi',
    'Klima Bakımı',
    'Elektrik Arızası',
    'Kaporta İşleri',
    'Lastik Değişimi',
    'Diğer'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://ototakibim-mvp.onrender.com/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/appointments/success');
      } else {
        alert('Randevu alınırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Appointment error:', error);
      alert('Randevu alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Randevu Al
            </h1>
            <p className="text-gray-600">
              Aracınız için randevu alın, size en uygun zamanı seçin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Kişisel Bilgiler
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Araç Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Araç Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka *
                  </label>
                  <input
                    type="text"
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Toyota, Ford, vs."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Corolla, Focus, vs."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yıl *
                  </label>
                  <input
                    type="number"
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleInputChange}
                    required
                    min="1990"
                    max="2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>

            {/* Hizmet ve Tarih */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Hizmet ve Tarih
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmet Türü *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Hizmet türünü seçin</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tercih Edilen Tarih *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tercih Edilen Saat *
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Saat seçin</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Aracınızda yaşadığınız sorunları veya yapılmasını istediğiniz işlemleri detaylı olarak yazın..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Randevu Al
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}