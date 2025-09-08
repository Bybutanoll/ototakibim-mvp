'use client';

import React, { useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import Modal from '@/components/atoms/Modal';

export default function ResponsiveTestPage() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setCurrentBreakpoint('Mobile (< 640px)');
      else if (width < 768) setCurrentBreakpoint('Small (640px - 767px)');
      else if (width < 1024) setCurrentBreakpoint('Tablet (768px - 1023px)');
      else if (width < 1280) setCurrentBreakpoint('Desktop (1024px - 1279px)');
      else setCurrentBreakpoint('Large Desktop (≥ 1280px)');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Responsive Test Sayfası
          </h1>
          <p className="text-gray-600 mb-4">
            Farklı ekran boyutlarında UI'ın nasıl göründüğünü test edin
          </p>
          <Badge variant="info" className="text-lg px-4 py-2">
            Mevcut Breakpoint: {currentBreakpoint}
          </Badge>
        </div>

        {/* Grid Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Grid Layout Test</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="bg-blue-100 p-4 rounded-lg text-center font-medium"
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        </Card>

        {/* Flex Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Flex Layout Test</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Ana İçerik</h3>
              <p className="text-sm text-gray-600">
                Bu alan responsive olarak genişler ve daralır.
              </p>
            </div>
            <div className="w-full sm:w-64 bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Sidebar</h3>
              <p className="text-sm text-gray-600">
                Mobilde tam genişlik, desktop'ta sabit genişlik.
              </p>
            </div>
          </div>
        </Card>

        {/* Typography Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Typography Test</h2>
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Responsive Başlık
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
              Alt Başlık
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Bu paragraf farklı ekran boyutlarında farklı font boyutlarında görünür.
              Mobilde daha küçük, desktop'ta daha büyük olacak.
            </p>
          </div>
        </Card>

        {/* Button Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Button Test</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-auto">Tam Genişlik / Otomatik</Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Outline Button
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto">
              Ghost Button
            </Button>
          </div>
        </Card>

        {/* Modal Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Modal Test</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            Modal Aç
          </Button>
        </Card>

        {/* Spacing Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Spacing Test</h2>
          <div className="space-y-2 sm:space-y-4 lg:space-y-6">
            <div className="bg-red-100 p-2 sm:p-4 lg:p-6 rounded">
              <p className="text-sm sm:text-base">
                Padding: 2 (mobile) → 4 (tablet) → 6 (desktop)
              </p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-4 lg:p-6 rounded">
              <p className="text-sm sm:text-base">
                Margin: 2 (mobile) → 4 (tablet) → 6 (desktop)
              </p>
            </div>
          </div>
        </Card>

        {/* Breakpoint Indicators */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Breakpoint Göstergeleri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <div className="bg-red-100 p-2 rounded text-center text-xs">
              <div className="font-semibold">Mobile</div>
              <div>&lt; 640px</div>
            </div>
            <div className="bg-orange-100 p-2 rounded text-center text-xs">
              <div className="font-semibold">Small</div>
              <div>640px+</div>
            </div>
            <div className="bg-yellow-100 p-2 rounded text-center text-xs">
              <div className="font-semibold">Medium</div>
              <div>768px+</div>
            </div>
            <div className="bg-green-100 p-2 rounded text-center text-xs">
              <div className="font-semibold">Large</div>
              <div>1024px+</div>
            </div>
            <div className="bg-blue-100 p-2 rounded text-center text-xs">
              <div className="font-semibold">XL</div>
              <div>1280px+</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Responsive Modal Test"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu modal farklı ekran boyutlarında responsive olarak görünmelidir.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Mobil</h3>
              <p className="text-sm">Tam genişlik, dikey düzen</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Desktop</h3>
              <p className="text-sm">Sabit genişlik, yatay düzen</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button 
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Kapat
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Tamam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
