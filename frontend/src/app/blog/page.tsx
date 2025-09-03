'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  Share2, 
  Tag,
  ArrowRight,
  Filter,
  BookOpen,
  TrendingUp,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  views: number;
  likes: number;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    { id: 'all', name: 'Tümü', count: 12 },
    { id: 'maintenance', name: 'Bakım Rehberi', count: 4 },
    { id: 'ai', name: 'AI Teknolojisi', count: 3 },
    { id: 'tips', name: 'Pratik İpuçları', count: 3 },
    { id: 'news', name: 'Sektör Haberleri', count: 2 }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'AI Destekli Araç Bakımı: Geleceğin Teknolojisi',
      excerpt: 'Yapay zeka teknolojileri ile araç bakımı nasıl değişiyor? OtoTakibim AI asistanının sunduğu yenilikler ve avantajlar.',
      content: 'Yapay zeka teknolojileri, araç bakımı alanında devrim yaratıyor...',
      author: 'OtoTakibim AI',
      publishDate: '2024-03-15',
      readTime: '5 dk',
      category: 'ai',
      tags: ['AI', 'Teknoloji', 'Bakım', 'Gelecek'],
      image: '/api/placeholder/600/400',
      views: 1247,
      likes: 89,
      featured: true,
      seoTitle: 'AI Destekli Araç Bakımı - OtoTakibim Blog',
      seoDescription: 'Yapay zeka teknolojileri ile araç bakımı nasıl değişiyor? OtoTakibim AI asistanının avantajları.',
      seoKeywords: ['AI araç bakımı', 'yapay zeka', 'oto servis', 'bakım teknolojisi']
    },
    {
      id: '2',
      title: 'Araç Bakımında En Sık Yapılan 10 Hata',
      excerpt: 'Araç sahiplerinin bakım konusunda yaptığı en yaygın hatalar ve bunları nasıl önleyebileceğiniz hakkında detaylı rehber.',
      content: 'Araç bakımı, aracınızın ömrünü uzatmak ve güvenliğinizi sağlamak için kritik öneme sahiptir...',
      author: 'Mehmet Usta',
      publishDate: '2024-03-12',
      readTime: '8 dk',
      category: 'maintenance',
      tags: ['Bakım', 'Hatalar', 'Rehber', 'Güvenlik'],
      image: '/api/placeholder/600/400',
      views: 2156,
      likes: 156,
      featured: true,
      seoTitle: 'Araç Bakımında En Sık Yapılan Hatalar - OtoTakibim',
      seoDescription: 'Araç sahiplerinin bakım konusunda yaptığı en yaygın hatalar ve çözüm önerileri.',
      seoKeywords: ['araç bakımı', 'bakım hataları', 'oto servis', 'araç güvenliği']
    },
    {
      id: '3',
      title: 'Yağ Değişimi Ne Zaman Yapılmalı?',
      excerpt: 'Motor yağı değişimi için doğru zamanlama, yağ türü seçimi ve profesyonel öneriler.',
      content: 'Motor yağı, aracınızın kalbi olan motorun düzgün çalışması için hayati öneme sahiptir...',
      author: 'Ayşe Teknik',
      publishDate: '2024-03-10',
      readTime: '6 dk',
      category: 'maintenance',
      tags: ['Yağ Değişimi', 'Motor', 'Bakım', 'Teknik'],
      image: '/api/placeholder/600/400',
      views: 1893,
      likes: 134,
      featured: false,
      seoTitle: 'Yağ Değişimi Ne Zaman Yapılmalı - OtoTakibim Rehberi',
      seoDescription: 'Motor yağı değişimi için doğru zamanlama ve profesyonel öneriler.',
      seoKeywords: ['yağ değişimi', 'motor yağı', 'araç bakımı', 'teknik servis']
    },
    {
      id: '4',
      title: 'Elektrikli Araçlar ve Bakım Gereksinimleri',
      excerpt: 'Elektrikli araçların bakım ihtiyaçları, geleneksel araçlardan farkları ve dikkat edilmesi gerekenler.',
      content: 'Elektrikli araçlar, çevre dostu olmalarının yanı sıra bakım açısından da farklılıklar gösterir...',
      author: 'Dr. Ahmet Enerji',
      publishDate: '2024-03-08',
      readTime: '7 dk',
      category: 'news',
      tags: ['Elektrikli Araç', 'Yeşil Teknoloji', 'Bakım', 'Gelecek'],
      image: '/api/placeholder/600/400',
      views: 1678,
      likes: 98,
      featured: false,
      seoTitle: 'Elektrikli Araçlar ve Bakım Gereksinimleri - OtoTakibim',
      seoDescription: 'Elektrikli araçların bakım ihtiyaçları ve geleneksel araçlardan farkları.',
      seoKeywords: ['elektrikli araç', 'yeşil teknoloji', 'araç bakımı', 'sürdürülebilirlik']
    },
    {
      id: '5',
      title: 'Kış Aylarında Araç Bakımı: 5 Kritik Nokta',
      excerpt: 'Soğuk havalarda aracınızın performansını korumak için yapmanız gereken bakım işlemleri.',
      content: 'Kış ayları, araçlar için en zorlu dönemlerden biridir. Soğuk hava koşulları...',
      author: 'Kış Uzmanı',
      publishDate: '2024-03-05',
      readTime: '4 dk',
      category: 'tips',
      tags: ['Kış Bakımı', 'Soğuk Hava', 'Güvenlik', 'İpuçları'],
      image: '/api/placeholder/600/400',
      views: 2341,
      likes: 167,
      featured: false,
      seoTitle: 'Kış Aylarında Araç Bakımı - OtoTakibim Rehberi',
      seoDescription: 'Soğuk havalarda araç bakımı için kritik noktalar ve öneriler.',
      seoKeywords: ['kış bakımı', 'soğuk hava', 'araç güvenliği', 'bakım ipuçları']
    },
    {
      id: '6',
      title: 'OtoTakibim AI: Aracınızın Dijital Doktoru',
      excerpt: 'OtoTakibim AI asistanının nasıl çalıştığı, sunduğu özellikler ve kullanıcı deneyimleri.',
      content: 'OtoTakibim AI, aracınızın sağlığını sürekli takip eden akıllı bir asistan...',
      author: 'OtoTakibim Team',
      publishDate: '2024-03-01',
      readTime: '6 dk',
      category: 'ai',
      tags: ['OtoTakibim', 'AI', 'Dijital Asistan', 'Teknoloji'],
      image: '/api/placeholder/600/400',
      views: 3124,
      likes: 245,
      featured: true,
      seoTitle: 'OtoTakibim AI: Aracınızın Dijital Doktoru - Blog',
      seoDescription: 'OtoTakibim AI asistanının özellikleri ve kullanıcı deneyimleri.',
      seoKeywords: ['OtoTakibim', 'AI asistan', 'dijital doktor', 'araç sağlığı']
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      case 'popular':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const featuredPosts = sortedPosts.filter(post => post.featured);
  const regularPosts = sortedPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">OtoTakibim Blog</h1>
                    <p className="text-sm text-blue-200">Araç Sağlığı ve Teknoloji</p>
                  </div>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
                <Link href="/dashboard" className="text-blue-200 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Araç Sağlığı ve Teknoloji Blogu
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              AI destekli araç bakımı, teknoloji trendleri, pratik ipuçları ve sektör haberleri. 
              Aracınızın sağlığı için ihtiyacınız olan her şey burada!
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'bg-white/10 backdrop-blur-md text-blue-200 hover:bg-white/20'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex justify-center items-center space-x-4">
              <span className="text-blue-200 text-sm">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">En Yeni</option>
                <option value="popular">En Popüler</option>
                <option value="likes">En Çok Beğenilen</option>
              </select>
            </div>
          </motion.div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                Öne Çıkan Yazılar
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="h-48 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-400" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs rounded-full">
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                        {post.featured && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Öne Çıkan
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-blue-200 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.publishDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.id}`}
                          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Devamını Oku
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Regular Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Tüm Yazılar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-blue-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs rounded-full">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.publishDate).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {post.likes}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        Oku
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Güncel Kalın! 📧
              </h3>
              <p className="text-blue-200 mb-6">
                En son araç bakım ipuçları, teknoloji haberleri ve AI güncellemelerini e-posta ile alın.
              </p>
              <div className="max-w-md mx-auto flex space-x-2">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold">
                  Abone Ol
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
