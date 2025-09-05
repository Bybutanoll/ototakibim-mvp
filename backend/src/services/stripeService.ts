import Stripe from 'stripe';

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-08-27.basil',
});

export interface CreateSubscriptionData {
  customerId: string;
  priceId: string;
  paymentMethodId: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

// OtoTakibim subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    currency: 'TRY',
    interval: 'month',
    features: [
      '1 lokasyon',
      '100 müşteriye kadar',
      'Temel özellikler',
      'Email destek'
    ],
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 599,
    currency: 'TRY',
    interval: 'month',
    features: [
      '2 lokasyon',
      '500 müşteriye kadar',
      'AI özellikleri',
      'Telefon destek',
      'Entegrasyonlar'
    ],
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    currency: 'TRY',
    interval: 'month',
    features: [
      'Sınırsız lokasyon',
      'Sınırsız müşteri',
      'Özel özellikler',
      'Öncelikli destek',
      'API erişimi'
    ],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise'
  }
];

export class StripeService {
  /**
   * Create a new customer
   */
  static async createCustomer(email: string, name: string, userId: string) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId: userId
        }
      });
      
      return customer;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new Error('Customer creation failed');
    }
  }

  /**
   * Create a payment method
   */
  static async createPaymentMethod(cardToken: string) {
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: cardToken
        }
      });
      
      return paymentMethod;
    } catch (error) {
      console.error('Stripe payment method creation error:', error);
      throw new Error('Payment method creation failed');
    }
  }

  /**
   * Attach payment method to customer
   */
  static async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
      
      return paymentMethod;
    } catch (error) {
      console.error('Stripe payment method attach error:', error);
      throw new Error('Payment method attachment failed');
    }
  }

  /**
   * Create a subscription
   */
  static async createSubscription(data: CreateSubscriptionData) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: data.customerId,
        items: [
          {
            price: data.priceId
          }
        ],
        default_payment_method: data.paymentMethodId,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent']
      });
      
      return subscription;
    } catch (error) {
      console.error('Stripe subscription creation error:', error);
      throw new Error('Subscription creation failed');
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Stripe subscription cancellation error:', error);
      throw new Error('Subscription cancellation failed');
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Stripe subscription retrieval error:', error);
      throw new Error('Subscription retrieval failed');
    }
  }

  /**
   * Get customer subscriptions
   */
  static async getCustomerSubscriptions(customerId: string) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all'
      });
      
      return subscriptions.data;
    } catch (error) {
      console.error('Stripe customer subscriptions error:', error);
      throw new Error('Customer subscriptions retrieval failed');
    }
  }

  /**
   * Create payment intent for one-time payments
   */
  static async createPaymentIntent(amount: number, currency: string, customerId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        automatic_payment_methods: {
          enabled: true
        }
      });
      
      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error('Payment intent creation failed');
    }
  }

  /**
   * Handle webhook events
   */
  static async handleWebhook(payload: string, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
      
      return event;
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw new Error('Webhook verification failed');
    }
  }
}

export default StripeService;
