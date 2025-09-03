'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Brain, Bell, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: "Verileri Girin",
    description: "Aracınızın kilometre, son bakım tarihi ve diğer bilgilerini kolayca girin.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-600/20 to-cyan-600/20",
    borderColor: "border-blue-500/30"
  },
  {
    icon: Brain,
    title: "AI Analiz Etsin",
    description: "Yapay zeka algoritmalarımız verilerinizi analiz ederek bakım önerileri sunar.",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-600/20 to-pink-600/20",
    borderColor: "border-purple-500/30"
  },
  {
    icon: Bell,
    title: "Hatırlatmaları Alın",
    description: "Bakım zamanları yaklaştığında otomatik hatırlatmalar ve öneriler alın.",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30"
  }
];

export default function HowItWorks() {
  return (
    <div className="w-full max-w-6xl mx-auto">
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
          Nasıl{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Çalışır
          </span>
          ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Sadece 3 basit adımda araç sağlığınızı AI ile takip etmeye başlayın
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 * index }}
            className="relative group"
          >
            {/* Step Number */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold text-lg z-10">
              {index + 1}
            </div>

            {/* Step Card */}
            <div className={`relative p-8 rounded-3xl border ${step.borderColor} ${step.bgColor} backdrop-blur-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className="h-10 w-10 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full border border-white/20 flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-16"
      >
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl px-8 py-4">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <span className="text-green-300 font-semibold">
            Sadece 2 dakikada kurulum tamamlanır!
          </span>
        </div>
      </motion.div>
    </div>
  );
}
