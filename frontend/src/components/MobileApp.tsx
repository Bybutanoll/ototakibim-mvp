'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Bell, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Camera, 
  Mic, 
  Zap,
  Shield,
  Download,
  Play,
  Star,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  Battery,
  Signal,
  Settings,
  Home,
  Car,
  Calendar,
  User,
  BarChart3,
  QrCode,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react';

interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface AppScreen {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

export default function MobileApp() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);

  const appFeatures: AppFeature[] = [
    {
      id: 'offline',
      title: 'Çevrimdışı Çalışma',
      description: 'İnternet olmadan da araç bilgilerinizi görüntüleyin',
      icon: <WifiOff className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'notifications',
      title: 'Push Bildirimleri',
      description: 'Bakım hatırlatmaları ve önemli uyarılar',
      icon: <Bell className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'location',
      title: 'Konum Servisleri',
      description: 'En yakın servisleri bulun ve yönlendirme alın',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'camera',
      title: 'Fotoğraf Analizi',
      description: 'Araç fotoğrafları ile AI destekli arıza tespiti',
      icon: <Camera className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'voice',
      title: 'Sesli Asistan',
      description: 'Sesli komutlarla AI asistanınızla konuşun',
      icon: <Mic className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'qr',
      title: 'QR Kod Tarama',
      description: 'Servis kartları ve parça bilgilerini hızlıca tarayın',
      icon: <QrCode className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const appScreens: AppScreen[] = [
    {
      id: 'dashboard',
      title: 'Ana Dashboard',
      description: 'Araç sağlığı, bakım durumu ve AI önerileri',
      features: ['AI Sağlık Skoru', 'Bakım Hatırlatmaları', 'Hızlı İşlemler', 'Son Aktiviteler'],
      image: '/api/placeholder/300/600'
    },
    {
      id: 'vehicles',
      title: 'Araç Yönetimi',
      description: 'Tüm araçlarınızı tek yerden yönetin',
      features: ['Araç Listesi', 'Detaylı Bilgiler', 'Fotoğraf Galerisi', 'Servis Geçmişi'],
      image: '/api/placeholder/300/600'
    },
    {
      id: 'appointments',
      title: 'Randevu Sistemi',
      description: 'Servis randevularını kolayca planlayın',
      features: ['Takvim Görünümü', 'Servis Seçimi', 'Hatırlatmalar', 'Durum Takibi'],
      image: '/api/placeholder/300/600'
    },
    {
      id: 'ai-chat',
      title: 'AI Asistan',
      description: '7/24 AI destekli araç sağlık asistanı',
      features: ['Sesli Sohbet', 'Fotoğraf Analizi', 'Hızlı Öneriler', 'Arıza Tespiti'],
      image: '/api/placeholder/300/600'
    }
  ];

  const stats = {
    downloads: 15420,
    rating: 4.8,
    reviews: 2847,
    activeUsers: 12340,
    dailyActive: 8920,
    retention: 94.2
  };

  const handleDownload = (platform: 'ios' | 'android') => {
    console.log(`Downloading for ${platform}`);
    // App store redirect logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle-container">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">OtoTakibim Mobile</h1>
                  <p className="text-sm text-blue-200">Mobil Uygulama ve Özellikler</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cebinizdeki AI Asistan 📱
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              OtoTakibim mobil uygulaması ile aracınızın sağlığını 7/24 takip edin, 
              AI destekli öneriler alın ve bakım işlemlerinizi kolayca yönetin.
            </p>

            {/* App Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.downloads.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">İndirme</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.rating}</div>
                <div className="text-blue-200 text-sm flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  Puan
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">Aktif Kullanıcı</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.retention}%</div>
                <div className="text-blue-200 text-sm">Tutma Oranı</div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => handleDownload('ios')}
                className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">A</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </button>
              
              <button
                onClick={() => handleDownload('android')}
                className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">G</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Mobile App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
              {/* Phone Mockup */}
              <div className="relative">
                <div className="w-80 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 rounded-[2.5rem] p-4 relative overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-white text-sm mb-4">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <Signal className="w-4 h-4" />
                        <Wifi className="w-4 h-4" />
                        <Battery className="w-6 h-4" />
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="bg-white rounded-2xl h-full p-4">
                      {/* Navigation */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <Car className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">OtoTakibim</h3>
                            <p className="text-xs text-gray-500">AI Asistan</p>
                          </div>
                        </div>
                        <Bell className="w-5 h-5 text-gray-600" />
                      </div>

                      {/* AI Health Score */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">AI Sağlık Skoru</span>
                          <span className="text-lg font-bold text-blue-600">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <Car className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <span className="text-xs text-gray-700">Araçlarım</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <Calendar className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <span className="text-xs text-gray-700">Randevular</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                          <span className="text-xs text-gray-700">AI Chat</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                          <span className="text-xs text-gray-700">Raporlar</span>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Son Aktiviteler</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">Yağ değişimi tamamlandı</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">AI analiz güncellendi</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white rounded-xl p-2 shadow-lg">
                          <div className="flex justify-around">
                            <Home className="w-5 h-5 text-blue-600" />
                            <Car className="w-5 h-5 text-gray-400" />
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Features */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Mobil Özellikler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appFeatures.map((feature) => (
                    <motion.div
                      key={feature.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-blue-500/30 transition-all duration-300"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-blue-200 text-sm">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* App Screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Uygulama Ekranları
            </h2>
            
            {/* Screen Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                {appScreens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreen(screen.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeScreen === screen.id
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    {screen.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {appScreens.find(s => s.id === activeScreen)?.title}
                </h3>
                <p className="text-blue-200 mb-6">
                  {appScreens.find(s => s.id === activeScreen)?.description}
                </p>
                <ul className="space-y-3">
                  {appScreens.find(s => s.id === activeScreen)?.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-blue-200">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-center">
                <div className="w-64 h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 rounded-[1.5rem] p-4">
                    <div className="bg-white rounded-xl h-full p-4">
                      <div className="text-center text-gray-600">
                        <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm">{appScreens.find(s => s.id === activeScreen)?.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Teknik Özellikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Hızlı Performans</h3>
                <p className="text-blue-200">
                  React Native ile geliştirilen uygulama, native performans sunar ve 
                  hızlı yükleme süreleri ile kullanıcı deneyimini optimize eder.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Güvenlik</h3>
                <p className="text-blue-200">
                  End-to-end şifreleme, biyometrik kimlik doğrulama ve güvenli 
                  veri depolama ile kullanıcı verileriniz korunur.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Çevrimdışı Çalışma</h3>
                <p className="text-blue-200">
                  İnternet bağlantısı olmadan da araç bilgilerinizi görüntüleyin, 
                  verileriniz yerel olarak saklanır ve senkronize edilir.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-4">
                Hemen İndirin! 🚀
              </h2>
              <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                OtoTakibim mobil uygulamasını indirin ve aracınızın sağlığını 
                cebinizden takip etmeye başlayın. AI destekli öneriler ve 
                kolay kullanım ile araç bakımınızı optimize edin.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={() => handleDownload('ios')}
                  className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>App Store'dan İndir</span>
                </button>
                <button
                  onClick={() => handleDownload('android')}
                  className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300"
                >
                  <Download className="w-5 h-5" />
                  <span>Google Play'den İndir</span>
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
