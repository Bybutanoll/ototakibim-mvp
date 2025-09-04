'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Home,
  Car,
  Wrench,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  Search,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

export default function MobileOptimizedLayout({ 
  children, 
  currentPage = 'dashboard',
  onNavigate 
}: MobileOptimizedLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'vehicles',
      label: 'Araçlar',
      icon: Car,
      path: '/dashboard/vehicles',
      subItems: [
        { label: 'Tüm Araçlar', path: '/dashboard/vehicles' },
        { label: 'Araç Ekle', path: '/dashboard/vehicles/add' }
      ]
    },
    {
      id: 'work-orders',
      label: 'İş Emirleri',
      icon: Wrench,
      path: '/dashboard/work-orders',
      subItems: [
        { label: 'Tüm İş Emirleri', path: '/dashboard/work-orders' },
        { label: 'Yeni İş Emri', path: '/dashboard/work-orders/add' }
      ]
    },
    {
      id: 'appointments',
      label: 'Randevular',
      icon: Calendar,
      path: '/dashboard/appointments',
      subItems: [
        { label: 'Tüm Randevular', path: '/dashboard/appointments' },
        { label: 'Randevu Ekle', path: '/dashboard/appointments/add' }
      ]
    },
    {
      id: 'customers',
      label: 'Müşteriler',
      icon: Users,
      path: '/dashboard/customers',
      subItems: [
        { label: 'Tüm Müşteriler', path: '/dashboard/customers' },
        { label: 'Müşteri Ekle', path: '/dashboard/customers/add' }
      ]
    },
    {
      id: 'finance',
      label: 'Finans',
      icon: DollarSign,
      path: '/dashboard/finance',
      subItems: [
        { label: 'Finansal Raporlar', path: '/dashboard/finance' },
        { label: 'Yeni Kayıt', path: '/dashboard/finance/add' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analitik',
      icon: BarChart3,
      path: '/dashboard/analytics'
    },
    {
      id: 'notifications',
      label: 'Bildirimler',
      icon: Bell,
      path: '/dashboard/notifications'
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const MobileHeader = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Car className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">OtoTakibim</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-600 hover:text-gray-900">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-900">
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  const MobileMenu = () => (
    <div className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">OtoTakibim</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.subItems) {
                      toggleSection(item.id);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.subItems && (
                    expandedSections.includes(item.id) ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {item.subItems && expandedSections.includes(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((subItem, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavigation(subItem.path)}
                        className="w-full flex items-center p-2 rounded-lg text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavigation('/dashboard/vehicles/add')}
              className="flex items-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Araç Ekle</span>
            </button>
            <button
              onClick={() => handleNavigation('/dashboard/appointments/add')}
              className="flex items-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Randevu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DesktopSidebar = () => (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-lg font-semibold text-gray-900">OtoTakibim</h1>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.subItems) {
                      toggleSection(item.id);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.subItems && (
                    expandedSections.includes(item.id) ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {item.subItems && expandedSections.includes(item.id) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavigation(subItem.path)}
                        className="w-full flex items-center px-2 py-1 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden md:ml-64">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}