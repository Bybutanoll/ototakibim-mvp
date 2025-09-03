'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Car, Wrench, AlertTriangle, CheckCircle, Clock, Download, Share2, Mail } from 'lucide-react';

interface MaintenanceResult {
  oilChange: { status: 'urgent' | 'warning' | 'safe'; message: string; kmLeft: number };
  brakeCheck: { status: 'urgent' | 'warning' | 'safe'; message: string; kmLeft: number };
  generalService: { status: 'urgent' | 'warning' | 'safe'; message: string; monthsLeft: number };
  tireCheck: { status: 'urgent' | 'warning' | 'safe'; message: string; kmLeft: number };
}

export default function MaintenanceCalculator() {
  const [formData, setFormData] = useState({
    kilometers: '',
    lastService: '',
    fuelType: 'benzin',
    city: ''
  });
  const [result, setResult] = useState<MaintenanceResult | null>(null);
  const [email, setEmail] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const calculateMaintenance = () => {
    if (!formData.kilometers || !formData.lastService) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const km = parseInt(formData.kilometers);
      const monthsSinceService = parseInt(formData.lastService);
      
      const oilChangeKm = km % 10000;
      const brakeCheckKm = km % 30000;
      const tireCheckKm = km % 20000;
      
      const result: MaintenanceResult = {
        oilChange: {
          status: oilChangeKm > 8000 ? 'urgent' : oilChangeKm > 6000 ? 'warning' : 'safe',
          message: oilChangeKm > 8000 ? 'Acil yağ değişimi gerekli!' : oilChangeKm > 6000 ? 'Yağ değişimi yaklaşıyor' : 'Yağ değişimi güvende',
          kmLeft: 10000 - oilChangeKm
        },
        brakeCheck: {
          status: brakeCheckKm > 25000 ? 'urgent' : brakeCheckKm > 20000 ? 'warning' : 'safe',
          message: brakeCheckKm > 25000 ? 'Fren kontrolü gerekli!' : brakeCheckKm > 20000 ? 'Fren kontrolü yaklaşıyor' : 'Fren kontrolü güvende',
          kmLeft: 30000 - brakeCheckKm
        },
        generalService: {
          status: monthsSinceService > 10 ? 'urgent' : monthsSinceService > 8 ? 'warning' : 'safe',
          message: monthsSinceService > 10 ? 'Genel bakım gerekli!' : monthsSinceService > 8 ? 'Genel bakım yaklaşıyor' : 'Genel bakım güvende',
          monthsLeft: 12 - monthsSinceService
        },
        tireCheck: {
          status: tireCheckKm > 15000 ? 'urgent' : tireCheckKm > 10000 ? 'warning' : 'safe',
          message: tireCheckKm > 15000 ? 'Lastik kontrolü gerekli!' : tireCheckKm > 10000 ? 'Lastik kontrolü yaklaşıyor' : 'Lastik kontrolü güvende',
          kmLeft: 20000 - tireCheckKm
        }
      };
      
      setResult(result);
      setIsCalculating(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'safe': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'urgent': return <AlertTriangle className="h-5 w-5" />;
      case 'warning': return <Clock className="h-5 w-5" />;
      case 'safe': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your email service
    alert('Bakım hatırlatıcıları e-posta adresinize gönderilecek!');
    setShowEmailForm(false);
  };

  const downloadReport = () => {
    if (!result) return;
    
    const report = `
BAKIM RAPORU
=============
Kilometre: ${formData.kilometers} km
Son Bakım: ${formData.lastService} ay önce
Yakıt Tipi: ${formData.fuelType}

YAĞ DEĞİŞİMİ: ${result.oilChange.message}
${result.oilChange.kmLeft} km kaldı

FREN KONTROLÜ: ${result.brakeCheck.message}
${result.brakeCheck.kmLeft} km kaldı

GENEL BAKIM: ${result.generalService.message}
${result.generalService.monthsLeft} ay kaldı

LASTİK KONTROLÜ: ${result.tireCheck.message}
${result.tireCheck.kmLeft} km kaldı

OtoTakibim - AI Destekli Araç Sağlık Asistanı
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bakim-raporu.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4"
          >
            <Calculator className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Mini Bakım Hesaplayıcı</h2>
          <p className="text-gray-300">Aracınızın bakım durumunu 30 saniyede öğrenin!</p>
        </div>

        {/* Calculator Form */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Aracınızın Kilometresi
              </label>
              <input
                type="number"
                value={formData.kilometers}
                onChange={(e) => setFormData({...formData, kilometers: e.target.value})}
                placeholder="Örn: 85000"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Son Bakım Ne Zaman Yapıldı?
              </label>
              <input
                type="number"
                value={formData.lastService}
                onChange={(e) => setFormData({...formData, lastService: e.target.value})}
                placeholder="Kaç ay önce?"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yakıt Tipi
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="benzin">Benzin</option>
                <option value="dizel">Dizel</option>
                <option value="lpg">LPG</option>
                <option value="elektrik">Elektrik</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Şehir (Opsiyonel)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="İstanbul, Ankara..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        )}

        {/* Calculate Button */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8"
          >
            <button
              onClick={calculateMaintenance}
              disabled={!formData.kilometers || !formData.lastService || isCalculating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-3"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Hesaplanıyor...</span>
                </>
              ) : (
                <>
                  <Wrench className="h-6 w-6" />
                  <span>Bakım Durumunu Hesapla</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Bakım Özeti</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Yağ Değişimi', item: result.oilChange, unit: 'km' },
                  { title: 'Fren Kontrolü', item: result.brakeCheck, unit: 'km' },
                  { title: 'Genel Bakım', item: result.generalService, unit: 'ay' },
                  { title: 'Lastik Kontrolü', item: result.tireCheck, unit: 'km' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${getStatusColor(item.item.status)} mb-2`}>
                      {getStatusIcon(item.item.status)}
                    </div>
                    <div className="text-sm text-gray-300 mb-1">{item.title}</div>
                    <div className="text-lg font-bold text-white">
                      {item.unit === 'km' ? item.item.kmLeft : item.item.monthsLeft} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Yağ Değişimi', item: result.oilChange, icon: Wrench },
                { title: 'Fren Kontrolü', item: result.brakeCheck, icon: Car },
                { title: 'Genel Bakım', item: result.generalService, icon: Wrench },
                { title: 'Lastik Kontrolü', item: result.tireCheck, icon: Car }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`p-6 rounded-2xl border ${getStatusColor(section.item.status)}`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <section.icon className="h-6 w-6" />
                    <h4 className="font-semibold text-white">{section.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{section.item.message}</p>
                  <div className="text-lg font-bold text-white">
                    {section.item.kmLeft ? `${section.item.kmLeft} km kaldı` : `${section.item.monthsLeft} ay kaldı`}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setShowEmailForm(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>E-posta ile Hatırlat</span>
              </button>
              
              <button
                onClick={downloadReport}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Raporu İndir</span>
              </button>
              
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Bakım Raporum',
                      text: 'OtoTakibim ile bakım durumumu öğrendim!',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link kopyalandı!');
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Share2 className="h-5 w-5" />
                <span>Paylaş</span>
              </button>
            </motion.div>

            {/* Email Form */}
            {showEmailForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/20"
              >
                <h4 className="text-lg font-semibold text-white mb-4 text-center">
                  Bakım Hatırlatıcıları Alın
                </h4>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ornek@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Hatırlatıcıları Gönder
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/10"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResult(null);
                  setFormData({ kilometers: '', lastService: '', fuelType: 'benzin', city: '' });
                  setEmail('');
                  setShowEmailForm(false);
                }}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Yeni Hesaplama Yap
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
