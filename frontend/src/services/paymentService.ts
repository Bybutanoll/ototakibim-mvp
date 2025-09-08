import { loadStripe, Stripe } from '@stripe/stripe-js';
import { apiClient } from './apiClient';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface CreateCustomerData {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionData {
  priceId: string;
  trialPeriodDays?: number;
}

export interface UpdateSubscriptionData {
  priceId?: string;
  quantity?: number;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  created: number;
}

export interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  trialStart?: number;
  trialEnd?: number;
  cancelAtPeriodEnd: boolean;
  items: Array<{
    id: string;
    price: any;
    quantity: number;
  }>;
}

export interface Invoice {
  id: string;
  number: string;
  status: string;
  amountPaid: number;
  amountDue: number;
  currency: string;
  created: number;
  dueDate?: number;
  paidAt?: number;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  images: string[];
  metadata: Record<string, string>;
  defaultPrice?: any;
}

export interface Price {
  id: string;
  product: any;
  unitAmount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    intervalCount: number;
  };
  metadata: Record<string, string>;
}

class PaymentService {
  private baseUrl = '/api/stripe';

  // Customer Management
  async createCustomer(data: CreateCustomerData) {
    const response = await apiClient.post(`${this.baseUrl}/customer`, data);
    return response.data;
  }

  async getCustomer() {
    const response = await apiClient.get(`${this.baseUrl}/customer`);
    return response.data;
  }

  // Products and Prices
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get(`${this.baseUrl}/products`);
    return response.data;
  }

  async getPrices(): Promise<Price[]> {
    const response = await apiClient.get(`${this.baseUrl}/prices`);
    return response.data;
  }

  // Subscription Management
  async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    const response = await apiClient.post(`${this.baseUrl}/subscription`, data);
    return response.data;
  }

  async getSubscription(): Promise<Subscription> {
    const response = await apiClient.get(`${this.baseUrl}/subscription`);
    return response.data;
  }

  async updateSubscription(data: UpdateSubscriptionData): Promise<Subscription> {
    const response = await apiClient.put(`${this.baseUrl}/subscription`, data);
    return response.data;
  }

  async cancelSubscription(immediately: boolean = false): Promise<Subscription> {
    const response = await apiClient.delete(`${this.baseUrl}/subscription`, {
      data: { immediately }
    });
    return response.data;
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get(`${this.baseUrl}/payment-methods`);
    return response.data;
  }

  async createSetupIntent(): Promise<{ clientSecret: string; id: string }> {
    const response = await apiClient.post(`${this.baseUrl}/setup-intent`);
    return response.data;
  }

  async setDefaultPaymentMethod(paymentMethodId: string) {
    const response = await apiClient.post(`${this.baseUrl}/payment-methods/default`, {
      paymentMethodId
    });
    return response.data;
  }

  async deletePaymentMethod(paymentMethodId: string) {
    const response = await apiClient.delete(`${this.baseUrl}/payment-methods/${paymentMethodId}`);
    return response.data;
  }

  // Invoices
  async getInvoices(limit: number = 10): Promise<Invoice[]> {
    const response = await apiClient.get(`${this.baseUrl}/invoices?limit=${limit}`);
    return response.data;
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await apiClient.get(`${this.baseUrl}/invoices/${invoiceId}`);
    return response.data;
  }

  // Stripe Elements Integration
  async createPaymentElement(customerId: string) {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe yüklenemedi');
    }

    const { clientSecret } = await this.createSetupIntent();

    return stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      },
    });
  }

  async confirmPayment(paymentElement: any, returnUrl?: string) {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe yüklenemedi');
    }

    const { error } = await stripe.confirmPayment({
      elements: paymentElement,
      confirmParams: {
        return_url: returnUrl || window.location.origin + '/payment/success',
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async confirmSetup(paymentElement: any, returnUrl?: string) {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe yüklenemedi');
    }

    const { error } = await stripe.confirmSetup({
      elements: paymentElement,
      confirmParams: {
        return_url: returnUrl || window.location.origin + '/payment/success',
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Utility Methods
  formatAmount(amount: number, currency: string = 'try'): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('tr-TR');
  }

  getStatusColor(status: string): string {
    const colors = {
      active: 'text-green-600 bg-green-100',
      trialing: 'text-blue-600 bg-blue-100',
      past_due: 'text-yellow-600 bg-yellow-100',
      canceled: 'text-red-600 bg-red-100',
      unpaid: 'text-red-600 bg-red-100',
      incomplete: 'text-gray-600 bg-gray-100',
      incomplete_expired: 'text-gray-600 bg-gray-100',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  }

  getStatusText(status: string): string {
    const texts = {
      active: 'Aktif',
      trialing: 'Deneme',
      past_due: 'Gecikmiş',
      canceled: 'İptal Edildi',
      unpaid: 'Ödenmedi',
      incomplete: 'Eksik',
      incomplete_expired: 'Süresi Dolmuş',
    };
    return texts[status as keyof typeof texts] || status;
  }
}

export const paymentService = new PaymentService();
