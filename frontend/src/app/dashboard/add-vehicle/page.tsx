'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Car } from 'lucide-react';
import Link from 'next/link';

export default function AddVehiclePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard/vehicles"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Araçlar Sayfasına Dön</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Araç Ekle
          </h1>
          <p className="text-gray-600">
            Yeni bir araç eklemek için aşağıdaki formu doldurun
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Araç Ekleme Formu
            </h2>
            <p className="text-gray-600 mb-6">
              Bu sayfa araç ekleme formunu içerir. 
              Araç ekleme işlemi için lütfen aşağıdaki butona tıklayın.
            </p>
            <Link
              href="/dashboard/vehicles/add"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Car className="w-5 h-5" />
              <span>Araç Ekle</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}