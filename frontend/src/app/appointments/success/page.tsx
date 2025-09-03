'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Wrench,
  ArrowRight,
  Download,
  Share2,
  MessageCircle
} from 'lucide-react';

export default function AppointmentSuccessPage() {
  // Mock appointment data (in real app, this would come from URL params or context)
  const appointmentData = {
    id: 'APT-2024-001',
    vehicle: 'BMW 320i (2020)',
    service: 'Yağ Değişimi',
    date: '15 Şubat 2024',
    time: '09:00',
    duration: '60 dakika',
    price: '₺450',
    notes: 'Motor yağı ve filtre değişimi yapılacak'
  };

  const serviceCenterInfo = {
    name: 'OtoTakibim Servis Merkezi',
    address: 'Levent Mahallesi, No:123, İstanbul, Türkiye',
    phone: '+90 (212) 555 0123',
    email: 'info@ototakibim.com',
    workingHours: 'Pazartesi - Cuma: 08:00 - 18:00'
  };

  const nextSteps = [
    {
      title: 'Randevu Günü',
      description: 'Araç ile servis merkezine gelin',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Servis Süreci',
      description: 'Uzman ekibimiz araç bakımını gerçekleştirir',
      icon: Wrench,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Tamamlanma',
      description: 'Araç teslimi ve ödeme işlemi',
      icon: CheckCircle,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleDownloadReceipt = () => {
    // In real app, this would generate and download a PDF receipt
    console.log('Downloading receipt...');
  };

  const handleShareAppointment = () => {
    // In real app, this would share appointment details
    if (navigator.share) {
      navigator.share({
        title: 'Servis Randevum',
        text: `${appointmentData.vehicle} için ${appointmentData.service} randevusu`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Success Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Randevunuz Başarıyla Oluşturuldu!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Servis randevunuz onaylandı. Randevu detayları aşağıda yer almaktadır.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Appointment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Randevu Detayları</h2>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Onaylandı
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle & Service Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Car className="h-6 w-6 text-blue-500" />
                    <div>
                      <div className="font-medium text-slate-900">Araç</div>
                      <div className="text-gray-600">{appointmentData.vehicle}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Wrench className="h-6 w-6 text-green-500" />
                    <div>
                      <div className="font-medium text-slate-900">Servis</div>
                      <div className="text-gray-600">{appointmentData.service}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-purple-500" />
                    <div>
                      <div className="font-medium text-slate-900">Süre</div>
                      <div className="text-gray-600">{appointmentData.duration}</div>
                    </div>
                  </div>
                </div>

                {/* Date & Time Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-orange-500" />
                    <div>
                      <div className="font-medium text-slate-900">Tarih</div>
                      <div className="text-gray-600">{appointmentData.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-indigo-500" />
                    <div>
                      <div className="font-medium text-slate-900">Saat</div>
                      <div className="text-gray-600">{appointmentData.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">₺</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Tutar</div>
                      <div className="text-gray-600">{appointmentData.price}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appointmentData.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="font-medium text-slate-900 mb-2">Ek Notlar</div>
                  <div className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {appointmentData.notes}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Makbuz İndir</span>
                </button>

                <button
                  onClick={handleShareAppointment}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Paylaş</span>
                </button>

                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span>Dashboard'a Dön</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Service Center Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Servis Merkezi Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-red-500 mt-1" />
                    <div>
                      <div className="font-medium text-slate-900">Adres</div>
                      <div className="text-gray-600">{serviceCenterInfo.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-green-500" />
                    <div>
                      <div className="font-medium text-slate-900">Telefon</div>
                      <div className="text-gray-600">{serviceCenterInfo.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-blue-500" />
                    <div>
                      <div className="font-medium text-slate-900">E-posta</div>
                      <div className="text-gray-600">{serviceCenterInfo.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-purple-500" />
                    <div>
                      <div className="font-medium text-slate-900">Çalışma Saatleri</div>
                      <div className="text-gray-600">{serviceCenterInfo.workingHours}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                <a
                  href={`tel:${serviceCenterInfo.phone}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <Phone className="h-4 w-4" />
                  <span>Ara</span>
                </a>

                <a
                  href={`mailto:${serviceCenterInfo.email}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <Mail className="h-4 w-4" />
                  <span>E-posta Gönder</span>
                </a>

                <a
                  href="https://wa.me/900000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>

            {/* Next Steps Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Sonraki Adımlar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nextSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Hızlı İşlemler</h3>
              
              <div className="space-y-3">
                <Link
                  href="/appointments"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="text-slate-700">Randevularım</span>
                </Link>

                <Link
                  href="/vehicles"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Car className="h-5 w-5 text-green-500" />
                  <span className="text-slate-700">Araçlarım</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                  <span className="text-slate-700">Dashboard</span>
                </Link>
              </div>
            </motion.div>

            {/* Important Reminders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Önemli Hatırlatmalar</h3>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Randevu saatinden 15 dakika önce gelin</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Araç belgelerini yanınızda bulundurun</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Özel isteklerinizi önceden belirtin</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Randevu iptali için 24 saat önceden haber verin</span>
                </div>
              </div>
            </motion.div>

            {/* Support Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Destek</h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Sorularınız mı var? 7/24 müşteri hizmetlerimiz size yardımcı olmaya hazır.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">+90 (212) 555 0123</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">destek@ototakibim.com</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
