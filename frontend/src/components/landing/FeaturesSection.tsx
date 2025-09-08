"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Eye, Shield, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Gelir Artışı',
    description: 'Randevu yönetimi ve iş emri takibi ile müşteri memnuniyetini artırın, gelirinizi yükseltin.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    icon: Clock,
    title: 'Zaman Tasarrufu',
    description: 'Otomatik randevu hatırlatmaları, iş emri şablonları ve e-Fatura entegrasyonu ile zaman kazanın.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: Eye,
    title: 'Şeffaflık',
    description: 'Müşterileriniz iş emirlerini takip edebilir, faturaları görüntüleyebilir ve ödeme yapabilir.',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    icon: Shield,
    title: 'Güvenlik',
    description: 'KVKK uyumlu veri koruma ve güvenli ödeme sistemleri ile verileriniz korunur.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  {
    icon: Zap,
    title: 'Hızlı Kurulum',
    description: '5 dakikada kurulum, hemen kullanmaya başlayın. Teknik bilgi gerektirmez.',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600'
  },
  {
    icon: Users,
    title: 'Müşteri Memnuniyeti',
    description: 'Müşterilerinizle daha iyi iletişim kurun, hizmet kalitenizi artırın.',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Neden{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              OtoTakibim?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Servis yönetiminde ihtiyacınız olan her şey tek platformda. 
            Modern teknoloji ile geleneksel hizmet kalitesini birleştiriyoruz.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Gradient Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Hemen Başlamaya Hazır mısınız?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Binlerce servis sahibi OtoTakibim ile işlerini büyütüyor. 
              Siz de aramıza katılın ve farkı yaşayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                Ücretsiz Deneyin
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                Demo Talep Et
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}