'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import subscriptionService, { SubscriptionInfo, SubscriptionPlan } from '../services/subscriptionService';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: SubscriptionInfo | null;
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  checkLimit: (type: 'workOrders' | 'users' | 'storage' | 'apiCalls', amount?: number) => Promise<boolean>;
  hasFeature: (feature: string) => Promise<boolean>;
  changePlan: (plan: 'starter' | 'professional' | 'enterprise') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  extendTrial: (days?: number) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const refreshSubscription = async () => {
    // Sadece authenticated kullanıcılar için API çağrısı yap
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [subscriptionData, plansData] = await Promise.all([
        subscriptionService.getUsage(),
        subscriptionService.getPlans()
      ]);
      
      setSubscription(subscriptionData);
      setPlans(plansData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Abonelik bilgileri alınırken hata oluştu');
      console.error('Subscription refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkLimit = async (type: 'workOrders' | 'users' | 'storage' | 'apiCalls', amount: number = 1): Promise<boolean> => {
    try {
      return await subscriptionService.checkLimit(type, amount);
    } catch (err) {
      console.error('Limit check error:', err);
      return false;
    }
  };

  const hasFeature = async (feature: string): Promise<boolean> => {
    try {
      return await subscriptionService.hasFeature(feature);
    } catch (err) {
      console.error('Feature check error:', err);
      return false;
    }
  };

  const changePlan = async (plan: 'starter' | 'professional' | 'enterprise'): Promise<void> => {
    try {
      await subscriptionService.changePlan(plan);
      await refreshSubscription();
    } catch (err) {
      throw err;
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    try {
      await subscriptionService.cancelSubscription();
      await refreshSubscription();
    } catch (err) {
      throw err;
    }
  };

  const extendTrial = async (days: number = 7): Promise<void> => {
    try {
      await subscriptionService.extendTrial(days);
      await refreshSubscription();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, []);

  const value: SubscriptionContextType = {
    subscription,
    plans,
    loading,
    error,
    refreshSubscription,
    checkLimit,
    hasFeature,
    changePlan,
    cancelSubscription,
    extendTrial
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
