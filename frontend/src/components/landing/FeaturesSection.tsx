import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../atoms';
import { Icon } from '../atoms';
import { 
  Brain, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Zap, 
  Clock,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Car,
  CheckCircle
} from 'lucide-react';

export interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className = '' }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI Destekli Tanı',
      description: 'Yapay zeka ile araç sorunlarını önceden tespit edin ve bakım planınızı optimize edin.',
      color: 'blue'
    },
    {
      icon: BarChart3,
      title: 'Akıllı Raporlama',
      description: 'Detaylı analizler ve öngörülerle işletmenizi daha iyi yönetin.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Güvenli Veri',
      description: 'Endüstri standardı güvenlik ile verileriniz her zaman korunur.',
      color: 'green'
    },
    {
      icon: Smartphone,
      title: 'Mobil Uygulama',
      description: 'Her yerden erişim sağlayın. iOS ve Android uygulamalarımızla.',
      color: 'orange'
    },
    {
      icon: Zap,
      title: 'Hızlı Entegrasyon',
      description: 'Mevcut sistemlerinizle kolayca entegre olun. 5 dakikada kurulum.',
      color: 'yellow'
    },
    {
      icon: Clock,
      title: '7/24 Destek',
      description: 'Uzman ekibimiz her zaman yanınızda. Anında yardım alın.',
      color: 'red'
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Hedefli Bakım',
      description: 'Sadece gerektiğinde bakım yapın, gereksiz masraflardan kaçının.'
    },
    {
      icon: TrendingUp,
      title: 'Verimlilik Artışı',
      description: 'İş süreçlerinizi optimize edin, %30 daha verimli çalışın.'
    },
    {
      icon: Users,
      title: 'Müşteri Memnuniyeti',
      description: 'Proaktif hizmet ile müşteri memnuniyetinizi artırın.'
    },
    {
      icon: Wrench,
      title: 'Teknisyen Desteği',
      description: 'AI önerileri ile teknisyenleriniz daha etkili çalışsın.'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      green: 'bg-green-500 text-white',
      orange: 'bg-orange-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      red: 'bg-red-500 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  return (
    <section className={`py-20 bg-white ${className}`}>
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
            Neden OtoTakibim?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Yapay zeka teknolojisi ile araç bakım süreçlerinizi devrim niteliğinde değiştirin
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-lg ${getColorClasses(feature.color)} mb-4`}>
                    <Icon icon={feature.icon} size="lg" color="white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              İşletmenize Faydaları
            </h3>
            <p className="text-lg text-gray-600">
              OtoTakibim ile işletmenizi bir üst seviyeye taşıyın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="inline-flex p-3 rounded-lg bg-blue-100 text-blue-600 mb-4">
                    <Icon icon={benefit.icon} size="lg" color="primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { number: '500+', label: 'Aktif İşletme', icon: Users },
            { number: '%40', label: 'Maliyet Azalması', icon: TrendingUp },
            { number: '24/7', label: 'AI Destek', icon: Brain },
            { number: '99.9%', label: 'Uptime', icon: CheckCircle }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex p-4 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Icon icon={stat.icon} size="lg" color="primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
