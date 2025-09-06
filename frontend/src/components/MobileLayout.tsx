'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  TruckIcon,
  WrenchIcon,
  CalendarIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMobile, LogoHeader } from '@/components/ui/Logo';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Ana Sayfa', href: '/dashboard', icon: HomeIcon },
    { name: 'Müşteriler', href: '/dashboard/customers', icon: UserGroupIcon },
    { name: 'Araçlar', href: '/dashboard/vehicles', icon: TruckIcon },
    { name: 'İş Emirleri', href: '/dashboard/work-orders', icon: WrenchIcon },
    { name: 'Randevular', href: '/dashboard/appointments', icon: CalendarIcon },
    { name: 'Stok', href: '/dashboard/inventory', icon: CubeIcon },
    { name: 'Ödemeler', href: '/dashboard/payments', icon: CurrencyDollarIcon },
    { name: 'Raporlar', href: '/dashboard/reports', icon: ChartBarIcon },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: Cog6ToothIcon }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
            <Link href="/dashboard" className="flex items-center space-x-3">
              <LogoMobile size="sm" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">OtoTakibim</h1>
                <p className="text-xs text-gray-500">Oto Tamir Yönetimi</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <BellIcon className="h-5 w-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/dashboard" className="flex items-center space-x-3" onClick={() => setIsMenuOpen(false)}>
                    <LogoHeader size="md" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">OtoTakibim</h2>
                      <p className="text-sm text-gray-500">Oto Tamir Yönetimi</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-700" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                          active
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-500 mb-2">Hesap</p>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">A</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">admin@ototakibim.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pb-20">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 h-16">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;