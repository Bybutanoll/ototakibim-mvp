// Logo interaction analytics for production monitoring

interface AnalyticsEvent {
  event_category: string;
  event_label?: string;
  custom_parameter?: number | string;
  value?: number;
}

// Google Analytics 4 integration
export const trackLogoEvent = (eventName: string, parameters: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: parameters.event_category,
      event_label: parameters.event_label,
      custom_parameter: parameters.custom_parameter,
      value: parameters.value
    });
  }
};

// Logo animation completion tracking
export const trackLogoAnimationComplete = (section: string) => {
  trackLogoEvent('logo_animation_complete', {
    event_category: 'engagement',
    event_label: section
  });
};

// Logo hover interaction tracking
export const trackLogoHover = () => {
  trackLogoEvent('logo_hover', {
    event_category: 'interaction'
  });
};

// Logo click tracking
export const trackLogoClick = (destination: string) => {
  trackLogoEvent('logo_click', {
    event_category: 'navigation',
    event_label: destination
  });
};

// Particle system performance tracking
export const trackParticlePerformance = (particleCount: number, fps: number) => {
  trackLogoEvent('particle_performance', {
    event_category: 'performance',
    custom_parameter: `${particleCount}_particles_${fps}fps`
  });
};

// Animation performance monitoring
export const trackAnimationPerformance = (animationName: string, duration: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'animation_performance', {
      event_category: 'performance',
      event_label: animationName,
      value: Math.round(duration)
    });
  }
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (typeof window !== 'undefined' && (performance as any).memory) {
    const memoryInfo = (performance as any).memory;
    const memoryUsage = Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100);
    
    trackLogoEvent('memory_usage', {
      event_category: 'performance',
      custom_parameter: `${memoryUsage}%`
    });
  }
};

// Device capability tracking
export const trackDeviceCapabilities = () => {
  const capabilities = {
    webgl: !!(document.createElement('canvas').getContext('webgl')),
    css3d: 'transform-style' in document.body.style,
    intersectionObserver: 'IntersectionObserver' in window,
    memory: (navigator as any).deviceMemory || 'unknown',
    connection: (navigator as any).connection?.effectiveType || 'unknown'
  };

  trackLogoEvent('device_capabilities', {
    event_category: 'technical',
    custom_parameter: JSON.stringify(capabilities)
  });
};

// Performance Observer for animation tracking
export const initPerformanceObserver = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name.includes('logo-animation') || entry.name.includes('particle')) {
          trackAnimationPerformance(entry.name, entry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    return observer;
  }
  return null;
};

// User engagement metrics
export const trackUserEngagement = (action: string, duration?: number) => {
  trackLogoEvent('user_engagement', {
    event_category: 'engagement',
    event_label: action,
    value: duration ? Math.round(duration) : undefined
  });
};

// Error tracking
export const trackLogoError = (error: string, context: string) => {
  trackLogoEvent('logo_error', {
    event_category: 'error',
    event_label: context,
    custom_parameter: error
  });
};

// A/B testing support
export const trackABTest = (testName: string, variant: string) => {
  trackLogoEvent('ab_test', {
    event_category: 'experiment',
    event_label: testName,
    custom_parameter: variant
  });
};

// Export all tracking functions
export const logoAnalytics = {
  trackLogoEvent,
  trackLogoAnimationComplete,
  trackLogoHover,
  trackLogoClick,
  trackParticlePerformance,
  trackAnimationPerformance,
  trackMemoryUsage,
  trackDeviceCapabilities,
  initPerformanceObserver,
  trackUserEngagement,
  trackLogoError,
  trackABTest
};
