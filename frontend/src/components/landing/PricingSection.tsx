"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '₺0',
    period: '/ay',
    description: 'Küçük servisler için ideal',
    icon: Zap,
    color: 'from-gray-600 to-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    features: [
      '3 Araç Takibi',
      'Temel İş Emirleri',
      'Email Desteği',
      'Temel Raporlar',
      'Mobil Uygulama'
    ],
    cta: 'Ücretsiz Başla',
    ctaStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
    popular: false
  },
  {
    name: 'Growth',
    price: '₺99',
    period: '/ay',
    description: 'Büyüyen servisler için',
    icon: Star,
    color: 'from-blue-600 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      '10 Araç Takibi',
      'AI Destekli Analiz',
      'Gelişmiş Raporlar',
      'e-Fatura Entegrasyonu',
      'Öncelikli Destek',
      'API Erişimi',
      'Özel Entegrasyonlar'
    ],
    cta: '14 Gün Ücretsiz',
    ctaStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '₺299',
    period: '/ay',
    description: 'Büyük servisler için',
    icon: Crown,
    color: 'from-purple-600 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      'Sınırsız Araç',
      'Özel AI Modelleri',
      'Özel Raporlar',
      '7/24 Telefon Desteği',
      'Özel Eğitim',
      'SLA Garantisi',
      'Özel Geliştirmeler',
      'Dedicated Account Manager'
    ],
    cta: 'İletişime Geç',
    ctaStyle: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white',
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
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
            Basit ve{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Şeffaf
            </span>{' '}
            Fiyatlandırma
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İhtiyacınıza uygun planı seçin ve hemen başlayın. 
            Hiçbir gizli ücret yok, istediğiniz zaman iptal edebilirsiniz.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${plan.popular ? 'md:-mt-8' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      En Popüler
                    </div>
                  </div>
                )}

                <div className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 ${plan.borderColor} h-full ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${plan.ctaStyle}`}>
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tüm Planlar İçin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>14 gün ücretsiz deneme</span>
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>İstediğiniz zaman iptal</span>
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>7/24 teknik destek</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}