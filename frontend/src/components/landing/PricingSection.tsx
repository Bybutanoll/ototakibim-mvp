import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Badge } from '../atoms';
import { Card } from '../atoms';
import { Check, X, Star, Zap, Crown } from 'lucide-react';

export interface PricingSectionProps {
  className?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ className = '' }) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Küçük işletmeler için temel özellikler',
      monthlyPrice: 99,
      yearlyPrice: 990,
      icon: Zap,
      color: 'blue',
      popular: false,
      features: [
        'Temel dashboard',
        'Araç yönetimi',
        'Basit raporlar',
        'Email bildirimleri',
        'Mobil uygulama erişimi',
        '50 iş emri/ay',
        '2 kullanıcı',
        '1GB depolama',
        '1000 API çağrısı/ay'
      ],
      limitations: [
        'AI özellikleri yok',
        'Gelişmiş raporlar yok',
        'SMS bildirimleri yok',
        'Entegrasyonlar yok'
      ]
    },
    {
      name: 'Professional',
      description: 'Büyüyen işletmeler için gelişmiş özellikler',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      icon: Star,
      color: 'purple',
      popular: true,
      features: [
        'Tüm Starter özellikleri',
        'AI destekli tanı',
        'Gelişmiş raporlar',
        'SMS bildirimleri',
        'Entegrasyonlar',
        'Öncelikli destek',
        'Toplu veri aktarımı',
        '500 iş emri/ay',
        '10 kullanıcı',
        '5GB depolama',
        '10,000 API çağrısı/ay'
      ],
      limitations: [
        'API erişimi sınırlı',
        'White-label yok',
        'Özel markalama yok'
      ]
    },
    {
      name: 'Enterprise',
      description: 'Büyük işletmeler için sınırsız özellikler',
      monthlyPrice: 799,
      yearlyPrice: 7990,
      icon: Crown,
      color: 'gold',
      popular: false,
      features: [
        'Tüm Professional özellikleri',
        'Sınırsız kullanım',
        'API erişimi',
        'White-label çözüm',
        'Özel markalama',
        'Gelişmiş analitik',
        'Yedekleme ve geri yükleme',
        '7/24 öncelikli destek',
        'Sınırsız iş emri',
        'Sınırsız kullanıcı',
        'Sınırsız depolama',
        'Sınırsız API çağrısı'
      ],
      limitations: []
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      gold: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getBorderColor = (color: string, popular: boolean) => {
    if (popular) {
      return 'border-purple-500 ring-2 ring-purple-200';
    }
    const colors = {
      blue: 'border-blue-200',
      purple: 'border-purple-200',
      gold: 'border-yellow-200'
    };
    return colors[color as keyof typeof colors] || 'border-gray-200';
  };

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Basit ve Şeffaf Fiyatlandırma
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            İhtiyacınıza uygun planı seçin. İstediğiniz zaman değiştirebilir veya iptal edebilirsiniz.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-4 mb-8"
          >
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Aylık
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yıllık
            </span>
            {billingPeriod === 'yearly' && (
              <Badge text="%17 İndirim" color="success" />
            )}
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative ${plan.popular ? 'md:-mt-8' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge text="En Popüler" color="success" />
                </div>
              )}

              <Card
                className={`h-full ${getBorderColor(plan.color, plan.popular)} ${
                  plan.popular ? 'shadow-xl' : 'shadow-lg'
                }`}
              >
                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-lg ${getColorClasses(plan.color)} mb-4`}>
                    <plan.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ₺{billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /{billingPeriod === 'monthly' ? 'ay' : 'yıl'}
                    </span>
                  </div>

                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    size="lg"
                    className="w-full mb-6"
                  >
                    {plan.name === 'Enterprise' ? 'İletişime Geçin' : 'Başlayın'}
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Dahil Olanlar:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 mb-4 mt-6">Dahil Olmayanlar:</h4>
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start">
                          <X className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan Sorular
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Plan değiştirebilir miyim?
              </h4>
              <p className="text-gray-600 text-sm">
                Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. 
                Değişiklikler anında geçerli olur.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Ücretsiz deneme var mı?
              </h4>
              <p className="text-gray-600 text-sm">
                Tüm planlar için 14 gün ücretsiz deneme sunuyoruz. 
                Kredi kartı bilgisi gerektirmez.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                İptal edebilir miyim?
              </h4>
              <p className="text-gray-600 text-sm">
                Evet, istediğiniz zaman iptal edebilirsiniz. 
                Verileriniz 30 gün boyunca saklanır.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Destek alabilir miyim?
              </h4>
              <p className="text-gray-600 text-sm">
                Tüm planlar email desteği içerir. 
                Professional ve Enterprise planlar öncelikli destek alır.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
