'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface PaymentMethod {
  _id: string;
  type: 'card' | 'bank_account' | 'wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  planName: string;
  planType: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  nextBillingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  _id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaymentIntent {
  _id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
  paymentMethodId?: string;
  createdAt: string;
}

export interface PaymentState {
  paymentMethods: PaymentMethod[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  currentSubscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
}

export interface PaymentContextType {
  state: PaymentState;
  createPaymentMethod: (paymentMethodData: any) => Promise<PaymentMethod>;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => Promise<PaymentMethod>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  createSubscription: (planId: string, paymentMethodId: string) => Promise<Subscription>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  updateSubscription: (subscriptionId: string, data: Partial<Subscription>) => Promise<Subscription>;
  getPaymentMethods: () => Promise<void>;
  getSubscriptions: () => Promise<void>;
  getInvoices: () => Promise<void>;
  createPaymentIntent: (amount: number, currency: string) => Promise<PaymentIntent>;
  confirmPayment: (paymentIntentId: string, paymentMethodId: string) => Promise<void>;
  clearError: () => void;
}

// Action Types
type PaymentAction =
  | { type: 'PAYMENT_START' }
  | { type: 'PAYMENT_METHODS_LOAD_SUCCESS'; payload: PaymentMethod[] }
  | { type: 'PAYMENT_METHOD_ADD'; payload: PaymentMethod }
  | { type: 'PAYMENT_METHOD_UPDATE'; payload: PaymentMethod }
  | { type: 'PAYMENT_METHOD_DELETE'; payload: string }
  | { type: 'SUBSCRIPTIONS_LOAD_SUCCESS'; payload: Subscription[] }
  | { type: 'SUBSCRIPTION_ADD'; payload: Subscription }
  | { type: 'SUBSCRIPTION_UPDATE'; payload: Subscription }
  | { type: 'INVOICES_LOAD_SUCCESS'; payload: Invoice[] }
  | { type: 'PAYMENT_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: PaymentState = {
  paymentMethods: [],
  subscriptions: [],
  invoices: [],
  currentSubscription: null,
  isLoading: false,
  error: null,
};

// Reducer
function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'PAYMENT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'PAYMENT_METHODS_LOAD_SUCCESS':
      return {
        ...state,
        paymentMethods: action.payload,
        isLoading: false,
        error: null,
      };
    case 'PAYMENT_METHOD_ADD':
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
        isLoading: false,
        error: null,
      };
    case 'PAYMENT_METHOD_UPDATE':
      return {
        ...state,
        paymentMethods: state.paymentMethods.map(pm => 
          pm._id === action.payload._id ? action.payload : pm
        ),
        isLoading: false,
        error: null,
      };
    case 'PAYMENT_METHOD_DELETE':
      return {
        ...state,
        paymentMethods: state.paymentMethods.filter(pm => pm._id !== action.payload),
        isLoading: false,
        error: null,
      };
    case 'SUBSCRIPTIONS_LOAD_SUCCESS':
      return {
        ...state,
        subscriptions: action.payload,
        currentSubscription: action.payload.find(sub => sub.status === 'active') || null,
        isLoading: false,
        error: null,
      };
    case 'SUBSCRIPTION_ADD':
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload],
        currentSubscription: action.payload.status === 'active' ? action.payload : state.currentSubscription,
        isLoading: false,
        error: null,
      };
    case 'SUBSCRIPTION_UPDATE':
      return {
        ...state,
        subscriptions: state.subscriptions.map(sub => 
          sub._id === action.payload._id ? action.payload : sub
        ),
        currentSubscription: action.payload._id === state.currentSubscription?._id ? action.payload : state.currentSubscription,
        isLoading: false,
        error: null,
      };
    case 'INVOICES_LOAD_SUCCESS':
      return {
        ...state,
        invoices: action.payload,
        isLoading: false,
        error: null,
      };
    case 'PAYMENT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
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

