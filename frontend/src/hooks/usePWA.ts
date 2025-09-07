import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: any;
  swRegistration: ServiceWorkerRegistration | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    isUpdateAvailable: false,
    installPrompt: null,
    swRegistration: null
  });

  // Check if app is installed
  const checkIfInstalled = useCallback(() => {
    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (typeof window !== 'undefined' && (window.navigator as any).standalone) ||
      document.referrer.includes('android-app://');
    
    setPwaState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Handle install prompt
  const handleInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setPwaState(prev => ({ 
      ...prev, 
      installPrompt: e,
      isInstallable: true 
    }));
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!pwaState.installPrompt) {
      toast.error('PWA kurulumu mevcut değil');
      return;
    }

    try {
      const result = await pwaState.installPrompt.prompt();
      console.log('PWA install prompt result:', result);
      
      if (result.outcome === 'accepted') {
        toast.success('OtoTakibim başarıyla kuruldu!');
        setPwaState(prev => ({ 
          ...prev, 
          isInstalled: true,
          isInstallable: false,
          installPrompt: null 
        }));
      } else {
        toast.error('PWA kurulumu iptal edildi');
      }
    } catch (error) {
      console.error('PWA install error:', error);
      toast.error('PWA kurulumunda hata oluştu');
    }
  }, [pwaState.installPrompt]);

  // Handle online/offline status
  const handleOnlineStatus = useCallback(() => {
    setPwaState(prev => ({ ...prev, isOnline: typeof window !== 'undefined' ? navigator.onLine : true }));
    
    if (typeof window !== 'undefined' && navigator.onLine) {
      toast.success('İnternet bağlantısı geri geldi');
    } else {
      toast.error('İnternet bağlantısı kesildi - Çevrimdışı modda çalışıyorsunuz');
    }
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        setPwaState(prev => ({ ...prev, swRegistration: registration }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && typeof window !== 'undefined' && navigator.serviceWorker.controller) {
                setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
                toast.success('Yeni güncelleme mevcut! Sayfayı yenileyin.');
              }
            });
          }
        });

        // Handle service worker messages
        if (typeof window !== 'undefined') {
          navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            toast.success('Uygulama güncellendi');
          }
        });
        }

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }, []);

  // Update service worker
  const updateServiceWorker = useCallback(async () => {
    if (pwaState.swRegistration && pwaState.swRegistration.waiting) {
      pwaState.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [pwaState.swRegistration]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Bildirim izni verildi');
        return true;
      } else {
        toast.error('Bildirim izni reddedildi');
        return false;
      }
    }
    return false;
  }, []);

  // Send notification
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        ...options
      });
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!pwaState.swRegistration) {
      toast.error('Service Worker kayıtlı değil');
      return;
    }

    try {
      const subscription = await pwaState.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      console.log('Push subscription:', subscription);
      
      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        toast.success('Push bildirimleri etkinleştirildi');
      } else {
        toast.error('Push bildirimleri etkinleştirilemedi');
      }
    } catch (error) {
      console.error('Push subscription error:', error);
      toast.error('Push bildirimleri kurulumunda hata oluştu');
    }
  }, [pwaState.swRegistration]);

  // Initialize PWA
  useEffect(() => {
    checkIfInstalled();
    registerServiceWorker();

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Check for app installed
    window.addEventListener('appinstalled', () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true,
        isInstallable: false,
        installPrompt: null 
      }));
      toast.success('OtoTakibim başarıyla kuruldu!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [checkIfInstalled, registerServiceWorker, handleInstallPrompt, handleOnlineStatus]);

  return {
    ...pwaState,
    installPWA,
    updateServiceWorker,
    requestNotificationPermission,
    sendNotification,
    subscribeToPush
  };
};