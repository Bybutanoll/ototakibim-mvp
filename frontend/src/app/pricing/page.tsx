'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { Check, Star, Zap, Shield, Users, BarChart3, ArrowRight, CreditCard, Building, User } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const { state: authState } = useAuth();
  const { createSubscription, state: paymentState } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Küçük işletmeler için temel özellikler',
      price: billingCycle === 'monthly' ? 99 : 990,
      originalPrice: billingCycle === 'monthly' ? 129 : 1290,
      features: [
        '5 araç takibi',
        'Temel raporlama',
        'Email bildirimleri',
        'Mobil uygulama',
        '7/24 destek',
        'Temel AI asistan'
      ],
      icon: User,
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Büyüyen işletmeler için gelişmiş özellikler',
      price: billingCycle === 'monthly' ? 199 : 1990,
      originalPrice: billingCycle === 'monthly' ? 249 : 2490,
      features: [
        '25 araç takibi',
        'Gelişmiş raporlama',
        'SMS + Email bildirimleri',
        'Mobil uygulama',
        '7/24 öncelikli destek',
        'AI asistan + tahminler',
        'API erişimi',
        'Özel entegrasyonlar'
      ],
      icon: Building,
      popular: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Büyük işletmeler için kurumsal çözümler',
      price: billingCycle === 'monthly' ? 399 : 3990,
      originalPrice: billingCycle === 'monthly' ? 499 : 4990,
      features: [
        'Sınırsız araç takibi',
        'Özel raporlama',
        'Tüm bildirim kanalları',
        'Mobil uygulama',
        '7/24 VIP destek',
        'AI asistan + ML',
        'Tam API erişimi',
        'Özel entegrasyonlar',
        'White-label çözümler',
        'Özel eğitimler'
      ],
      icon: Users,
      popular: false,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (planId: string) => {
    if (!authState.isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setIsProcessing(true);
    try {
      await createSubscription(planId, 'demo-payment-method-id');
      alert('Abonelik başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Abonelik oluşturulurken hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Fiyatlandırma Planları
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              İşletmenizin ihtiyaçlarına uygun planı seçin ve araç bakım yönetiminde 
              verimliliği artırın
            </motion.p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Aylık
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yıllık
                <span className="ml-1 text-xs text-green-600 font-medium">
                  %20 İndirim
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'border-purple-500 scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Star className="w-4 h-4 inline mr-2" />
                    En Popüler
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                    <plan.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">₺{plan.price}</span>
                    <span className="text-gray-500 ml-2">
                      /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                    </span>
                  </div>
                  {plan.originalPrice > plan.price && (
                    <div className="flex items-center justify-center">
                      <span className="text-lg text-gray-400 line-through mr-2">
                        ₺{plan.originalPrice}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        %{Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)} tasarruf
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? 'İşleniyor...' : 'Planı Seç'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sık Sorulan Sorular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Plan değişikliği yapabilir miyim?",
                answer: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler bir sonraki fatura döneminde geçerli olur."
              },
              {
                question: "Ücretsiz deneme süresi var mı?",
                answer: "Tüm planlarımızda 14 gün ücretsiz deneme süresi bulunmaktadır. Herhangi bir kredi kartı bilgisi gerektirmez."
              },
              {
                question: "İptal edebilir miyim?",
                answer: "Evet, istediğiniz zaman aboneliğinizi iptal edebilirsiniz. İptal işlemi sonrasında dönem sonuna kadar hizmet almaya devam edersiniz."
              },
              {
                question: "Teknik destek ücretsiz mi?",
                answer: "Tüm planlarda 7/24 teknik destek ücretsizdir. Professional ve Enterprise planlarda öncelikli destek hizmeti sunulur."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100 transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="rounded-2xl">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-3xl font-bold mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  Hemen Başlayın
                </motion.h2>
                <motion.p 
                  className="text-xl mb-6 opacity-90"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  14 gün ücretsiz deneme ile OtoTakibim'in tüm özelliklerini keşfedin
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/register"
                      className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
                    >
                      Ücretsiz Başla
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/contact"
                      className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
                    >
                      Demo İste
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