// Create Context
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Payment Provider Component
export function PaymentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);
  const { state: authState } = useAuth();

  // Load payment data on mount
  useEffect(() => {
    if (authState.isAuthenticated) {
      getPaymentMethods();
      getSubscriptions();
      getInvoices();
    }
  }, [authState.isAuthenticated]);

  // Create payment method
  const createPaymentMethod = async (paymentMethodData: any): Promise<PaymentMethod> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentMethodData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment method creation failed');
      }

      dispatch({ type: 'PAYMENT_METHOD_ADD', payload: data });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment method creation failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Update payment method
  const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/methods/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const updatedData = await response.json();

      if (!response.ok) {
        throw new Error(updatedData.message || 'Payment method update failed');
      }

      dispatch({ type: 'PAYMENT_METHOD_UPDATE', payload: updatedData });
      return updatedData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment method update failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Delete payment method
  const deletePaymentMethod = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/methods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment method deletion failed');
      }

      dispatch({ type: 'PAYMENT_METHOD_DELETE', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment method deletion failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Set default payment method
  const setDefaultPaymentMethod = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/methods/${id}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Setting default payment method failed');
      }

      // Update local state
      const updatedMethods = state.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm._id === id
      }));
      dispatch({ type: 'PAYMENT_METHODS_LOAD_SUCCESS', payload: updatedMethods });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Setting default payment method failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Create subscription
  const createSubscription = async (planId: string, paymentMethodId: string): Promise<Subscription> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, paymentMethodId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription creation failed');
      }

      dispatch({ type: 'SUBSCRIPTION_ADD', payload: data });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription creation failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Cancel subscription
  const cancelSubscription = async (subscriptionId: string): Promise<void> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/subscriptions/${subscriptionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Subscription cancellation failed');
      }

      // Update local state
      const updatedSubscription = state.subscriptions.find(sub => sub._id === subscriptionId);
      if (updatedSubscription) {
        const cancelledSubscription = { ...updatedSubscription, status: 'cancelled' as const };
        dispatch({ type: 'SUBSCRIPTION_UPDATE', payload: cancelledSubscription });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription cancellation failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Update subscription
  const updateSubscription = async (subscriptionId: string, data: Partial<Subscription>): Promise<Subscription> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const updatedData = await response.json();

      if (!response.ok) {
        throw new Error(updatedData.message || 'Subscription update failed');
      }

      dispatch({ type: 'SUBSCRIPTION_UPDATE', payload: updatedData });
      return updatedData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription update failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Get payment methods
  const getPaymentMethods = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/methods`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const paymentMethods = await response.json();
      dispatch({ type: 'PAYMENT_METHODS_LOAD_SUCCESS', payload: paymentMethods });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment methods';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
    }
  };

  // Get subscriptions
  const getSubscriptions = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const subscriptions = await response.json();
      dispatch({ type: 'SUBSCRIPTIONS_LOAD_SUCCESS', payload: subscriptions });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscriptions';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
    }
  };

  // Get invoices
  const getInvoices = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/invoices`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const invoices = await response.json();
      dispatch({ type: 'INVOICES_LOAD_SUCCESS', payload: invoices });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invoices';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
    }
  };

  // Create payment intent
  const createPaymentIntent = async (amount: number, currency: string): Promise<PaymentIntent> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/intents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment intent creation failed');
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment intent creation failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Confirm payment
  const confirmPayment = async (paymentIntentId: string, paymentMethodId: string): Promise<void> => {
    try {
      dispatch({ type: 'PAYMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/payments/intents/${paymentIntentId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment confirmation failed');
      }

      // Refresh payment data
      await getPaymentMethods();
      await getInvoices();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment confirmation failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: PaymentContextType = {
    state,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    createSubscription,
    cancelSubscription,
    updateSubscription,
    getPaymentMethods,
    getSubscriptions,
    getInvoices,
    createPaymentIntent,
    confirmPayment,
    clearError,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

// Custom hook to use payment context
export function usePayment(): PaymentContextType {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Convert from cents
};

export const getSubscriptionStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'past_due':
      return 'text-yellow-600 bg-yellow-100';
    case 'unpaid':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getSubscriptionStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Aktif';
    case 'cancelled':
      return 'İptal Edildi';
    case 'past_due':
      return 'Gecikmiş';
    case 'unpaid':
      return 'Ödenmemiş';
    default:
      return 'Bilinmiyor';
  }
};

export const getInvoiceStatusColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'open':
      return 'text-blue-600 bg-blue-100';
    case 'draft':
      return 'text-gray-600 bg-gray-100';
    case 'uncollectible':
      return 'text-red-600 bg-red-100';
    case 'void':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getInvoiceStatusText = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'Ödendi';
    case 'open':
      return 'Açık';
    case 'draft':
      return 'Taslak';
    case 'uncollectible':
      return 'Tahsil Edilemez';
    case 'void':
      return 'Geçersiz';
    default:
      return 'Bilinmiyor';
  }
};
