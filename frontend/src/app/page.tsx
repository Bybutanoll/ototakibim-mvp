import Link from 'next/link';
import { Metadata } from 'next';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'OtoTakibim - AI Destekli Araç Sağlık Asistanı',
  description: 'Araç takip, bakım yönetimi ve AI destekli sağlık asistanı ile araçlarınızı profesyonelce yönetin.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">OtoTakibim</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}