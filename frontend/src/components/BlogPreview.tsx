'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight, TrendingUp, Wrench, Car, Shield } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "AI ile Araç Bakımı: Geleceğin Teknolojisi",
    excerpt: "Yapay zeka teknolojisi nasıl araç bakımınızı kolaylaştırıyor? Detaylı rehber ve pratik ipuçları.",
    category: "Teknoloji",
    readTime: "5 dk",
    publishDate: "2024-01-15",
    image: "/api/placeholder/400/250",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-600/20 to-cyan-600/20",
    borderColor: "border-blue-500/30",
    icon: TrendingUp
  },
  {
    id: 2,
    title: "Yağ Değişim Süresi: Kaç KM'de Yapılmalı?",
    excerpt: "Aracınızın yağ değişim zamanını doğru hesaplayın. Marka ve model bazlı öneriler.",
    category: "Bakım",
    readTime: "4 dk",
    publishDate: "2024-01-12",
    image: "/api/placeholder/400/250",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
    icon: Wrench
  },
  {
    id: 3,
    title: "Fren Sistemi Kontrolü: Güvenli Sürüş İçin",
    excerpt: "Fren balatalarınızı ne zaman değiştirmelisiniz? Güvenlik kontrol listesi ve uyarı işaretleri.",
    category: "Güvenlik",
    readTime: "6 dk",
    publishDate: "2024-01-10",
    image: "/api/placeholder/400/250",
    color: "from-red-500 to-pink-500",
    bgColor: "from-red-600/20 to-pink-600/20",
    borderColor: "border-red-500/30",
    icon: Shield
  },
  {
    id: 4,
    title: "Elektrikli Araç Bakımı: Farklı Yaklaşımlar",
    excerpt: "Elektrikli araçların bakım ihtiyaçları neler? Geleneksel araçlardan farkları ve özel gereksinimler.",
    category: "Elektrikli",
    readTime: "7 dk",
    publishDate: "2024-01-08",
    image: "/api/placeholder/400/250",
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-600/20 to-indigo-600/20",
    borderColor: "border-purple-500/30",
    icon: Car
  },
  {
    id: 5,
    title: "Mevsimsel Bakım: Yaz ve Kış Hazırlıkları",
    excerpt: "Her mevsim araç bakımında dikkat edilmesi gerekenler. Hava koşullarına göre öneriler.",
    category: "Mevsimsel",
    readTime: "5 dk",
    publishDate: "2024-01-05",
    image: "/api/placeholder/400/250",
    color: "from-orange-500 to-yellow-500",
    bgColor: "from-orange-600/20 to-yellow-600/20",
    borderColor: "border-orange-500/30",
    icon: Calendar
  },
  {
    id: 6,
    title: "Servis Maliyetlerini Düşürme Rehberi",
    excerpt: "Araç bakım maliyetlerinizi %40'a kadar nasıl düşürebilirsiniz? Akıllı planlama stratejileri.",
    category: "Tasarruf",
    readTime: "8 dk",
    publishDate: "2024-01-03",
    image: "/api/placeholder/400/250",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-600/20 to-teal-600/20",
    borderColor: "border-emerald-500/30",
    icon: TrendingUp
  }
];

const categories = [
  { id: "tümü", label: "Tümü", count: 6 },
  { id: "Teknoloji", label: "Teknoloji", count: 1 },
  { id: "Bakım", label: "Bakım", count: 1 },
  { id: "Güvenlik", label: "Güvenlik", count: 1 },
  { id: "Elektrikli", label: "Elektrikli", count: 1 },
  { id: "Mevsimsel", label: "Mevsimsel", count: 1 },
  { id: "Tasarruf", label: "Tasarruf", count: 1 }
];

export default function BlogPreview() {
  const [activeCategory, setActiveCategory] = React.useState("tümü");

  const filteredPosts = activeCategory === "tümü" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6"
        >
          <BookOpen className="h-10 w-10 text-white" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl lg:text-5xl font-black text-white mb-6"
        >
          OtoBakım{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Gündemi
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Araç bakımı hakkında güncel bilgiler, uzman önerileri ve pratik ipuçları
        </motion.p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
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
            <span>{category.label}</span>
            <span className="text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </motion.div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="group relative"
          >
            {/* Post Card */}
            <div className={`relative bg-gradient-to-br ${post.bgColor} backdrop-blur-lg rounded-3xl border ${post.borderColor} overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600/50 to-slate-800/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <post.icon className="h-16 w-16 text-white/60" />
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30">
                    {post.category}
                  </span>
                </div>
                {/* Read Time */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-black/30 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishDate).toLocaleDateString('tr-TR')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Read More Button */}
                <Link 
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 group-hover:translate-x-1"
                >
                  <span>Devamını Oku</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.article>
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
            Daha Fazla İçerik İçin
          </h3>
          <p className="text-gray-300 mb-6">
            Haftalık bakım tüyoları ve güncel otomotiv haberleri için blog sayfamızı takip edin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/blog"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Tüm Yazıları Gör
            </Link>
            <button className="border border-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/10">
              E-posta Bülteni
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
