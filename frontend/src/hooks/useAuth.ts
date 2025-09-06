// Authentication hook for OtoTakibim
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { authService, User, LoginCredentials, RegisterCredentials } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getStoredToken();
        const user = authService.getStoredUser();

        if (token && user) {
          // Verify token with backend
          try {
            const verifiedUser = await authService.getProfile();
            setState({
              user: verifiedUser,
              token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error) {
            // Token is invalid, clear storage
            authService.clearAuthData();
            setState({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: 'Authentication initialization failed',
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await authService.login(credentials);

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await authService.register(credentials);

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Registration failed',
      }));
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (userData: Partial<User>): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedUser = await authService.updateProfile(userData);

      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Profile update failed',
      }));
      throw error;
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await authService.changePassword(currentPassword, newPassword);

      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Password change failed',
      }));
      throw error;
    }
  }, []);

  // Forgot password function
  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await authService.forgotPassword(email);

      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Password reset request failed',
      }));
      throw error;
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await authService.resetPassword(token, newPassword);

      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Password reset failed',
      }));
      throw error;
    }
  }, []);

  // Verify email function
  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await authService.verifyEmail(token);

      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Email verification failed',
      }));
      throw error;
    }
  }, []);

  // Resend verification function
  const resendVerification = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await authService.resendVerification();

      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Resend verification failed',
      }));
      throw error;
    }
  }, []);

  // Clear error function
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh user function
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      if (state.isAuthenticated) {
        const user = await authService.getProfile();
        setState(prev => ({ ...prev, user }));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, [state.isAuthenticated]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <Component {...props} />;
  };
};
