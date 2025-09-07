// Production-ready API utility functions
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ototakibim-mvp.onrender.com/api';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: 'success' | 'error';
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Enhanced API call with timeout and error handling
export const apiCall = async <T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data,
      status: 'success'
    };
  } catch (error) {
    console.error('API çağrısı hatası:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
      }
      throw error;
    }
    
    throw new Error('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
  }
};

// GET request
export const apiGet = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, { method: 'GET' });
};

// POST request
export const apiPost = <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  });
};

// PUT request
export const apiPut = <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  });
};

// DELETE request
export const apiDelete = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiCall<T>(endpoint, { method: 'DELETE' });
};

// File upload
export const apiUpload = async <T = any>(
  endpoint: string, 
  file: File, 
  additionalData?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for uploads

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data,
      status: 'success'
    };
  } catch (error) {
    console.error('File upload hatası:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Dosya yükleme zaman aşımına uğradı. Lütfen tekrar deneyin.');
      }
      throw error;
    }
    
    throw new Error('Dosya yükleme sırasında hata oluştu. Lütfen tekrar deneyin.');
  }
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiGet('/health');
    return response.status === 'success';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Environment check
export const checkEnvironment = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log('🔧 Environment Check:');
  console.log('API URL:', apiUrl);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Is Production:', isProduction);
  
  return {
    apiUrl,
    isProduction,
    isConfigured: !!apiUrl
  };
};
