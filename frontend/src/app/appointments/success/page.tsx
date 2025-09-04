'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

export default function AppointmentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Randevunuz Başarıyla Alındı!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Randevu detayları e-posta adresinize gönderildi. 
          Randevu saatinden 1 saat önce SMS ile hatırlatma alacaksınız.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Dashboard'a Git</span>
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
}