"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              AI Destekli{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Araç Sağlık
              </span>{' '}
              Asistanı
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Araç bakımınızı takip edin, sorunları önceden tespit edin ve servis maliyetlerinizi düşürün. 
              Türkiye'nin ilk yapay zeka destekli araç sağlık asistanı.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8"
            >
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm">KVKK Uyumlu</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm">e-Fatura Hazır</span>
              </div>
              <div className="flex items-center text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm">7/24 Destek</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1"
              >
                <span>14 Gün Ücretsiz Başla</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 hover:border-white/40">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Demo İzle</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Device Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* Device Frame */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-gray-800 rounded-[2rem] overflow-hidden">
                  {/* Screen Content */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 h-96">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">OT</span>
                        </div>
                        <div className="text-sm font-medium text-gray-700">Dashboard</div>
                      </div>
                      
                      {/* Stats Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs text-gray-500">Toplam Araç</div>
                          <div className="text-lg font-bold text-gray-900">12</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="text-xs text-gray-500">Aktif İş Emri</div>
                          <div className="text-lg font-bold text-green-600">3</div>
                        </div>
                      </div>
                      
                      {/* Chart Placeholder */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-xs text-gray-500 mb-2">Aylık Performans</div>
                        <div className="flex items-end space-x-1 h-16">
                          {[40, 60, 45, 80, 70, 90, 85].map((height, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-t from-blue-500 to-indigo-500 rounded-sm flex-1"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg"
              >
                <div className="text-xs text-gray-600">Yeni Bildirim</div>
                <div className="text-sm font-semibold text-gray-900">Bakım Hatırlatması</div>
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-xl p-3 shadow-lg"
              >
                <div className="text-xs">Gelir Artışı</div>
                <div className="text-sm font-semibold">+%23</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}