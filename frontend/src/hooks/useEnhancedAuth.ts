'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { enhancedAuthService, User, LoginCredentials, RegisterData, AuthResponse, MfaSetup } from '../services/enhancedAuthService';
import { useToast } from '../components/Toast';

// Auth Context Types
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  mfaRequired: boolean;
  mfaToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  
  // MFA Methods
  setupMfa: () => Promise<MfaSetup>;
  verifyMfaSetup: (code: string) => Promise<string[]>;
  enableMfa: () => Promise<void>;
  disableMfa: (password: string) => Promise<void>;
  verifyMfa: (code: string) => Promise<void>;
  
  // SMS Methods
  sendSmsCode: (phone: string) => Promise<void>;
  verifySmsCode: (phone: string, code: string) => Promise<void>;
  
  // Social Auth
  googleAuth: () => Promise<string>;
  
  // Profile Management
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  
  // Security
  getActiveSessions: () => Promise<any[]>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  
  // Permissions
  checkPermission: (resource: string, action: string) => Promise<boolean>;
  
  // Utility
  clearError: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    mfaRequired: false,
    mfaToken: null,
  });

  const { showToast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = enhancedAuthService.getStoredToken();
        const user = enhancedAuthService.getStoredUser();

        if (token && user) {
          // Verify token is still valid
          try {
            const verification = await enhancedAuthService.verifyToken(token);
            if (verification.valid) {
              setAuthState({
                user: verification.user,
                token,
                isAuthenticated: true,
                loading: false,
                error: null,
                mfaRequired: false,
                mfaToken: null,
              });
            } else {
              // Token invalid, try to refresh
              await refreshAuth();
            }
          } catch (error) {
            // Token verification failed, clear auth data
            enhancedAuthService.clearAuthData();
            setAuthState(prev => ({
              ...prev,
              loading: false,
              isAuthenticated: false,
            }));
          }
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Authentication initialization failed',
        }));
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.token) return;

    const refreshInterval = setInterval(async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [authState.isAuthenticated, authState.token]);

  // Refresh authentication
  const refreshAuth = useCallback(async () => {
    try {
      const { token, refreshToken } = await enhancedAuthService.refreshToken();
      const user = await enhancedAuthService.getProfile();
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
        mfaRequired: false,
        mfaToken: null,
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      enhancedAuthService.clearAuthData();
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
      }));
    }
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await enhancedAuthService.login(credentials);
      
      if (response.requiresMfa) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          mfaRequired: true,
          mfaToken: response.mfaToken || null,
        }));
        showToast('MFA kodu gönderildi', 'info');
      } else {
        setAuthState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          loading: false,
          error: null,
          mfaRequired: false,
          mfaToken: null,
        });
        showToast('Başarıyla giriş yapıldı', 'success');
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  // Register
  const register = useCallback(async (userData: RegisterData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await enhancedAuthService.register(userData);
      
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        mfaRequired: false,
        mfaToken: null,
      });
      
      showToast('Hesap başarıyla oluşturuldu', 'success');
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await enhancedAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        mfaRequired: false,
        mfaToken: null,
      });
      showToast('Başarıyla çıkış yapıldı', 'success');
    }
  }, [showToast]);

  // MFA Methods
  const setupMfa = useCallback(async (): Promise<MfaSetup> => {
    try {
      const setup = await enhancedAuthService.setupMfa();
      showToast('MFA kurulumu başlatıldı', 'info');
      return setup;
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const verifyMfaSetup = useCallback(async (code: string): Promise<string[]> => {
    try {
      const result = await enhancedAuthService.verifyMfaSetup(code);
      if (result.success) {
        showToast('MFA başarıyla etkinleştirildi', 'success');
        return result.backupCodes;
      } else {
        throw new Error('MFA doğrulama başarısız');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const enableMfa = useCallback(async () => {
    try {
      await enhancedAuthService.enableMfa();
      showToast('MFA etkinleştirildi', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const disableMfa = useCallback(async (password: string) => {
    try {
      await enhancedAuthService.disableMfa(password);
      showToast('MFA devre dışı bırakıldı', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const verifyMfa = useCallback(async (code: string) => {
    if (!authState.mfaToken) {
      throw new Error('MFA token bulunamadı');
    }

    try {
      const response = await enhancedAuthService.verifyMfa(code, authState.mfaToken);
      
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        mfaRequired: false,
        mfaToken: null,
      });
      
      showToast('MFA doğrulaması başarılı', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [authState.mfaToken, showToast]);

  // SMS Methods
  const sendSmsCode = useCallback(async (phone: string) => {
    try {
      const result = await enhancedAuthService.sendSmsCode(phone);
      if (result.success) {
        showToast('SMS kodu gönderildi', 'success');
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const verifySmsCode = useCallback(async (phone: string, code: string) => {
    try {
      const result = await enhancedAuthService.verifySmsCode(phone, code);
      if (result.success) {
        showToast('SMS doğrulaması başarılı', 'success');
      } else {
        throw new Error('SMS doğrulama başarısız');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  // Social Auth
  const googleAuth = useCallback(async (): Promise<string> => {
    try {
      const result = await enhancedAuthService.googleAuth();
      return result.authUrl;
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  // Profile Management
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const updatedUser = await enhancedAuthService.updateProfile(data);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      showToast('Profil güncellendi', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      const result = await enhancedAuthService.uploadAvatar(file);
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, avatar: result.avatarUrl } : null,
      }));
      showToast('Avatar güncellendi', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      await enhancedAuthService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      showToast('Şifre başarıyla değiştirildi', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  // Security
  const getActiveSessions = useCallback(async () => {
    try {
      return await enhancedAuthService.getActiveSessions();
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      await enhancedAuthService.revokeSession(sessionId);
      showToast('Oturum sonlandırıldı', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const revokeAllSessions = useCallback(async () => {
    try {
      await enhancedAuthService.revokeAllSessions();
      showToast('Tüm oturumlar sonlandırıldı', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  // Permissions
  const checkPermission = useCallback(async (resource: string, action: string): Promise<boolean> => {
    try {
      const result = await enhancedAuthService.checkPermission(resource, action);
      return result.allowed;
    } catch (error: any) {
      console.error('Permission check failed:', error);
      return false;
    }
  }, []);

  // Utility
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshAuth,
    setupMfa,
    verifyMfaSetup,
    enableMfa,
    disableMfa,
    verifyMfa,
    sendSmsCode,
    verifySmsCode,
    googleAuth,
    updateProfile,
    uploadAvatar,
    changePassword,
    getActiveSessions,
    revokeSession,
    revokeAllSessions,
    checkPermission,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useEnhancedAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useEnhancedAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: Array<{ resource: string; action: string }>
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading, user, checkPermission } = useEnhancedAuth();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
      if (isAuthenticated && requiredPermissions && user) {
        const checkAllPermissions = async () => {
          try {
            const results = await Promise.all(
              requiredPermissions.map(perm => checkPermission(perm.resource, perm.action))
            );
            setHasPermission(results.every(result => result));
          } catch (error) {
            setHasPermission(false);
          }
        };
        checkAllPermissions();
      } else if (!requiredPermissions) {
        setHasPermission(true);
      }
    }, [isAuthenticated, requiredPermissions, user, checkPermission]);

    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
    }

    if (!isAuthenticated) {
      return <div className="flex items-center justify-center min-h-screen">Giriş yapmanız gerekiyor</div>;
    }

    if (requiredPermissions && hasPermission === false) {
      return <div className="flex items-center justify-center min-h-screen">Bu sayfaya erişim yetkiniz yok</div>;
    }

    if (requiredPermissions && hasPermission === null) {
      return <div className="flex items-center justify-center min-h-screen">Yetkiler kontrol ediliyor...</div>;
    }

    return <Component {...props} />;
  };
};
