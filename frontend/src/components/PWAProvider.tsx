'use client';

import { useEffect, useState, createContext, useContext } from 'react';

// PWA Context - Sadece temel özellikler
const PWAContext = createContext<{
  isOnline: boolean;
  serviceWorkerRegistered: boolean;
}>({
  isOnline: true,
  serviceWorkerRegistered: false
});

export const usePWA = () => useContext(PWAContext);

export const PWAProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Online/offline durumunu takip et
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Service Worker kaydı - sadece temel
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          setServiceWorkerRegistered(true);
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Install prompt'u tamamen engelle
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const contextValue = {
    isOnline,
    serviceWorkerRegistered
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
    </PWAContext.Provider>
  );
};

export default PWAProvider;
