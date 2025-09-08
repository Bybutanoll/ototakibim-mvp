"use client";

import React, { useState, useEffect } from 'react';
import { useTenantRouting } from '../../hooks/useTenantRouting';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import Header from '../organisms/Header';
import Sidebar from '../organisms/Sidebar';
import { LoadingSpinner } from '../atoms';
import { useRouter } from 'next/navigation';

export interface TenantLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const TenantLayout: React.FC<TenantLayoutProps> = ({
  children,
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentTenant, settings, isTenantRoute, ensureTenantRoute } = useTenantRouting();
  const { user, isAuthenticated } = useAuth();
  const { hasPermission, hasRole } = usePermissions();
  const router = useRouter();

  // Ensure user is on tenant route
  useEffect(() => {
    if (isAuthenticated && user && currentTenant) {
      ensureTenantRoute();
    }
  }, [isAuthenticated, user, currentTenant, ensureTenantRoute]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Show loading while tenant data is loading
  if (!currentTenant || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Tenant yükleniyor..." />
      </div>
    );
  }

  // Show error if not on tenant route
  if (!isTenantRoute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tenant Bulunamadı
          </h2>
          <p className="text-gray-600 mb-6">
            Bu sayfaya erişim yetkiniz bulunmuyor.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom tenant branding */}
      {settings.branding.primaryColor && (
        <style jsx global>{`
          :root {
            --tenant-primary: ${settings.branding.primaryColor};
            --tenant-secondary: ${settings.branding.secondaryColor || settings.branding.primaryColor};
          }
          
          .tenant-primary {
            background-color: var(--tenant-primary);
          }
          
          .tenant-primary-text {
            color: var(--tenant-primary);
          }
          
          .tenant-border {
            border-color: var(--tenant-primary);
          }
        `}</style>
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        className="tenant-sidebar"
      />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header 
          onMenuToggle={toggleSidebar}
          showMenuButton={true}
          className="tenant-header"
        />
        
        {/* Page content */}
        <main className={`p-6 ${className}`}>
          {/* Tenant info banner */}
          {currentTenant && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.branding.logo ? (
                    <img
                      src={settings.branding.logo}
                      alt={currentTenant.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentTenant.name[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      {currentTenant.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {currentTenant.industry} • {currentTenant.size}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {currentTenant.subscription.plan.charAt(0).toUpperCase() + 
                       currentTenant.subscription.plan.slice(1)} Plan
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentTenant.subscription.status === 'active' ? 'Aktif' : 
                       currentTenant.subscription.status === 'trial' ? 'Deneme' : 
                       currentTenant.subscription.status === 'suspended' ? 'Askıda' : 'İptal'}
                    </p>
                  </div>
                  
                  {currentTenant.subscription.status === 'trial' && (
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Deneme
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};

export default TenantLayout;
