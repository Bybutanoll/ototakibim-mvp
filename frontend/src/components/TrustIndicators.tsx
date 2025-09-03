'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award, Clock, CheckCircle, Star, TrendingUp, Zap } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    title: "ISO 27001 Sertifikalı",
    description: "Güvenlik standartlarına uygun altyapı",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30"
  },
  {
    icon: Users,
    title: "15,000+ Mutlu Müşteri",
    description: "Türkiye genelinde güvenilir hizmet",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-600/20 to-cyan-600/20",
    borderColor: "border-blue-500/30"
  },
  {
    icon: Award,
    title: "98% Müşteri Memnuniyeti",
    description: "Sürekli iyileştirme odaklı yaklaşım",
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-600/20 to-orange-600/20",
    borderColor: "border-yellow-500/30"
  },
  {
    icon: Clock,
    title: "7/24 Teknik Destek",
    description: "Her zaman yanınızdayız",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-600/20 to-pink-600/20",
    borderColor: "border-purple-500/30"
  },
  {
    icon: CheckCircle,
    title: "GDPR & KVKK Uyumlu",
    description: "Veri güvenliği önceliğimiz",
    color: "from-indigo-500 to-blue-500",
    bgColor: "from-indigo-600/20 to-blue-600/20",
    borderColor: "border-indigo-500/30"
  },
  {
    icon: TrendingUp,
    title: "40% Maliyet Tasarrufu",
    description: "Kanıtlanmış sonuçlar",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-600/20 to-teal-600/20",
    borderColor: "border-emerald-500/30"
  }
];

const certifications = [
  { name: "ISO 27001", description: "Bilgi Güvenliği Yönetimi" },
  { name: "GDPR", description: "Veri Koruma Uyumluluğu" },
  { name: "KVKK", description: "Kişisel Veri Koruma" },
  { name: "TSE", description: "Türk Standartları Enstitüsü" }
];

export default function TrustIndicators() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl lg:text-5xl font-black text-white mb-6"
        >
          Neden{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Güveniyorlar
          </span>
          ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Sertifikalar, müşteri memnuniyeti ve kanıtlanmış sonuçlarla güveninizi kazanıyoruz
        </motion.p>
      </motion.div>

      {/* Trust Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {trustItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="group"
          >
            <div className={`relative p-6 rounded-2xl border ${item.borderColor} ${item.bgColor} backdrop-blur-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="h-8 w-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Sertifikalar ve Uyumluluklar</h3>
          <p className="text-gray-300">Uluslararası standartlara uygun güvenlik ve kalite</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{cert.name}</h4>
                <p className="text-gray-300 text-sm">{cert.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social Proof Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            "Mükemmel Hizmet Kalitesi"
          </h3>
          <p className="text-gray-300 mb-4">
            Kullanıcılarımızın %98'i OtoTakibim'i arkadaşlarına öneriyor
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <span>Google Play: 4.8/5</span>
            <span>App Store: 4.9/5</span>
            <span>Web: 4.9/5</span>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center mt-16"
      >
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl px-8 py-4">
          <Zap className="h-6 w-6 text-blue-400" />
          <span className="text-blue-300 font-semibold">
            Güvenli ve güvenilir hizmet için hemen başlayın!
          </span>
        </div>
      </motion.div>
    </div>
  );
}
