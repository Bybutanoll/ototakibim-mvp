'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Araç Bakımında Dikkat Edilmesi Gerekenler',
      excerpt: 'Araç bakımında kritik noktalar ve düzenli kontrol listesi...',
      author: 'OtoTakibim Ekibi',
      date: '2024-01-15',
      readTime: '5 dk'
    },
    {
      id: 2,
      title: 'Kış Aylarında Araç Bakımı',
      excerpt: 'Soğuk havalarda araç bakımı için önemli ipuçları...',
      author: 'OtoTakibim Ekibi',
      date: '2024-01-10',
      readTime: '7 dk'
    },
    {
      id: 3,
      title: 'Yaz Aylarında Klima Bakımı',
      excerpt: 'Klima sisteminin düzenli bakımı ve performans artırma...',
      author: 'OtoTakibim Ekibi',
      date: '2024-01-05',
      readTime: '4 dk'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            OtoTakibim Blog
          </h1>
          <p className="text-gray-600">
            Araç bakımı ve oto servis yönetimi hakkında güncel bilgiler
          </p>
        </div>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {post.title}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <span>{post.readTime} okuma</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}