'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  installPrompt: any;
  updateAvailable: boolean;
  serviceWorkerRegistered: boolean;
}

export const PWAProvider = ({ children }: { children: React.ReactNode }) => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isOnline: true,
    isInstalled: false,
    canInstall: false,
    installPrompt: null,
    updateAvailable: false,
    serviceWorkerRegistered: false
  });

  useEffect(() => {
    // Online/Offline detection
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }));
      toast.success('İnternet bağlantısı yeniden kuruldu', {
        icon: '🌐',
        duration: 3000
      });
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }));
      toast.error('İnternet bağlantısı kesildi. Offline modda çalışıyorsunuz.', {
        icon: '📱',
        duration: 5000
      });
    };

    // PWA Installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({ 
        ...prev, 
        canInstall: true, 
        installPrompt: e 
      }));
      
      toast.success('Uygulama yüklenebilir!', {
        icon: '📱',
        duration: 4000,
        action: {
          label: 'Yükle',
          onClick: () => handleInstall()
        }
      });
    };

    // Service Worker Registration
    const registerServiceWorker = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);

          setPwaState(prev => ({ ...prev, serviceWorkerRegistered: true }));

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && typeof window !== 'undefined' && navigator.serviceWorker.controller) {
                  setPwaState(prev => ({ ...prev, updateAvailable: true }));
                  toast.success('Yeni güncelleme mevcut!', {
                    icon: '🔄',
                    duration: 5000,
                    action: {
                      label: 'Yenile',
                      onClick: () => window.location.reload()
                    }
                  });
                }
              });
            }
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setPwaState(prev => ({ ...prev, isInstalled: true }));
      }
    }

    // Register service worker
    registerServiceWorker();

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
    };
  }, []);

  // Install PWA
  const handleInstall = async () => {
    if (typeof window !== 'undefined' && pwaState.installPrompt) {
      const result = await pwaState.installPrompt.prompt();
      console.log('Install prompt result:', result);
      
      if (result.outcome === 'accepted') {
        setPwaState(prev => ({ 
          ...prev, 
          isInstalled: true, 
          canInstall: false,
          installPrompt: null 
        }));
        toast.success('Uygulama başarıyla yüklendi!', {
          icon: '🎉',
          duration: 3000
        });
      }
    }
  };

  // Context value
  const contextValue = {
    ...pwaState,
    install: handleInstall
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      <PWAStatus />
    </PWAContext.Provider>
  );
};

// PWA Context
import { createContext, useContext } from 'react';

const PWAContext = createContext<{
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  installPrompt: any;
  updateAvailable: boolean;
  serviceWorkerRegistered: boolean;
  install: () => Promise<void>;
}>({
  isOnline: true,
  isInstalled: false,
  canInstall: false,
  installPrompt: null,
  updateAvailable: false,
  serviceWorkerRegistered: false,
  install: async () => {}
});

export const usePWA = () => useContext(PWAContext);

// PWA Status Component
const PWAStatus = () => {
  const { isOnline, isInstalled, canInstall, updateAvailable } = usePWA();

  if (!isOnline) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📱</span>
            <span className="font-medium">Offline Mod</span>
          </div>
          <span className="text-sm opacity-90">Sınırlı işlevsellik</span>
        </div>
      </div>
    );
  }

  if (updateAvailable) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔄</span>
            <span className="font-medium">Güncelleme Mevcut</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
          >
            Yenile
          </button>
        </div>
      </div>
    );
  }

  if (canInstall && !isInstalled) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📱</span>
            <span className="font-medium">Uygulamayı Yükle</span>
          </div>
          <button
            onClick={() => usePWA().install()}
            className="bg-white text-green-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
          >
            Yükle
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAProvider;
