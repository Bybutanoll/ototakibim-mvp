'use client';

import React, { useState, useEffect } from 'react';
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
  Smartphone, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  Play,
  Brain,
  BarChart3,
  DollarSign,
  Target,
  Sparkles,
  Rocket,
  Heart,
  ThumbsUp,
  Eye,
  Lock,
  RefreshCw,
  ChevronRight,
  ArrowDown
} from 'lucide-react';
import Link from 'next/link';
import { LogoLogin } from '@/components/ui/Logo';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <LogoLogin size="sm" />
              <span className="text-xl font-bold text-gray-900">OtoTakibim</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Özellikler</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">Nasıl Çalışır</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Fiyatlandırma</a>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Giriş Yap</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Destekli Araç Yönetimi
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Araç Bakımınızı
                <span className="text-blue-600 block">Akıllıca Yönetin</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Türkiye'nin ilk yapay zeka destekli araç sağlık asistanı. 
                Bakım maliyetlerinizi %40 azaltın, sorunları önceden tespit edin.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Ücretsiz Başla</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Play className="w-5 h-5" />
                <span>Demo İzle</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">%40</div>
                <div className="text-gray-600">Bakım Maliyeti Azalması</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">AI Destek</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden OtoTakibim?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Araç bakımınızı devrim niteliğinde özelliklerle yönetin
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Brain,
                title: "AI Destekli Teşhis",
                description: "Yapay zeka ile araç sorunlarını önceden tespit edin ve önleyici bakım planlayın."
              },
              {
                icon: BarChart3,
                title: "Detaylı Analiz",
                description: "Araç performansınızı takip edin, maliyet analizleri yapın ve optimize edin."
              },
              {
                icon: Shield,
                title: "Güvenli & Güvenilir",
                description: "Verileriniz 256-bit SSL şifreleme ile korunur, %99.9 uptime garantisi."
              },
              {
                icon: Smartphone,
                title: "Mobil Uygulama",
                description: "iOS ve Android uygulamaları ile her yerden araç durumunuzu kontrol edin."
              },
              {
                icon: Clock,
                title: "7/24 Destek",
                description: "Uzman ekibimiz her zaman yanınızda, anında yardım alın."
              },
              {
                icon: DollarSign,
                title: "Maliyet Tasarrufu",
                description: "Akıllı bakım planlaması ile yılda binlerce lira tasarruf edin."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              3 basit adımda araç bakımınızı profesyonel seviyeye çıkarın
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Araç Bilgilerini Girin",
                description: "Araç marka, model, yıl ve mevcut durumu hakkında bilgileri girin.",
                icon: Car
              },
              {
                step: "02",
                title: "AI Analiz Başlasın",
                description: "Yapay zeka araç durumunuzu analiz eder ve bakım planı oluşturur.",
                icon: Brain
              },
              {
                step: "03",
                title: "Takip ve Yönetim",
                description: "Bakım takvimini takip edin, maliyetleri yönetin ve tasarruf edin.",
                icon: TrendingUp
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Hemen Başlayın, Farkı Hissedin
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Binlerce müşteri gibi siz de araç bakım maliyetlerinizi azaltın ve güvenle sürün.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/register" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Ücretsiz Hesap Oluştur</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login" 
                className="text-white border-2 border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Giriş Yap
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <LogoLogin size="sm" />
                <span className="text-xl font-bold">OtoTakibim</span>
              </div>
              <p className="text-gray-400">
                AI destekli araç bakım yönetimi ile geleceğe güvenle sürün.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Özellikler</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Durum</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@ototakibim.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+90 212 555 0123</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OtoTakibim. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}