'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Car, 
  Wrench,
  Shield, 
  Users, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Zap, 
  Globe, 
  Smartphone, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Award,
  Play
} from 'lucide-react';
import Link from 'next/link';
// GlowingEffect kaldırıldı - performans için
// ElectricBorder kaldırıldı - performans için
import MaintenanceCalculator from '@/components/MaintenanceCalculator';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import BlogPreview from '@/components/BlogPreview';
import TrustIndicators from '@/components/TrustIndicators';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Hero Section - Premium Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <span>🚀 Beta Sürümü Aktif</span>
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight"
          >
            <span className="block">AI Destekli</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Araç Sağlık
            </span>
            <span className="block">Asistanı</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Araç bakımınızı yapay zeka ile takip edin. Sorunları önceden tespit edin, 
            maliyetleri düşürün ve güvenli sürüş deneyimi yaşayın.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link href="/register" className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-3 overflow-hidden">
                <span className="relative z-10">Hemen Başla</span>
                <ArrowRight className="h-7 w-7 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link href="/login" className="relative bg-white/10 backdrop-blur-lg text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/25 border border-white/20 flex items-center justify-center space-x-3">
                <span className="relative z-10">Giriş Yap</span>
                <ArrowRight className="h-7 w-7 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                className="group bg-white/10 backdrop-blur-lg text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/25 border border-white/20 flex items-center justify-center space-x-3"
              >
                <Play className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                <span>Demo İzle</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: "15K+", label: "Mutlu Müşteri", color: "from-blue-400 to-cyan-400" },
              { number: "98%", label: "Memnuniyet Oranı", color: "from-purple-400 to-pink-400" },
              { number: "40%", label: "Maliyet Tasarrufu", color: "from-green-400 to-emerald-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                className="text-center group"
              >
                <motion.div 
                  className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Mini Bakım Hesaplayıcı Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaintenanceCalculator />
        </div>
      </section>

      {/* Features Section - Premium Redesign */}
      <section id="features" className="py-20 lg:py-32 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-black text-white mb-8"
            >
              Gelişmiş{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Özellikler
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Yapay zeka teknolojisi ile desteklenen özelliklerimiz araç sağlığınızı korur
            </motion.p>
          </motion.div>

          {/* Premium Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Car,
                title: "Akıllı Araç Takibi",
                description: "AI destekli gerçek zamanlı araç durumu takibi",
                features: ["Kilometre takibi", "Yakıt analizi", "Performans ölçümü"],
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-900/20 to-cyan-900/20",
                borderColor: "border-blue-200"
              },
              {
                icon: Wrench,
                title: "Proaktif Bakım",
                description: "Sorunları oluşmadan önce tespit edin",
                features: ["Öngörülü analiz", "Otomatik uyarılar", "Bakım planlaması"],
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-900/20 to-emerald-900/20",
                borderColor: "border-green-200"
              },
              {
                icon: Shield,
                title: "Güvenlik Sistemi",
                description: "Kapsamlı güvenlik ve koruma çözümleri",
                features: ["Hırsızlık koruması", "Acil durum", "Güvenlik analizi"],
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-900/20 to-pink-900/20",
                borderColor: "border-purple-200"
              },
              {
                icon: Zap,
                title: "AI Analizi",
                description: "Gelişmiş yapay zeka ile detaylı analiz",
                features: ["Performans analizi", "Trend analizi", "Öngörü modelleri"],
                color: "from-yellow-500 to-orange-500",
                bgColor: "from-yellow-900/20 to-orange-900/20",
                borderColor: "border-yellow-200"
              },
              {
                icon: Users,
                title: "Filo Yönetimi",
                description: "Çoklu araç yönetimi ve koordinasyonu",
                features: ["Merkezi kontrol", "Raporlama", "Maliyet optimizasyonu"],
                color: "from-indigo-500 to-blue-500",
                bgColor: "from-indigo-900/20 to-blue-900/20",
                borderColor: "border-indigo-200"
              },
              {
                icon: Globe,
                title: "Bulut Teknolojisi",
                description: "Her yerden erişilebilir bulut altyapısı",
                features: ["7/24 erişim", "Otomatik yedekleme", "Çoklu platform"],
                color: "from-teal-500 to-cyan-500",
                bgColor: "from-teal-900/20 to-cyan-900/20",
                borderColor: "border-teal-200"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div 
                  className={`relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 hover:scale-105 border ${feature.borderColor} shadow-2xl hover:shadow-3xl`}
                  whileHover={{ 
                    y: -8,
                    rotateY: 3,
                    rotateX: 2
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-15 rounded-3xl blur-sm transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-4 text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-300 text-center mb-6 leading-relaxed"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.description}
                    </motion.p>
                    
                    <ul className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <motion.li 
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 + itemIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-3 text-gray-300"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          </motion.div>
                          <span className="text-sm">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.div
                    className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section - Premium Animated Counters */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-black text-white mb-8"
            >
              Rakamlarla{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                OtoTakibim
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Başarılarımızı sayılarla gösteriyoruz. Her rakam bir başarı hikayesi.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { 
                number: "15K+", 
                label: "Mutlu Müşteri", 
                icon: Users, 
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-500/20 to-cyan-500/20",
                borderColor: "border-blue-400/30"
              },
              { 
                number: "98%", 
                label: "Memnuniyet Oranı", 
                icon: Star, 
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-500/20 to-emerald-500/20",
                borderColor: "border-green-400/30"
              },
              { 
                number: "40%", 
                label: "Maliyet Tasarrufu", 
                icon: TrendingUp, 
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-500/20 to-pink-500/20",
                borderColor: "border-purple-400/30"
              },
              { 
                number: "24/7", 
                label: "Destek Hizmeti", 
                icon: Clock, 
                color: "from-orange-500 to-red-500",
                bgColor: "from-orange-500/20 to-red-500/20",
                borderColor: "border-orange-400/30"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group relative"
              >
                <motion.div 
                  className={`relative bg-gradient-to-br ${stat.bgColor} backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 hover:scale-105 border ${stat.borderColor} shadow-2xl hover:shadow-3xl`}
                  whileHover={{ 
                    y: -8,
                    rotateY: 3,
                    rotateX: 2
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-15 rounded-3xl blur-sm transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    <motion.div 
                      className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-gray-300 text-lg font-semibold">{stat.label}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Başlangıç Aşaması",
                description: "2024 Yılında Kuruldu",
                icon: Award,
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "Müşteri Memnuniyeti",
                description: "Beta Test Sürecinde",
                icon: Star,
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "İnovasyon Odaklı",
                description: "Sürekli Gelişim",
                icon: Zap,
                color: "from-purple-500 to-pink-500"
              }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-xl flex items-center justify-center mb-4`}>
                  <achievement.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{achievement.title}</h3>
                <p className="text-gray-300 text-sm">{achievement.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 lg:py-32 bg-gradient-to-br from-slate-700 via-slate-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Araç sağlığınız için kapsamlı çözümler sunuyoruz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                {[
                  {
                    icon: Car,
                    title: "Araç Takibi",
                    description: "Araçlarınızı tek platformdan yönetin ve takip edin",
                    features: ["Gerçek zamanlı konum", "Yakıt takibi", "Kilometre takibi"]
                  },
                  {
                    icon: Wrench,
                    title: "Bakım Yönetimi",
                    description: "Bakım planlarınızı oluşturun ve takip edin",
                    features: ["Otomatik hatırlatıcılar", "Servis geçmişi", "Maliyet analizi"]
                  },
                  {
                    icon: Shield,
                    title: "Güvenlik",
                    description: "Araç güvenliğinizi maksimum seviyede tutun",
                    features: ["Hırsızlık koruması", "Kaza tespiti", "Acil durum bildirimi"]
                  }
                ].map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 shadow-2xl">
                <div className="text-center text-white mb-8">
                  <h3 className="text-2xl font-bold mb-4">Demo İsteyin</h3>
                  <p className="text-gray-300">Hemen ücretsiz demo talep edin</p>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  alert('Demo talebiniz alındı! En kısa sürede size ulaşacağız.');
                }} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Adınız"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="E-posta"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Demo Talep Et
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorks />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPreview />
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustIndicators />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              İletişim
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sorularınız için bizimle iletişime geçin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Adres</h3>
                    <p className="text-gray-300">İstanbul, Türkiye</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Telefon</h3>
                    <p className="text-gray-300">+90 (536) 841 88 14</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">E-posta</h3>
                    <p className="text-gray-300">info@ototakibim.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Mesaj Gönderin</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
                }} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Adınız"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="E-posta"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Mesajınız"
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Mesaj Gönder
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">OtoTakibim</h3>
                  <p className="text-gray-400">AI Destekli Araç Sağlık Asistanı</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Türkiye'nin ilk yapay zeka destekli araç sağlık asistanı. 
                Araç bakımınızı takip edin, sorunları önceden tespit edin.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <span className="sr-only">Facebook</span>
                  <div className="w-5 h-5 bg-blue-400 rounded"></div>
                </Link>
                <Link href="#" className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-colors duration-300">
                  <span className="sr-only">Instagram</span>
                  <div className="w-5 h-5 bg-purple-400 rounded"></div>
                </Link>
                <Link href="#" className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                  <span className="sr-only">WhatsApp</span>
                  <div className="w-5 h-5 bg-green-400 rounded"></div>
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Ana Sayfa</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Hakkımızda</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Hizmetler</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">İletişim</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Hizmetler</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Araç Takibi</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Bakım Yönetimi</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Güvenlik</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">AI Analiz</Link></li>
              </ul>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 mt-12 pt-8"
          >
            <div className="text-center mb-8">
              <h4 className="text-xl font-semibold mb-4">Güncel Kalın</h4>
              <p className="text-gray-400 mb-6">
                En son teknoloji haberleri ve OtoTakibim güncellemeleri için abone olun
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Abone Ol
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-6">Güvenilir ve Onaylı</h4>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="bg-white/10 rounded-lg px-6 py-3">
                  <span className="text-sm font-medium">ISO 27001</span>
                </div>
                <div className="bg-white/10 rounded-lg px-6 py-3">
                  <span className="text-sm font-medium">GDPR Uyumlu</span>
                </div>
                <div className="bg-white/10 rounded-lg px-6 py-3">
                  <span className="text-sm font-medium">TSE Onaylı</span>
                </div>
                <div className="bg-white/10 rounded-lg px-6 py-3">
                  <span className="text-sm font-medium">Microsoft Partner</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 OtoTakibim. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <motion.a
        href="https://wa.me/900000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
    </div>
  );
}