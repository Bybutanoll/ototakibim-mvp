"use client";
import { useState, useEffect } from 'react';
import { useClientOnly } from '@/hooks/useClientOnly';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const hasMounted = useClientOnly();

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Server-side render sırasında hiçbir şey render etme
  if (!hasMounted || isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50 text-sm">
      İnternet bağlantısı yok
    </div>
  );
};

export default OfflineIndicator;
