// Production-ready API service layer for OtoTakibim
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base configuration - Development için localhost, production için render
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://ototakibim-mvp.onrender.com/api');

// Backend discovery for development
const discoverBackend = async (): Promise<string> => {
  if (process.env.NODE_ENV !== 'development') {
    return API_BASE_URL;
  }

  const ports = [5000, 5001, 5002, 5003];
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(1000)
      });
      if (response.ok) {
        console.log(`✅ Backend bulundu: http://localhost:${port}`);
        return `http://localhost:${port}/api`;
      }
    } catch (error) {
      continue;
    }
  }
  
  console.warn('⚠️ Backend bulunamadı! Varsayılan port kullanılıyor.');
  return API_BASE_URL;
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry helper function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (!config || !config.retry) {
      config.retry = 0;
    }
    
    if (config.retry < MAX_RETRIES && (
      !error.response || 
      error.response.status >= 500 || 
      error.code === 'NETWORK_ERROR' ||
      error.code === 'ECONNABORTED'
    )) {
      config.retry += 1;
      await sleep(RETRY_DELAY * Math.pow(2, config.retry - 1));
      return apiClient(config);
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('ototakibim_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('ototakibim_token');
      localStorage.removeItem('ototakibim_user');
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then(response => response.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then(response => response.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then(response => response.data),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then(response => response.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then(response => response.data),
};

// File upload helper
export const uploadFile = async (file: File, endpoint: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data);
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
};

export default apiClient;
