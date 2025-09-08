'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { usageMonitoringService, UsageStats, UsageAlert, UsageReport, UsageDashboard } from '../services/usageMonitoringService';

export interface UsageMonitoringState {
  stats: UsageStats | null;
  alerts: UsageAlert[];
  dashboard: UsageDashboard | null;
  report: UsageReport | null;
  isLoading: boolean;
  error: string | null;
}

export interface UsageMonitoringContextType {
  state: UsageMonitoringState;
  stats: UsageStats | null;
  alerts: UsageAlert[];
  dashboard: UsageDashboard | null;
  report: UsageReport | null;
  getUsageStats: (period?: 'day' | 'week' | 'month' | 'year') => Promise<void>;
  getUsageAlerts: () => Promise<void>;
  getUsageDashboard: () => Promise<void>;
  generateUsageReport: (period?: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  resetUsageCounters: () => Promise<void>;
  trackApiUsage: (data: {
    endpoint: string;
    method: string;
    userId?: string;
    responseTime?: number;
    statusCode?: number;
  }) => Promise<void>;
  clearError: () => void;
}

// Action Types
type UsageMonitoringAction =
  | { type: 'USAGE_START' }
  | { type: 'USAGE_SUCCESS'; payload: any }
  | { type: 'USAGE_FAILURE'; payload: string }
  | { type: 'SET_STATS'; payload: UsageStats }
  | { type: 'SET_ALERTS'; payload: UsageAlert[] }
  | { type: 'SET_DASHBOARD'; payload: UsageDashboard }
  | { type: 'SET_REPORT'; payload: UsageReport }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: UsageMonitoringState = {
  stats: null,
  alerts: [],
  dashboard: null,
  report: null,
  isLoading: true,
  error: null,
};

// Reducer
function usageMonitoringReducer(state: UsageMonitoringState, action: UsageMonitoringAction): UsageMonitoringState {
  switch (action.type) {
    case 'USAGE_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'USAGE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'USAGE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload,
        error: null,
      };
    case 'SET_ALERTS':
      return {
        ...state,
        alerts: action.payload,
        error: null,
      };
    case 'SET_DASHBOARD':
      return {
        ...state,
        dashboard: action.payload,
        error: null,
      };
    case 'SET_REPORT':
      return {
        ...state,
        report: action.payload,
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
const UsageMonitoringContext = createContext<UsageMonitoringContextType | undefined>(undefined);

// Provider
export const UsageMonitoringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(usageMonitoringReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load usage monitoring data when user is authenticated
  useEffect(() => {
    const loadUsageData = async () => {
      if (!isAuthenticated || !user) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        dispatch({ type: 'USAGE_START' });
        
        // Load dashboard data (includes stats and alerts)
        const dashboard = await usageMonitoringService.getUsageDashboard();
        
        dispatch({ type: 'SET_DASHBOARD', payload: dashboard });
        dispatch({ type: 'USAGE_SUCCESS', payload: dashboard });
      } catch (error) {
        console.error('Usage monitoring data loading error:', error);
        dispatch({ 
          type: 'USAGE_FAILURE', 
          payload: error instanceof Error ? error.message : 'Kullanım verileri yüklenirken hata oluştu' 
        });
      }
    };

    loadUsageData();
  }, [isAuthenticated, user]);

  const getUsageStats = async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    try {
      dispatch({ type: 'USAGE_START' });
      
      const stats = await usageMonitoringService.getUsageStats(period);
      dispatch({ type: 'SET_STATS', payload: stats });
      dispatch({ type: 'USAGE_SUCCESS', payload: stats });
    } catch (error) {
      console.error('Get usage stats error:', error);
      dispatch({ 
        type: 'USAGE_FAILURE', 
        payload: error instanceof Error ? error.message : 'Kullanım istatistikleri alınırken hata oluştu' 
      });
    }
  };

  const getUsageAlerts = async () => {
    try {
      const alerts = await usageMonitoringService.getUsageAlerts();
      dispatch({ type: 'SET_ALERTS', payload: alerts });
    } catch (error) {
      console.error('Get usage alerts error:', error);
      dispatch({ 
        type: 'USAGE_FAILURE', 
        payload: error instanceof Error ? error.message : 'Kullanım uyarıları alınırken hata oluştu' 
      });
    }
  };

  const getUsageDashboard = async () => {
    try {
      dispatch({ type: 'USAGE_START' });
      
      const dashboard = await usageMonitoringService.getUsageDashboard();
      dispatch({ type: 'SET_DASHBOARD', payload: dashboard });
      dispatch({ type: 'USAGE_SUCCESS', payload: dashboard });
    } catch (error) {
      console.error('Get usage dashboard error:', error);
      dispatch({ 
        type: 'USAGE_FAILURE', 
        payload: error instanceof Error ? error.message : 'Kullanım dashboard verileri alınırken hata oluştu' 
      });
    }
  };

  const generateUsageReport = async (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
    try {
      dispatch({ type: 'USAGE_START' });
      
      const report = await usageMonitoringService.generateUsageReport(period);
      dispatch({ type: 'SET_REPORT', payload: report });
      dispatch({ type: 'USAGE_SUCCESS', payload: report });
    } catch (error) {
      console.error('Generate usage report error:', error);
      dispatch({ 
        type: 'USAGE_FAILURE', 
        payload: error instanceof Error ? error.message : 'Kullanım raporu oluşturulurken hata oluştu' 
      });
    }
  };

  const resetUsageCounters = async () => {
    try {
      await usageMonitoringService.resetUsageCounters();
      // Refresh dashboard after reset
      await getUsageDashboard();
    } catch (error) {
      console.error('Reset usage counters error:', error);
      dispatch({ 
        type: 'USAGE_FAILURE', 
        payload: error instanceof Error ? error.message : 'Kullanım sayaçları sıfırlanırken hata oluştu' 
      });
    }
  };

  const trackApiUsage = async (data: {
    endpoint: string;
    method: string;
    userId?: string;
    responseTime?: number;
    statusCode?: number;
  }) => {
    try {
      await usageMonitoringService.trackApiUsage(data);
    } catch (error) {
      console.error('Track API usage error:', error);
      // Don't show error to user for tracking failures
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: UsageMonitoringContextType = {
    state,
    stats: state.stats,
    alerts: state.alerts,
    dashboard: state.dashboard,
    report: state.report,
    getUsageStats,
    getUsageAlerts,
    getUsageDashboard,
    generateUsageReport,
    resetUsageCounters,
    trackApiUsage,
    clearError,
  };

  return (
    <UsageMonitoringContext.Provider value={value}>
      {children}
    </UsageMonitoringContext.Provider>
  );
};

// Hook
export const useUsageMonitoring = (): UsageMonitoringContextType => {
  const context = useContext(UsageMonitoringContext);
  if (context === undefined) {
    throw new Error('useUsageMonitoring must be used within a UsageMonitoringProvider');
  }
  return context;
};
