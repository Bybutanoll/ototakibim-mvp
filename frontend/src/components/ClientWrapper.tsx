"use client";

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import { usePathname } from 'next/navigation';
import ErrorBoundary from './ErrorBoundary';
import Header from './organisms/Header';
import Sidebar from './organisms/Sidebar';

// Dynamic imports burada yapılacak (client-side)
const OfflineIndicator = dynamic(() => import('./OfflineIndicator'), {
  ssr: false,
  loading: () => null
});

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pages that don't need the dashboard layout
  const publicPages = ['/', '/login', '/register', '/forgot-password'];
  const isPublicPage = publicPages.includes(pathname);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <OfflineIndicator />
      </Suspense>
      
      {isPublicPage ? (
        // Public pages (landing, login, etc.)
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        // Dashboard layout
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
            className="z-sticky"
          />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header 
              onMenuToggle={toggleSidebar}
              showMenuButton={true}
              className="z-sticky"
            />
            
            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
