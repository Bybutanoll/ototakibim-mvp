'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Shield, Lock, CreditCard, Users, Clock, Zap } from 'lucide-react';

const faqs = [
  {
    question: "OtoTakibim nasıl çalışır?",
    answer: "OtoTakibim, yapay zeka teknolojisi ile aracınızın verilerini analiz eder. Kilometre, son bakım tarihi ve diğer bilgileri girerek, AI algoritmalarımız bakım zamanlarını hesaplar ve size hatırlatmalar gönderir.",
    icon: Zap,
    category: "genel"
  },
  {
    question: "Verilerim güvende mi?",
    answer: "Evet, verileriniz %100 güvende. ISO 27001 sertifikalı altyapımız ve end-to-end şifreleme ile verileriniz korunur. GDPR ve KVKK uyumluluğu sağlanmıştır.",
    icon: Shield,
    category: "güvenlik"
  },
  {
    question: "Hangi araç markaları destekleniyor?",
    answer: "Tüm araç markaları desteklenmektedir. Benzin, dizel, LPG ve elektrikli araçlar için özel algoritmalar geliştirdik. Marka ve model fark etmeksizin hizmet verebiliyoruz.",
    icon: Users,
    category: "uyumluluk"
  },
  {
    question: "Ücretlendirme nasıl?",
    answer: "Başlangıç paketi ücretsizdir. Premium özellikler için aylık 29₺ veya yıllık 299₺ ödeme yapabilirsiniz. İlk 30 gün ücretsiz deneme imkanı sunuyoruz.",
    icon: CreditCard,
    category: "fiyatlandırma"
  },
  {
    question: "Bakım hatırlatmaları nasıl gelir?",
    answer: "E-posta, SMS ve push notification ile hatırlatmalar alırsınız. Ayrıca WhatsApp Business entegrasyonu ile anlık bildirimler de gönderiyoruz.",
    icon: Clock,
    category: "özellikler"
  },
  {
    question: "Teknik destek var mı?",
    answer: "7/24 teknik destek hizmetimiz bulunmaktadır. Canlı chat, e-posta ve telefon ile uzman ekibimizden yardım alabilirsiniz.",
    icon: Users,
    category: "destek"
  },
  {
    question: "Mobil uygulama ne zaman gelecek?",
    answer: "Mobil uygulamamız geliştirme aşamasındadır. iOS ve Android için 2024 sonunda yayınlanacak. Web uygulaması tüm cihazlarda mükemmel çalışır.",
    icon: Zap,
    category: "gelişim"
  },
  {
    question: "Veri doğruluğu garantisi var mı?",
    answer: "AI algoritmalarımız %95+ doğruluk oranına sahiptir. Ancak en doğru sonuçlar için düzenli veri güncellemesi önerilir.",
    icon: Shield,
    category: "güvenilirlik"
  }
];

const categories = [
  { id: "tümü", label: "Tümü", icon: HelpCircle },
  { id: "genel", label: "Genel", icon: HelpCircle },
  { id: "güvenlik", label: "Güvenlik", icon: Shield },
  { id: "uyumluluk", label: "Uyumluluk", icon: Users },
  { id: "fiyatlandırma", label: "Fiyatlandırma", icon: CreditCard },
  { id: "özellikler", label: "Özellikler", icon: Zap },
  { id: "destek", label: "Destek", icon: Users },
  { id: "gelişim", label: "Gelişim", icon: Zap },
  { id: "güvenilirlik", label: "Güvenilirlik", icon: Shield }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("tümü");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = activeCategory === "tümü" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="w-full max-w-6xl mx-auto">
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
          Sık Sorulan{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Sorular
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          OtoTakibim hakkında merak edilen sorular ve detaylı yanıtları
        </motion.p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
            }`}
          >
            <category.icon className="h-5 w-5" />
            <span>{category.label}</span>
          </button>
        ))}
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30 flex items-center justify-center">
                  <faq.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
              </div>
              <motion.div
                animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="h-6 w-6 text-gray-400" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openItems.includes(index) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <div className="border-t border-white/10 pt-6">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Hala sorunuz mu var?
          </h3>
          <p className="text-gray-300 mb-6">
            Uzman ekibimiz size yardımcı olmaya hazır. Hemen iletişime geçin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Canlı Destek
            </button>
            <button className="border border-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/10">
              E-posta Gönder
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
