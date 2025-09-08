import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../atoms';
import { ArrowRight, CheckCircle, Shield, Clock, Users } from 'lucide-react';

export interface CTASectionProps {
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ className = '' }) => {
  const benefits = [
    {
      icon: CheckCircle,
      title: '14 Gün Ücretsiz',
      description: 'Kredi kartı gerektirmez'
    },
    {
      icon: Shield,
      title: 'Güvenli Veri',
      description: 'Endüstri standardı güvenlik'
    },
    {
      icon: Clock,
      title: '5 Dakikada Kurulum',
      description: 'Hızlı ve kolay başlangıç'
    },
    {
      icon: Users,
      title: '7/24 Destek',
      description: 'Uzman ekibimiz yanınızda'
    }
  ];

  return (
    <section className={`py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Araç Bakımınızı
            <span className="block text-yellow-300">Bugün Değiştirin</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Yapay zeka teknolojisi ile işletmenizi bir üst seviyeye taşıyın. 
            Hemen başlayın, farkı görün.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 rounded-full bg-white bg-opacity-20 text-white mb-3">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {benefit.title}
                </h3>
                <p className="text-blue-100 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ücretsiz Deneyin
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Demo İzleyin
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-blue-200 text-sm mb-4">
              Güvenilen 500+ işletme tarafından kullanılıyor
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-white text-sm font-medium">Toyota Servis</div>
              <div className="text-white text-sm font-medium">BMW Yetkili</div>
              <div className="text-white text-sm font-medium">Mercedes-Benz</div>
              <div className="text-white text-sm font-medium">Honda Servis</div>
              <div className="text-white text-sm font-medium">Volkswagen</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
