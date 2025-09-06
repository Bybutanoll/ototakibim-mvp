// Enhanced Authentication service for OtoTakibim - Enterprise Grade
import { api, handleApiError } from './api';

// Enhanced Types for Multi-Factor Authentication
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  role?: 'owner' | 'admin' | 'technician' | 'customer';
  acceptTerms: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  role: 'owner' | 'admin' | 'technician' | 'customer';
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
  requiresMfa?: boolean;
  mfaToken?: string;
}

export interface MfaSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface SecurityLog {
  id: string;
  action: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export const enhancedAuthService = {
  // Basic Authentication
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens and user data
      localStorage.setItem('ototakibim_token', response.token);
      localStorage.setItem('ototakibim_refresh_token', response.refreshToken);
      localStorage.setItem('ototakibim_user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      
      // Store tokens and user data
      localStorage.setItem('ototakibim_token', response.token);
      localStorage.setItem('ototakibim_refresh_token', response.refreshToken);
      localStorage.setItem('ototakibim_user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('ototakibim_token');
      localStorage.removeItem('ototakibim_refresh_token');
      localStorage.removeItem('ototakibim_user');
    }
    return { message: 'Logged out successfully' };
  },

  // Multi-Factor Authentication
  setupMfa: async (): Promise<MfaSetup> => {
    try {
      const response = await api.post<MfaSetup>('/auth/mfa/setup');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  verifyMfaSetup: async (code: string): Promise<{ success: boolean; backupCodes: string[] }> => {
    try {
      const response = await api.post<{ success: boolean; backupCodes: string[] }>('/auth/mfa/verify-setup', { code });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  enableMfa: async (): Promise<{ success: boolean }> => {
    try {
      const response = await api.post<{ success: boolean }>('/auth/mfa/enable');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  disableMfa: async (password: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.post<{ success: boolean }>('/auth/mfa/disable', { password });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  verifyMfa: async (code: string, mfaToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/mfa/verify', { code, mfaToken });
      
      // Store tokens and user data
      localStorage.setItem('ototakibim_token', response.token);
      localStorage.setItem('ototakibim_refresh_token', response.refreshToken);
      localStorage.setItem('ototakibim_user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // SMS Authentication (Turkish Providers)
  sendSmsCode: async (phone: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/sms/send', { phone });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  verifySmsCode: async (phone: string, code: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.post<{ success: boolean }>('/auth/sms/verify', { phone, code });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Social Authentication
  googleAuth: async (): Promise<{ authUrl: string }> => {
    try {
      const response = await api.get<{ authUrl: string }>('/auth/google');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  googleCallback: async (code: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/google/callback', { code });
      
      // Store tokens and user data
      localStorage.setItem('ototakibim_token', response.token);
      localStorage.setItem('ototakibim_refresh_token', response.refreshToken);
      localStorage.setItem('ototakibim_user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Token Management
  refreshToken: async (): Promise<{ token: string; refreshToken: string }> => {
    try {
      const refreshToken = localStorage.getItem('ototakibim_refresh_token');
      const response = await api.post<{ token: string; refreshToken: string }>('/auth/refresh', { refreshToken });
      
      // Update stored tokens
      localStorage.setItem('ototakibim_token', response.token);
      localStorage.setItem('ototakibim_refresh_token', response.refreshToken);
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  verifyToken: async (token: string): Promise<{ user: User; valid: boolean }> => {
    try {
      const response = await api.post<{ user: User; valid: boolean }>('/auth/verify-token', { token });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // User Management
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/profile');
      
      // Update stored user data
      localStorage.setItem('ototakibim_user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<User>('/auth/profile', profileData);
      
      // Update stored user data
      localStorage.setItem('ototakibim_user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post<{ avatarUrl: string }>('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Password Management
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean }> => {
    try {
      const response = await api.put<{ success: boolean }>('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.post<{ success: boolean }>(`/auth/reset-password/${token}`, { newPassword });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Email Verification
  sendVerificationEmail: async (): Promise<{ success: boolean }> => {
    try {
      const response = await api.post<{ success: boolean }>('/auth/send-verification');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  verifyEmail: async (token: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.get<{ success: boolean }>(`/auth/verify-email/${token}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Security Features
  getActiveSessions: async (): Promise<SecuritySession[]> => {
    try {
      const response = await api.get<SecuritySession[]>('/auth/sessions');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  revokeSession: async (sessionId: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete<{ success: boolean }>(`/auth/sessions/${sessionId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  revokeAllSessions: async (): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete<{ success: boolean }>('/auth/sessions/all');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getSecurityLogs: async (page = 1, limit = 20): Promise<{
    logs: SecurityLog[];
    total: number;
    page: number;
    limit: number;
  }> => {
    try {
      const response = await api.get<{
        logs: SecurityLog[];
        total: number;
        page: number;
        limit: number;
      }>('/auth/security-logs', {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Role-based Access Control
  getPermissions: async (): Promise<Permission[]> => {
    try {
      const response = await api.get<Permission[]>('/auth/permissions');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  checkPermission: async (resource: string, action: string): Promise<{ allowed: boolean }> => {
    try {
      const response = await api.post<{ allowed: boolean }>('/auth/check-permission', { resource, action });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Utility Functions
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('ototakibim_token');
    return !!token;
  },

  getStoredUser: (): User | null => {
    try {
      const userData = localStorage.getItem('ototakibim_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('ototakibim_token');
  },

  clearAuthData: (): void => {
    localStorage.removeItem('ototakibim_token');
    localStorage.removeItem('ototakibim_refresh_token');
    localStorage.removeItem('ototakibim_user');
  },
};
