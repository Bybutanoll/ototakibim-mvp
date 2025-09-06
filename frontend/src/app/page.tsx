'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import LogoAnimation from '@/components/LogoAnimation';
import AdvancedParticleSystem, { ProgressiveParticleSystem } from '@/components/AdvancedParticleSystem';
import LogoLoadingSequence from '@/components/LogoLoadingSequence';
import PremiumButton, { FAB } from '@/components/PremiumButton';
import PremiumCard, { FeatureCard, StatsCard, PricingCard } from '@/components/PremiumCard';
import { logoAnalytics } from '@/utils/analytics';
import '@/styles/brand-system.css';
import '@/styles/premium-design-system.css';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    setIsVisible(true);
    
    // Initialize analytics
    logoAnalytics.trackDeviceCapabilities();
    logoAnalytics.initPerformanceObserver();
    
    // Track page load
    logoAnalytics.trackUserEngagement('page_load');
    
    // Simulate loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
      logoAnalytics.trackLogoAnimationComplete('hero_section');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI Destekli Bakım Tahminleri",
      description: "Yapay zeka ile araç bakım zamanlarını önceden tahmin edin",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Detaylı Analitik Dashboard",
      description: "Araç maliyetlerini ve performansını takip edin",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Güvenli Veri Saklama",
      description: "KVKK uyumlu, şifreli veri saklama sistemi",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: "Mobil Uyumlu",
      description: "Her cihazdan erişim, responsive tasarım",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Zap,
      title: "Hızlı ve Kolay",
      description: "Sadece birkaç tıklama ile araç yönetimi",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Müşteri Desteği",
      description: "7/24 Türkçe müşteri desteği",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Mutlu Müşteri", icon: Users },
    { number: "50,000+", label: "Yönetilen Araç", icon: Car },
    { number: "₺2M+", label: "Tasarruf Sağlandı", icon: DollarSign },
    { number: "99.9%", label: "Uptime", icon: Shield }
  ];

  const testimonials = [
    {
      name: "Mehmet Yılmaz",
      role: "Oto Servis Sahibi",
      content: "OtoTakibim sayesinde işletmem %40 daha verimli hale geldi. AI tahminleri gerçekten işe yarıyor!",
      rating: 5,
      avatar: "👨‍🔧"
    },
    {
      name: "Ayşe Demir",
      role: "Fleet Manager",
      content: "50 aracımızı kolayca yönetiyoruz. Dashboard çok kullanışlı ve bilgilendirici.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Ali Kaya",
      role: "Araç Sahibi",
      content: "Bakım maliyetlerim %30 azaldı. Artık ne zaman servise gitmem gerektiğini biliyorum.",
      rating: 5,
      avatar: "👨‍💻"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₺299",
      period: "/ay",
      description: "Küçük işletmeler için",
      features: [
        "3 araç takibi",
        "Temel AI tahminleri",
        "Email desteği",
        "Mobil uygulama",
        "Temel raporlar"
      ],
      popular: false,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Professional",
      price: "₺599",
      period: "/ay",
      description: "Büyüyen işletmeler için",
      features: [
        "15 araç takibi",
        "Gelişmiş AI özellikleri",
        "Öncelikli destek",
        "Gelişmiş analitik",
        "API erişimi",
        "Özel entegrasyonlar"
      ],
      popular: true,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Enterprise",
      price: "₺999",
      period: "/ay",
      description: "Büyük işletmeler için",
      features: [
        "Sınırsız araç",
        "Tam AI paketi",
        "7/24 telefon desteği",
        "Özel dashboard",
        "Beyaz etiket çözüm",
        "Özel geliştirme"
      ],
      popular: false,
      color: "from-green-500 to-emerald-500"
    }
  ];

  // Show loading sequence on first visit
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <LogoLoadingSequence 
          onComplete={() => setIsLoading(false)}
          className="text-center"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Advanced Particle System */}
      <ProgressiveParticleSystem 
        particleCount={50}
        enablePhysics={true}
        enableMagnetism={true}
        enableWind={true}
        className="opacity-30"
      />
      
      {/* Hero Section - Logo Animation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Interactive Logo Animation */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <LogoAnimation 
            size="large" 
            showParticles={true}
            interactive={true}
            ariaLabel="OtoTakibim Ana Sayfa - Ana sayfaya dön"
            onClick={() => {
              logoAnalytics.trackLogoClick('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ y }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Türkiye'nin İlk AI Destekli Araç Yönetim Sistemi
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              OtoTakibim
            </span>
            <br />
            <span className="text-white/90">Geleceğin Araç Yönetimi</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Yapay zeka destekli araç bakım tahminleri, detaylı analitik ve 
            <span className="text-cyan-400 font-semibold"> %40 maliyet tasarrufu</span> ile 
            araçlarınızı profesyonelce yönetin.
          </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                >
                  <Link href="/register">
                    <PremiumButton
                      variant="primary"
                      size="lg"
                      gradient
                      glow
                      leftIcon={<Rocket className="w-5 h-5" />}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Ücretsiz Başla
                    </PremiumButton>
                  </Link>

                  <PremiumButton
                    variant="outline"
                    size="lg"
                    leftIcon={<Play className="w-5 h-5" />}
                  >
                    Demo İzle
                  </PremiumButton>
                </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 text-white/60"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>KVKK Uyumlu</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>ISO 27001</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800/50 to-blue-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StatsCard
                  title={stat.label}
                  value={stat.number}
                  variant="gradient"
                  className="text-center"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Neden <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">OtoTakibim</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Türkiye'nin en gelişmiş AI destekli araç yönetim sistemi ile 
              işletmenizi dijital dönüşüme hazırlayın.
            </p>
          </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <FeatureCard
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        gradient={index % 2 === 0}
                        className="h-full"
                      />
                    </motion.div>
                  ))}
                </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800/50 to-blue-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Uygun Fiyatlar</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              İşletmenizin büyüklüğüne uygun plan seçin. 14 gün ücretsiz deneme.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-8 rounded-2xl ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50' 
                    : 'bg-white/5 backdrop-blur-sm border border-white/10'
                } hover:border-white/20 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      En Popüler
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/70 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {plan.popular ? 'Hemen Başla' : 'Planı Seç'}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Müşterilerimiz <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ne Diyor?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Binlerce mutlu müşterimizin deneyimlerini keşfedin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hemen <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Başlayın</span>
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              14 gün ücretsiz deneme ile OtoTakibim'in gücünü keşfedin. 
              Kredi kartı gerektirmez.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-3"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Ücretsiz Deneme Başlat</span>
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-3"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Demo Talep Et</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                OtoTakibim
              </h3>
              <p className="text-white/70 mb-4">
                Türkiye'nin en gelişmiş AI destekli araç yönetim sistemi.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Özellikler</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Entegrasyonlar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Durum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Güvenlik</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2024 OtoTakibim. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <FAB
        icon={<Rocket className="w-6 h-6" />}
        aria-label="Hızlı Başla"
        onClick={() => {
          logoAnalytics.trackLogoClick('quick_start');
          window.location.href = '/register';
        }}
      />
    </div>
  );
}
