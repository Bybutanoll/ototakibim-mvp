'use client';

import { useEffect, useState } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsData {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceMetrics {
  cls: number | null;
  fid: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  timestamp: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    timestamp: Date.now()
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Web Vitals measurement
    const measureWebVitals = () => {
      onCLS((metric: WebVitalsData) => {
        setMetrics(prev => ({ ...prev, cls: metric.value }));
        sendToAnalytics(metric);
      });

      onFID((metric: WebVitalsData) => {
        setMetrics(prev => ({ ...prev, fid: metric.value }));
        sendToAnalytics(metric);
      });

      onFCP((metric: WebVitalsData) => {
        setMetrics(prev => ({ ...prev, fcp: metric.value }));
        sendToAnalytics(metric);
      });

      onLCP((metric: WebVitalsData) => {
        setMetrics(prev => ({ ...prev, lcp: metric.value }));
        sendToAnalytics(metric);
      });

      onTTFB((metric: WebVitalsData) => {
        setMetrics(prev => ({ ...prev, ttfb: metric.value }));
        sendToAnalytics(metric);
      });
    };

    // Send metrics to analytics
    const sendToAnalytics = (metric: WebVitalsData) => {
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Custom analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metric: metric.name,
            value: metric.value,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType,
            timestamp: Date.now(),
            url: typeof window !== 'undefined' ? window.location.href : 'server',
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
          }),
        }).catch(console.error);
      }
    };

    // Performance observer for additional metrics
    const observePerformance = () => {
      if ('PerformanceObserver' in window) {
        // Long Task API
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', entry.duration + 'ms');
              sendToAnalytics({
                name: 'LONG_TASK',
                value: entry.duration,
                delta: entry.duration,
                id: entry.name,
                navigationType: 'navigate'
              });
            }
          }
        });

        try {
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          console.log('Long Task API not supported');
        }

        // Memory API
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          setMetrics(prev => ({
            ...prev,
            timestamp: Date.now()
          }));

          // Log memory usage
          console.log('Memory usage:', {
            used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
            total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
          });
        }
      }
    };

    // Initialize monitoring
    measureWebVitals();
    observePerformance();

    // Show performance panel in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    // Cleanup
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  // Performance score calculation
  const getPerformanceScore = () => {
    const scores = {
      lcp: metrics.lcp ? (metrics.lcp < 2500 ? 100 : metrics.lcp < 4000 ? 75 : 50) : 0,
      fid: metrics.fid ? (metrics.fid < 100 ? 100 : metrics.fid < 300 ? 75 : 50) : 0,
      cls: metrics.cls ? (metrics.cls < 0.1 ? 100 : metrics.cls < 0.25 ? 75 : 50) : 0,
    };

    const totalScore = Math.round((scores.lcp + scores.fid + scores.cls) / 3);
    return totalScore;
  };

  // Development performance panel
  if (process.env.NODE_ENV === 'development' && isVisible) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm">Performance Monitor</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={metrics.lcp && metrics.lcp < 2500 ? 'text-green-400' : 'text-yellow-400'}>
              {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={metrics.fid && metrics.fid < 100 ? 'text-green-400' : 'text-yellow-400'}>
              {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={metrics.cls && metrics.cls < 0.1 ? 'text-green-400' : 'text-yellow-400'}>
              {metrics.cls ? metrics.cls.toFixed(3) : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={metrics.fcp && metrics.fcp < 1800 ? 'text-green-400' : 'text-yellow-400'}>
              {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span className={metrics.ttfb && metrics.ttfb < 800 ? 'text-green-400' : 'text-yellow-400'}>
              {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'Loading...'}
            </span>
          </div>
          <div className="border-t border-gray-600 pt-1 mt-2">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className={`font-bold ${
                getPerformanceScore() >= 90 ? 'text-green-400' :
                getPerformanceScore() >= 75 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {getPerformanceScore()}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Hook for accessing performance metrics
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    timestamp: Date.now()
  });

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({ ...prev, timestamp: Date.now() }));
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export default PerformanceMonitor;
