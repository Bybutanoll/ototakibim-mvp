"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Özellikler', href: '#features' },
    { name: 'Fiyatlandırma', href: '#pricing' },
    { name: 'Demo', href: '/demo' },
    { name: 'API', href: '/api' }
  ],
  support: [
    { name: 'Yardım Merkezi', href: '/help' },
    { name: 'İletişim', href: '/contact' },
    { name: 'SSS', href: '/faq' },
    { name: 'Durum', href: '/status' }
  ],
  company: [
    { name: 'Hakkımızda', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kariyer', href: '/careers' },
    { name: 'Basın', href: '/press' }
  ],
  legal: [
    { name: 'Gizlilik Politikası', href: '/privacy' },
    { name: 'Kullanım Şartları', href: '/terms' },
    { name: 'KVKK', href: '/kvkk' },
    { name: 'Çerez Politikası', href: '/cookies' }
  ]
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">OT</span>
                </div>
                <span className="text-2xl font-bold">OtoTakibim</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                AI destekli araç sağlık asistanı ile araçlarınızı profesyonelce yönetin. 
                Türkiye'nin en güvenilir servis yönetim platformu.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>info@ototakibim.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>+90 (212) 555 0123</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>İstanbul, Türkiye</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {category === 'product' && 'Ürün'}
                  {category === 'support' && 'Destek'}
                  {category === 'company' && 'Şirket'}
                  {category === 'legal' && 'Yasal'}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Güncel Kalın</h3>
            <p className="text-gray-400 mb-6">
              Yeni özellikler ve güncellemeler hakkında bilgi almak için e-posta listemize katılın.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Abone Ol
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 OtoTakibim. Tüm hakları saklıdır.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}