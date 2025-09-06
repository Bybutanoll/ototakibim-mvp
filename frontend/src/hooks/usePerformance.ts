import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export const usePerformance = () => {
  const reportMetric = useCallback((name: string, value: number) => {
    // Send to analytics service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', name, {
        value: Math.round(value),
        event_category: 'Performance',
      });
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}:`, value);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric = entry as any;
        
        switch (metric.entryType) {
          case 'paint':
            if (metric.name === 'first-contentful-paint') {
              reportMetric('FCP', metric.startTime);
            }
            break;
          case 'largest-contentful-paint':
            reportMetric('LCP', metric.startTime);
            break;
          case 'first-input':
            reportMetric('FID', metric.processingStart - metric.startTime);
            break;
          case 'layout-shift':
            if (!metric.hadRecentInput) {
              reportMetric('CLS', metric.value);
            }
            break;
          case 'navigation':
            reportMetric('TTFB', metric.responseStart - metric.requestStart);
            break;
        }
      }
    });

    // Observe all performance entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      observer.observe({ entryTypes: ['paint', 'navigation'] });
    }

    return () => {
      observer.disconnect();
    };
  }, [reportMetric]);

  return {
    reportMetric,
  };
};