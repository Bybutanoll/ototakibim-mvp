import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../atoms';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Özellikler', href: '#features' },
      { name: 'Fiyatlandırma', href: '#pricing' },
      { name: 'API Dokümantasyonu', href: '/docs' },
      { name: 'Entegrasyonlar', href: '/integrations' },
      { name: 'Mobil Uygulama', href: '/mobile' }
    ],
    company: [
      { name: 'Hakkımızda', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Kariyer', href: '/careers' },
      { name: 'Basın', href: '/press' },
      { name: 'Partnerler', href: '/partners' }
    ],
    support: [
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'İletişim', href: '/contact' },
      { name: 'Durum Sayfası', href: '/status' },
      { name: 'Güvenlik', href: '/security' },
      { name: 'Gizlilik', href: '/privacy' }
    ],
    legal: [
      { name: 'Kullanım Şartları', href: '/terms' },
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'Çerez Politikası', href: '/cookies' },
      { name: 'KVKK', href: '/kvkk' },
      { name: 'Sözleşmeler', href: '/contracts' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/ototakibim' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/ototakibim' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/ototakibim' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/ototakibim' }
  ];

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Güncel Kalın
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Yeni özellikler, güncellemeler ve sektör haberleri hakkında bilgi almak için 
              e-bültenimize abone olun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="primary"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
              >
                Abone Ol
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OT</span>
                </div>
                <span className="text-xl font-bold">OtoTakibim</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-sm">
                Türkiye'nin ilk AI destekli araç sağlık asistanı. 
                Yapay zeka teknolojisi ile araç bakım süreçlerinizi optimize edin.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">info@ototakibim.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">+90 212 555 0123</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">İstanbul, Türkiye</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Destek</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} OtoTakibim. Tüm hakları saklıdır.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
