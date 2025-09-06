// Authentication service for OtoTakibim
import { api, handleApiError } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  company?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: 'admin' | 'manager' | 'technician' | 'customer';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Store token and user data
      localStorage.setItem('ototakibim_token', response.token);
      localStorage.setItem('ototakibim_user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Register new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      
      // Store token and user data
      localStorage.setItem('ototakibim_token', response.token);
      localStorage.setItem('ototakibim_user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('ototakibim_token');
      localStorage.removeItem('ototakibim_user');
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/me');
      
      // Update stored user data
      localStorage.setItem('ototakibim_user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<User>('/auth/profile', userData);
      
      // Update stored user data
      localStorage.setItem('ototakibim_user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Resend verification email
  resendVerification: async (): Promise<void> => {
    try {
      await api.post('/auth/resend-verification');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('ototakibim_token');
    return !!token;
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    try {
      const userData = localStorage.getItem('ototakibim_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: (): string | null => {
    return localStorage.getItem('ototakibim_token');
  },

  // Clear all auth data
  clearAuthData: (): void => {
    localStorage.removeItem('ototakibim_token');
    localStorage.removeItem('ototakibim_user');
  },
};
