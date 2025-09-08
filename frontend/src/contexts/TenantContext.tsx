'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { tenantService, Tenant, TenantSettings } from '../services/tenantService';

export interface TenantState {
  currentTenant: Tenant | null;
  settings: TenantSettings | null;
  isLoading: boolean;
  error: string | null;
}

export interface TenantContextType {
  state: TenantState;
  currentTenant: Tenant | null;
  settings: TenantSettings | null;
  switchTenant: (tenantId: string) => Promise<void>;
  updateSettings: (settings: Partial<TenantSettings>) => Promise<void>;
  clearError: () => void;
}

// Action Types
type TenantAction =
  | { type: 'TENANT_START' }
  | { type: 'TENANT_SUCCESS'; payload: { tenant: Tenant; settings: TenantSettings } }
  | { type: 'TENANT_FAILURE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: TenantSettings }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: TenantState = {
  currentTenant: null,
  settings: null,
  isLoading: true,
  error: null,
};

// Reducer
function tenantReducer(state: TenantState, action: TenantAction): TenantState {
  switch (action.type) {
    case 'TENANT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'TENANT_SUCCESS':
      return {
        ...state,
        currentTenant: action.payload.tenant,
        settings: action.payload.settings,
        isLoading: false,
        error: null,
      };
    case 'TENANT_FAILURE':
      return {
        ...state,
        currentTenant: null,
        settings: null,
        isLoading: false,
        error: action.payload,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Context
const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Provider
export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tenantReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load tenant data when user is authenticated
  useEffect(() => {
    const loadTenantData = async () => {
      if (!isAuthenticated || !user) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        dispatch({ type: 'TENANT_START' });
        
        // Get tenant data from user's tenantId
        const tenant = await tenantService.getTenant(user.tenantId);
        const settings = await tenantService.getTenantSettings(user.tenantId);
        
        dispatch({ 
          type: 'TENANT_SUCCESS', 
          payload: { tenant, settings } 
        });
      } catch (error) {
        console.error('Tenant loading error:', error);
        dispatch({ 
          type: 'TENANT_FAILURE', 
          payload: error instanceof Error ? error.message : 'Tenant yüklenirken hata oluştu' 
        });
      }
    };

    loadTenantData();
  }, [isAuthenticated, user]);

  const switchTenant = async (tenantId: string) => {
    try {
      dispatch({ type: 'TENANT_START' });
      
      const tenant = await tenantService.getTenant(tenantId);
      const settings = await tenantService.getTenantSettings(tenantId);
      
      dispatch({ 
        type: 'TENANT_SUCCESS', 
        payload: { tenant, settings } 
      });
    } catch (error) {
      console.error('Tenant switch error:', error);
      dispatch({ 
        type: 'TENANT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Tenant değiştirilirken hata oluştu' 
      });
    }
  };

  const updateSettings = async (newSettings: Partial<TenantSettings>) => {
    if (!state.currentTenant) return;

    try {
      const updatedSettings = await tenantService.updateTenantSettings(
        state.currentTenant._id, 
        newSettings
      );
      
      dispatch({ 
        type: 'UPDATE_SETTINGS', 
        payload: updatedSettings 
      });
    } catch (error) {
      console.error('Settings update error:', error);
      dispatch({ 
        type: 'TENANT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Ayarlar güncellenirken hata oluştu' 
      });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: TenantContextType = {
    state,
    currentTenant: state.currentTenant,
    settings: state.settings,
    switchTenant,
    updateSettings,
    clearError,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

// Hook
export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
