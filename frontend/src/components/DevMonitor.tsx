"use client";
import { useEffect } from 'react';

const DevMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Console temizliği
    const originalError = console.error;
    console.error = (...args) => {
      // Gereksiz hataları filtrele
      if (
        args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('defaultProps') || 
           arg.includes('findDOMNode'))
        )
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    // Memory monitoring
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB'
        });
      }
    };

    const interval = setInterval(checkMemory, 30000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default DevMonitor;
