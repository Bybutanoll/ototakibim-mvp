'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Users, Database } from 'lucide-react';
import LogoAnimation from '@/components/LogoAnimation';
import PremiumCard from '@/components/PremiumCard';

export default function PrivacyPage() {
  const privacySections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Veri Toplama",
      description: "Sadece hizmet kalitesini artırmak için gerekli verileri topluyoruz. Araç bilgileri, bakım geçmişi ve kullanım istatistikleri güvenli şekilde saklanır."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Veri Güvenliği",
      description: "Tüm verileriniz endüstri standardı şifreleme ile korunur. SSL/TLS protokolleri ve güvenli sunucular kullanıyoruz."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Veri Kullanımı",
      description: "Verileriniz sadece hizmet sunumu için kullanılır. Üçüncü taraflarla paylaşılmaz ve reklam amaçlı kullanılmaz."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Kullanıcı Hakları",
      description: "Verilerinizi görüntüleme, düzeltme, silme ve taşıma hakkınız vardır. İstediğiniz zaman hesabınızı kapatabilirsiniz."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Header */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <LogoAnimation size="medium" showParticles={false} className="mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Gizlilik Politikası
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Verilerinizin güvenliği bizim için önceliktir. Bu sayfada veri işleme 
              politikalarımızı detaylı olarak açıklıyoruz.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Privacy Sections */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <PremiumCard
                  variant="glassmorphism"
                  className="h-full p-8"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-4">
                      {section.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {section.description}
                  </p>
                </PremiumCard>
              </motion.div>
            ))}
          </div>

          {/* Detailed Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PremiumCard variant="glassmorphism" className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-blue-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Detaylı Gizlilik Politikası</h2>
              </div>
              
              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Veri Toplama</h3>
                  <p>
                    OtoTakibim olarak, hizmetlerimizi sunabilmek için aşağıdaki verileri topluyoruz:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Hesap bilgileri (ad, e-posta, telefon)</li>
                    <li>Araç bilgileri (plaka, marka, model, yıl)</li>
                    <li>Bakım geçmişi ve servis kayıtları</li>
                    <li>Kullanım istatistikleri ve performans verileri</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Veri Kullanımı</h3>
                  <p>
                    Toplanan veriler aşağıdaki amaçlarla kullanılır:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Hizmet sunumu ve kullanıcı deneyimi iyileştirme</li>
                    <li>Bakım hatırlatmaları ve öneriler</li>
                    <li>Teknik destek ve müşteri hizmetleri</li>
                    <li>Güvenlik ve dolandırıcılık önleme</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Veri Paylaşımı</h3>
                  <p>
                    Verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Yasal zorunluluklar</li>
                    <li>Hizmet sağlayıcıları (güvenli ve sınırlı erişim)</li>
                    <li>Kullanıcı onayı ile</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Veri Güvenliği</h3>
                  <p>
                    Verilerinizin güvenliği için aşağıdaki önlemleri alıyoruz:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Endüstri standardı şifreleme (AES-256)</li>
                    <li>Güvenli sunucu altyapısı</li>
                    <li>Düzenli güvenlik denetimleri</li>
                    <li>Erişim kontrolü ve yetkilendirme</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">5. Kullanıcı Hakları</h3>
                  <p>
                    KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Verilerinizi görüntüleme hakkı</li>
                    <li>Yanlış verileri düzeltme hakkı</li>
                    <li>Verilerinizi silme hakkı</li>
                    <li>Veri taşınabilirliği hakkı</li>
                    <li>İşleme itiraz etme hakkı</li>
                  </ul>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gradient-to-r from-slate-800/50 to-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Gizlilik Konusunda Sorularınız mı Var?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Veri güvenliği ve gizlilik politikalarımız hakkında detaylı bilgi almak için 
              bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@ototakibim.com"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <FileText className="w-5 h-5 mr-2" />
                privacy@ototakibim.com
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300"
              >
                İletişim Formu
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
