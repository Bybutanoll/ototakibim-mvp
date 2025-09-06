'use client';

import { motion } from 'framer-motion';
import { FileText, Scale, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import LogoAnimation from '@/components/LogoAnimation';
import PremiumCard from '@/components/PremiumCard';

export default function TermsPage() {
  const termsSections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Kullanıcı Sorumlulukları",
      description: "Hizmetimizi kullanırken doğru bilgi vermek, güvenli şifre kullanmak ve hesabınızı korumakla yükümlüsünüz."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Hizmet Garantisi",
      description: "Hizmetimizi en iyi şekilde sunmaya çalışıyoruz, ancak kesintisiz hizmet garantisi veremeyiz."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Fikri Mülkiyet",
      description: "OtoTakibim platformu ve içeriği telif hakkı ile korunmaktadır. İzinsiz kullanım yasaktır."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Sorumluluk Sınırları",
      description: "Platformumuz bilgi amaçlıdır. Araç bakım kararları kullanıcının sorumluluğundadır."
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
              Kullanım Şartları
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              OtoTakibim hizmetlerini kullanmadan önce bu kullanım şartlarını 
              dikkatlice okuyun ve kabul ettiğinizden emin olun.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {termsSections.map((section, index) => (
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

          {/* Detailed Terms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PremiumCard variant="glassmorphism" className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-blue-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Detaylı Kullanım Şartları</h2>
              </div>
              
              <div className="space-y-8 text-gray-300">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Hizmet Tanımı</h3>
                  <p className="mb-3">
                    OtoTakibim, araç sahiplerinin araçlarının bakımını takip etmelerine, 
                    bakım hatırlatmaları almalarına ve araç sağlığı hakkında bilgi edinmelerine 
                    yardımcı olan bir dijital platformdur.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Araç bilgilerini kaydetme ve yönetme</li>
                    <li>Bakım geçmişi takibi</li>
                    <li>Bakım hatırlatmaları</li>
                    <li>AI destekli bakım önerileri</li>
                    <li>Servis randevu yönetimi</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Kullanıcı Sorumlulukları</h3>
                  <p className="mb-3">Hizmetimizi kullanırken aşağıdaki kurallara uymakla yükümlüsünüz:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Doğru ve güncel bilgi sağlamak</li>
                    <li>Hesap güvenliğini sağlamak</li>
                    <li>Yasalara uygun davranmak</li>
                    <li>Başkalarının haklarına saygı göstermek</li>
                    <li>Platformu kötüye kullanmamak</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Yasak Kullanımlar</h3>
                  <p className="mb-3">Aşağıdaki faaliyetler kesinlikle yasaktır:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sahte hesap oluşturma</li>
                    <li>Başkalarının hesaplarını kullanma</li>
                    <li>Zararlı yazılım yayma</li>
                    <li>Spam veya istenmeyen içerik gönderme</li>
                    <li>Telif hakkı ihlali</li>
                    <li>Yasadışı faaliyetlerde bulunma</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Hizmet Garantisi</h3>
                  <p className="mb-3">
                    OtoTakibim hizmetlerini "olduğu gibi" sunar. Aşağıdaki durumlar için 
                    sorumluluk kabul etmeyiz:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hizmet kesintileri</li>
                    <li>Veri kayıpları</li>
                    <li>Üçüncü taraf hizmetlerindeki sorunlar</li>
                    <li>Kullanıcı hatalarından kaynaklanan sorunlar</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">5. Fikri Mülkiyet</h3>
                  <p className="mb-3">
                    OtoTakibim platformu, yazılımı, tasarımı ve içeriği telif hakkı ile 
                    korunmaktadır. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">6. Hesap Sonlandırma</h3>
                  <p className="mb-3">
                    Aşağıdaki durumlarda hesabınızı sonlandırabiliriz:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Kullanım şartlarını ihlal etmeniz</li>
                    <li>Uzun süre aktif olmamanız</li>
                    <li>Yasal zorunluluklar</li>
                    <li>Teknik nedenler</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">7. Değişiklikler</h3>
                  <p>
                    Bu kullanım şartlarını önceden bildirim yaparak değiştirebiliriz. 
                    Değişiklikler yayınlandıktan sonra hizmeti kullanmaya devam etmeniz, 
                    yeni şartları kabul ettiğiniz anlamına gelir.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">8. Uygulanacak Hukuk</h3>
                  <p>
                    Bu kullanım şartları Türkiye Cumhuriyeti hukukuna tabidir. 
                    Herhangi bir anlaşmazlık durumunda Türkiye mahkemeleri yetkilidir.
                  </p>
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
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Kullanım Şartları Hakkında Sorularınız mı Var?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Kullanım şartları ve hizmet politikalarımız hakkında detaylı bilgi almak için 
              bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@ototakibim.com"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <FileText className="w-5 h-5 mr-2" />
                legal@ototakibim.com
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
