'use client';

import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';

const NewLandingPage: React.FC = () => {
  return (
    <>
      <SEO
        title="OtoTakibim - AI Destekli Araç Sağlık Asistanı"
        description="Yapay zeka teknolojisi ile araç bakım süreçlerinizi optimize edin. %40 maliyet azalması, öngörülü bakım ve akıllı raporlama."
        keywords="araç bakım, AI, yapay zeka, oto servis, araç takibi, bakım yönetimi"
        ogImage="/og-image.jpg"
      />
      
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
};

export default NewLandingPage;
