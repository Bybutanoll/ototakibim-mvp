// Frontend Environment Check ve Backend Discovery
const getBackendUrl = async (): Promise<string> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost';
  const ports = [5000, 5001, 5002, 5003];
  
  // Development'ta backend discovery
  if (process.env.NODE_ENV === 'development') {
    for (const port of ports) {
      try {
        const response = await fetch(`${baseUrl}:${port}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(1000) // 1 saniye timeout
        });
        if (response.ok) {
          console.log(`✅ Backend bulundu: ${baseUrl}:${port}`);
          return `${baseUrl}:${port}/api`;
        }
      } catch (error) {
        // Port mevcut değil, devam et
        continue;
      }
    }
    
    console.warn('⚠️ Backend bulunamadı! Varsayılan port kullanılıyor.');
  }
  
  // Production veya backend bulunamadığında varsayılan
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
};

// Backend URL'i cache'le
let cachedBackendUrl: string | null = null;

export const getAPIBaseURL = async (): Promise<string> => {
  if (cachedBackendUrl) {
    return cachedBackendUrl;
  }
  
  cachedBackendUrl = await getBackendUrl();
  return cachedBackendUrl;
};

// Sync version for immediate use
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Backend health check
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const baseUrl = await getAPIBaseURL();
    const response = await fetch(`${baseUrl.replace('/api', '')}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Configuration object
export const CONFIG = {
  API_BASE_URL: API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Feature flags
  FEATURES: {
    PWA: true,
    OFFLINE_MODE: true,
    AI_ASSISTANT: true,
    BLOCKCHAIN: false,
    AR_VR: false
  },
  
  // API endpoints
  ENDPOINTS: {
    AUTH: '/auth',
    VEHICLES: '/vehicles',
    CUSTOMERS: '/customers',
    WORK_ORDERS: '/work-orders',
    APPOINTMENTS: '/appointments',
    PAYMENTS: '/payments',
    SUBSCRIPTION: '/subscription',
    HEALTH: '/health'
  }
};
