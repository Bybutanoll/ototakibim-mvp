import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../atoms';
import { ArrowRight, Play, Star, Users, Award } from 'lucide-react';

export interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className={`relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Türkiye'nin İlk AI Destekli Araç Sağlık Asistanı
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
          >
            Araç Bakımınızı
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI ile Yönetin
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Yapay zeka destekli tanı, öngörülü bakım ve akıllı raporlama ile 
            araç bakım maliyetlerinizi %40 azaltın.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              variant="primary"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
            >
              Ücretsiz Deneyin
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Demo İzleyin
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Aktif İşletme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">%40</div>
              <div className="text-gray-600">Maliyet Azalması</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Destek</div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-6">Güvenilen İşletmeler</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">Toyota Servis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">BMW Yetkili</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">Mercedes-Benz</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
