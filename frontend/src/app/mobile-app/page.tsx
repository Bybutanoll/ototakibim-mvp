'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  Bell,
  MapPin,
  Car,
  Wrench,
  Calendar,
  BarChart3,
  Settings,
  User,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function MobileAppPage() {
  const [activeFeature, setActiveFeature] = useState('dashboard');

  const features = [
    {
      id: 'dashboard',
      title: 'Ana Dashboard',
      description: 'Araç sağlığı, yakıt durumu ve bakım bilgileri tek ekranda',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'vehicles',
      title: 'Araç Yönetimi',
      description: 'Tüm araçlarınızı tek yerden takip edin ve yönetin',
      icon: Car,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'appointments',
      title: 'Randevu Sistemi',
      description: 'Servis randevularını kolayca planlayın ve takip edin',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'ai-assistant',
      title: 'AI Asistan',
      description: 'Yapay zeka destekli araç tanı ve öneriler',
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'notifications',
      title: 'Akıllı Bildirimler',
      description: 'Önemli hatırlatıcılar ve uyarılar',
      icon: Bell,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'profile',
      title: 'Profil Yönetimi',
      description: 'Kişisel bilgiler ve ayarlar',
      icon: User,
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const appStats = [
    { label: '4.8/5', value: 'App Store Puanı', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { label: '10K+', value: 'İndirme', icon: Download, color: 'from-green-500 to-emerald-500' },
    { label: '98%', value: 'Müşteri Memnuniyeti', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: '24/7', value: 'Destek', icon: Shield, color: 'from-purple-500 to-pink-500' }
  ];

  const screenshots = {
    dashboard: '/mockups/mobile-dashboard.png',
    vehicles: '/mockups/mobile-vehicles.png',
    appointments: '/mockups/mobile-appointments.png',
    ai: '/mockups/mobile-ai.png',
    notifications: '/mockups/mobile-notifications.png',
    profile: '/mockups/mobile-profile.png'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Mobil Uygulama</h1>
                <p className="text-xs text-gray-500">iOS & Android</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Ana Sayfa
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Fiyatlandırma
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Mobil Uygulama
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            OtoTakibim'in güçlü özelliklerini artık cebinizde taşıyın. 
            Araç sağlığınızı her yerden takip edin, AI asistanınızla konuşun.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
              <span>App Store'dan İndir</span>
              <Download className="h-5 w-5" />
            </button>
            <button className="bg-black text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
              <span>Google Play'den İndir</span>
              <Download className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* App Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {appStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Features */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Uygulama Özellikleri
              </h2>
              <p className="text-gray-600 mb-8">
                OtoTakibim mobil uygulaması ile araç yönetiminizi kolaylaştırın
              </p>
            </motion.div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    activeFeature === feature.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Mobile Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="sticky top-8"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative mx-auto w-80 h-[600px] bg-black rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-6 text-white text-xs">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">OtoTakibim</h3>
                          <p className="text-blue-200 text-xs">Dashboard</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    {/* Content based on active feature */}
                    <div className="space-y-4">
                      {activeFeature === 'dashboard' && (
                        <>
                          <div className="bg-white/20 rounded-xl p-4">
                            <div className="text-white text-sm mb-2">Toplam Araç</div>
                            <div className="text-2xl font-bold text-white">3</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/20 rounded-xl p-3">
                              <div className="text-white text-xs mb-1">Sağlık</div>
                              <div className="text-lg font-bold text-white">%92</div>
                            </div>
                            <div className="bg-white/20 rounded-xl p-3">
                              <div className="text-white text-xs mb-1">Yakıt</div>
                              <div className="text-lg font-bold text-white">%65</div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {activeFeature === 'vehicles' && (
                        <div className="space-y-3">
                          <div className="bg-white/20 rounded-xl p-3">
                            <div className="text-white font-semibold text-sm">BMW 320i</div>
                            <div className="text-blue-200 text-xs">Sağlık: %95</div>
                          </div>
                          <div className="bg-white/20 rounded-xl p-3">
                            <div className="text-white font-semibold text-sm">Mercedes C200</div>
                            <div className="text-blue-200 text-xs">Sağlık: %87</div>
                          </div>
                        </div>
                      )}
                      
                      {activeFeature === 'ai-assistant' && (
                        <div className="bg-white/20 rounded-xl p-4">
                          <div className="text-white text-sm mb-2">AI Asistan</div>
                          <div className="text-blue-200 text-xs">"Araç sağlığınız mükemmel! Önerilen bakım: 2 hafta sonra"</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs text-gray-600">4.8/5</div>
                  <div className="text-xs text-gray-500">App Store</div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs text-gray-600">10K+</div>
                  <div className="text-xs text-gray-500">İndirme</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">
              Hemen İndirin ve Başlayın!
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              OtoTakibim mobil uygulamasını indirin ve araç yönetiminizi 
              her yerden kolayca yapın. AI destekli özellikler ve gerçek zamanlı 
              bildirimler ile araç sağlığınızı takip edin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
                <span>App Store'dan İndir</span>
                <Download className="h-5 w-5" />
              </button>
              <button className="bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
                <span>Google Play'den İndir</span>
                <Download className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-8">
              <div className="w-32 h-32 bg-white/10 rounded-2xl mx-auto flex items-center justify-center">
                <QrCode className="h-16 w-16 text-white" />
              </div>
              <p className="text-gray-400 text-sm mt-2">QR Kodu ile hızlı erişim</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
