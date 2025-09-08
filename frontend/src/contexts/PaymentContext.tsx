'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { paymentService, PaymentMethod, Subscription, Invoice, Product, Price } from '../services/paymentService';

export interface PaymentState {
  customer: any | null;
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  products: Product[];
  prices: Price[];
  isLoading: boolean;
  error: string | null;
}

export interface PaymentContextType {
  state: PaymentState;
  customer: any | null;
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  products: Product[];
  prices: Price[];
  createCustomer: (data: { email: string; name: string }) => Promise<void>;
  createSubscription: (priceId: string, trialPeriodDays?: number) => Promise<void>;
  updateSubscription: (data: { priceId?: string; quantity?: number }) => Promise<void>;
  cancelSubscription: (immediately?: boolean) => Promise<void>;
  getPaymentMethods: () => Promise<void>;
  createSetupIntent: () => Promise<{ clientSecret: string; id: string }>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  deletePaymentMethod: (paymentMethodId: string) => Promise<void>;
  getInvoices: (limit?: number) => Promise<void>;
  getProducts: () => Promise<void>;
  getPrices: () => Promise<void>;
  clearError: () => void;
}

// Action Types
type PaymentAction =
  | { type: 'PAYMENT_START' }
  | { type: 'PAYMENT_SUCCESS'; payload: any }
  | { type: 'PAYMENT_FAILURE'; payload: string }
  | { type: 'SET_CUSTOMER'; payload: any }
  | { type: 'SET_SUBSCRIPTION'; payload: Subscription }
  | { type: 'SET_PAYMENT_METHODS'; payload: PaymentMethod[] }
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_PRICES'; payload: Price[] }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: PaymentState = {
  customer: null,
  subscription: null,
  paymentMethods: [],
  invoices: [],
  products: [],
  prices: [],
  isLoading: true,
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
    case 'PAYMENT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'PAYMENT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_CUSTOMER':
      return {
        ...state,
        customer: action.payload,
        error: null,
      };
    case 'SET_SUBSCRIPTION':
      return {
        ...state,
        subscription: action.payload,
        error: null,
      };
    case 'SET_PAYMENT_METHODS':
      return {
        ...state,
        paymentMethods: action.payload,
        error: null,
      };
    case 'SET_INVOICES':
      return {
        ...state,
        invoices: action.payload,
        error: null,
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        error: null,
      };
    case 'SET_PRICES':
      return {
        ...state,
        prices: action.payload,
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
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Provider
export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load payment data when user is authenticated
  useEffect(() => {
    const loadPaymentData = async () => {
      if (!isAuthenticated || !user) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        dispatch({ type: 'PAYMENT_START' });
        
        // Load customer, subscription, payment methods, and invoices in parallel
        const [customerData, subscriptionData, paymentMethodsData, invoicesData, productsData, pricesData] = await Promise.allSettled([
          paymentService.getCustomer(),
          paymentService.getSubscription(),
          paymentService.getPaymentMethods(),
          paymentService.getInvoices(5),
          paymentService.getProducts(),
          paymentService.getPrices()
        ]);

        // Handle customer data
        if (customerData.status === 'fulfilled') {
          dispatch({ type: 'SET_CUSTOMER', payload: customerData.value });
        }

        // Handle subscription data
        if (subscriptionData.status === 'fulfilled') {
          dispatch({ type: 'SET_SUBSCRIPTION', payload: subscriptionData.value });
        }

        // Handle payment methods data
        if (paymentMethodsData.status === 'fulfilled') {
          dispatch({ type: 'SET_PAYMENT_METHODS', payload: paymentMethodsData.value });
        }

        // Handle invoices data
        if (invoicesData.status === 'fulfilled') {
          dispatch({ type: 'SET_INVOICES', payload: invoicesData.value });
        }

        // Handle products data
        if (productsData.status === 'fulfilled') {
          dispatch({ type: 'SET_PRODUCTS', payload: productsData.value });
        }

        // Handle prices data
        if (pricesData.status === 'fulfilled') {
          dispatch({ type: 'SET_PRICES', payload: pricesData.value });
        }

        dispatch({ type: 'PAYMENT_SUCCESS', payload: null });
      } catch (error) {
        console.error('Payment data loading error:', error);
        dispatch({ 
          type: 'PAYMENT_FAILURE', 
          payload: error instanceof Error ? error.message : 'Ödeme verileri yüklenirken hata oluştu' 
        });
      }
    };

    loadPaymentData();
  }, [isAuthenticated, user]);

  const createCustomer = async (data: { email: string; name: string }) => {
    try {
      dispatch({ type: 'PAYMENT_START' });
      
      const customer = await paymentService.createCustomer(data);
      dispatch({ type: 'SET_CUSTOMER', payload: customer });
      dispatch({ type: 'PAYMENT_SUCCESS', payload: customer });
    } catch (error) {
      console.error('Create customer error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Müşteri oluşturulurken hata oluştu' 
      });
    }
  };

  const createSubscription = async (priceId: string, trialPeriodDays?: number) => {
    try {
      dispatch({ type: 'PAYMENT_START' });
      
      const subscription = await paymentService.createSubscription({ priceId, trialPeriodDays });
      dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
      dispatch({ type: 'PAYMENT_SUCCESS', payload: subscription });
    } catch (error) {
      console.error('Create subscription error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Abonelik oluşturulurken hata oluştu' 
      });
    }
  };

  const updateSubscription = async (data: { priceId?: string; quantity?: number }) => {
    try {
      dispatch({ type: 'PAYMENT_START' });
      
      const subscription = await paymentService.updateSubscription(data);
      dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
      dispatch({ type: 'PAYMENT_SUCCESS', payload: subscription });
    } catch (error) {
      console.error('Update subscription error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Abonelik güncellenirken hata oluştu' 
      });
    }
  };

  const cancelSubscription = async (immediately: boolean = false) => {
    try {
      dispatch({ type: 'PAYMENT_START' });
      
      const subscription = await paymentService.cancelSubscription(immediately);
      dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
      dispatch({ type: 'PAYMENT_SUCCESS', payload: subscription });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Abonelik iptal edilirken hata oluştu' 
      });
    }
  };

  const getPaymentMethods = async () => {
    try {
      const paymentMethods = await paymentService.getPaymentMethods();
      dispatch({ type: 'SET_PAYMENT_METHODS', payload: paymentMethods });
    } catch (error) {
      console.error('Get payment methods error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Ödeme yöntemleri alınırken hata oluştu' 
      });
    }
  };

  const createSetupIntent = async () => {
    try {
      return await paymentService.createSetupIntent();
    } catch (error) {
      console.error('Create setup intent error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Setup intent oluşturulurken hata oluştu' 
      });
      throw error;
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await paymentService.setDefaultPaymentMethod(paymentMethodId);
      await getPaymentMethods(); // Refresh payment methods
    } catch (error) {
      console.error('Set default payment method error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Varsayılan ödeme yöntemi ayarlanırken hata oluştu' 
      });
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await paymentService.deletePaymentMethod(paymentMethodId);
      await getPaymentMethods(); // Refresh payment methods
    } catch (error) {
      console.error('Delete payment method error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Ödeme yöntemi silinirken hata oluştu' 
      });
    }
  };

  const getInvoices = async (limit: number = 10) => {
    try {
      const invoices = await paymentService.getInvoices(limit);
      dispatch({ type: 'SET_INVOICES', payload: invoices });
    } catch (error) {
      console.error('Get invoices error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Faturalar alınırken hata oluştu' 
      });
    }
  };

  const getProducts = async () => {
    try {
      const products = await paymentService.getProducts();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      console.error('Get products error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Ürünler alınırken hata oluştu' 
      });
    }
  };

  const getPrices = async () => {
    try {
      const prices = await paymentService.getPrices();
      dispatch({ type: 'SET_PRICES', payload: prices });
    } catch (error) {
      console.error('Get prices error:', error);
      dispatch({ 
        type: 'PAYMENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Fiyatlar alınırken hata oluştu' 
      });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: PaymentContextType = {
    state,
    customer: state.customer,
    subscription: state.subscription,
    paymentMethods: state.paymentMethods,
    invoices: state.invoices,
    products: state.products,
    prices: state.prices,
    createCustomer,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getPaymentMethods,
    createSetupIntent,
    setDefaultPaymentMethod,
    deletePaymentMethod,
    getInvoices,
    getProducts,
    getPrices,
    clearError,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Hook
export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};