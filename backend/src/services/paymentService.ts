import Stripe from 'stripe';
import Tenant from '../models/Tenant';
import User from '../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export interface CreateCustomerData {
  email: string;
  name: string;
  tenantId: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionData {
  customerId: string;
  priceId: string;
  tenantId: string;
  trialPeriodDays?: number;
}

export interface UpdateSubscriptionData {
  subscriptionId: string;
  priceId?: string;
  quantity?: number;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface PaymentMethodData {
  type: 'card';
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  billing_details: {
    name: string;
    email: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postal_code: string;
      country: string;
    };
  };
}

export class PaymentService {
  // Stripe Customer Management
  async createCustomer(data: CreateCustomerData): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          tenantId: data.tenantId,
          ...data.metadata,
        },
      });

      return customer;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new Error('Müşteri oluşturulurken hata oluştu');
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      return customer;
    } catch (error) {
      console.error('Stripe customer retrieval error:', error);
      throw new Error('Müşteri bilgileri alınırken hata oluştu');
    }
  }

  async updateCustomer(customerId: string, data: Partial<Stripe.CustomerUpdateParams>): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.update(customerId, data);
      return customer;
    } catch (error) {
      console.error('Stripe customer update error:', error);
      throw new Error('Müşteri bilgileri güncellenirken hata oluştu');
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
    try {
      await stripe.customers.del(customerId);
    } catch (error) {
      console.error('Stripe customer deletion error:', error);
      throw new Error('Müşteri silinirken hata oluştu');
    }
  }

  // Stripe Products and Prices
  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
      });
      return products.data;
    } catch (error) {
      console.error('Stripe products retrieval error:', error);
      throw new Error('Ürünler alınırken hata oluştu');
    }
  }

  async getPrices(): Promise<Stripe.Price[]> {
    try {
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });
      return prices.data;
    } catch (error) {
      console.error('Stripe prices retrieval error:', error);
      throw new Error('Fiyatlar alınırken hata oluştu');
    }
  }

  // Stripe Subscription Management
  async createSubscription(data: CreateSubscriptionData): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: data.customerId,
        items: [{ price: data.priceId }],
        trial_period_days: data.trialPeriodDays,
        metadata: {
          tenantId: data.tenantId,
        },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('Stripe subscription creation error:', error);
      throw new Error('Abonelik oluşturulurken hata oluştu');
    }
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice', 'customer', 'items.data.price'],
      });
      return subscription;
    } catch (error) {
      console.error('Stripe subscription retrieval error:', error);
      throw new Error('Abonelik bilgileri alınırken hata oluştu');
    }
  }

  async updateSubscription(data: UpdateSubscriptionData): Promise<Stripe.Subscription> {
    try {
      const updateData: Stripe.SubscriptionUpdateParams = {};

      if (data.priceId) {
        const subscription = await this.getSubscription(data.subscriptionId);
        const currentItem = subscription.items.data[0];
        
        updateData.items = [{
          id: currentItem.id,
          price: data.priceId,
          quantity: data.quantity || 1,
        }];
      }

      if (data.prorationBehavior) {
        updateData.proration_behavior = data.prorationBehavior;
      }

      const updatedSubscription = await stripe.subscriptions.update(
        data.subscriptionId,
        updateData
      );

      return updatedSubscription;
    } catch (error) {
      console.error('Stripe subscription update error:', error);
      throw new Error('Abonelik güncellenirken hata oluştu');
    }
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: !immediately,
      });

      if (immediately) {
        await stripe.subscriptions.cancel(subscriptionId);
      }

      return subscription;
    } catch (error) {
      console.error('Stripe subscription cancellation error:', error);
      throw new Error('Abonelik iptal edilirken hata oluştu');
    }
  }

  // Payment Methods
  async createPaymentMethod(data: PaymentMethodData): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: data.type,
        card: data.card,
        billing_details: data.billing_details,
      });

      return paymentMethod;
    } catch (error) {
      console.error('Stripe payment method creation error:', error);
      throw new Error('Ödeme yöntemi oluşturulurken hata oluştu');
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return paymentMethod;
    } catch (error) {
      console.error('Stripe payment method attachment error:', error);
      throw new Error('Ödeme yöntemi eklenirken hata oluştu');
    }
  }

  async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Stripe payment methods retrieval error:', error);
      throw new Error('Ödeme yöntemleri alınırken hata oluştu');
    }
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      return customer;
    } catch (error) {
      console.error('Stripe default payment method setting error:', error);
      throw new Error('Varsayılan ödeme yöntemi ayarlanırken hata oluştu');
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      console.error('Stripe payment method deletion error:', error);
      throw new Error('Ödeme yöntemi silinirken hata oluştu');
    }
  }

  // Invoices
  async getInvoices(customerId: string, limit: number = 10): Promise<Stripe.Invoice[]> {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit,
        expand: ['data.payment_intent'],
      });

      return invoices.data;
    } catch (error) {
      console.error('Stripe invoices retrieval error:', error);
      throw new Error('Faturalar alınırken hata oluştu');
    }
  }

  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await stripe.invoices.retrieve(invoiceId, {
        expand: ['payment_intent', 'customer'],
      });

      return invoice;
    } catch (error) {
      console.error('Stripe invoice retrieval error:', error);
      throw new Error('Fatura bilgileri alınırken hata oluştu');
    }
  }

  // Webhooks
  async handleWebhook(payload: string, signature: string): Promise<void> {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw new Error('Webhook işlenirken hata oluştu');
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const tenantId = subscription.metadata.tenantId;
      if (!tenantId) return;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) return;

      // Update tenant subscription
      tenant.subscription.status = subscription.status as any;
      tenant.subscription.stripeSubscriptionId = subscription.id;
      tenant.subscription.expiresAt = new Date((subscription as any).current_period_end * 1000);

      await tenant.save();
    } catch (error) {
      console.error('Subscription created webhook error:', error);
    }
  }

  async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const tenantId = subscription.metadata.tenantId;
      if (!tenantId) return;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) return;

      // Update tenant subscription
      tenant.subscription.status = subscription.status as any;
      tenant.subscription.expiresAt = new Date((subscription as any).current_period_end * 1000);

      await tenant.save();
    } catch (error) {
      console.error('Subscription updated webhook error:', error);
    }
  }

  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    try {
      const tenantId = subscription.metadata.tenantId;
      if (!tenantId) return;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) return;

      // Update tenant subscription
      tenant.subscription.status = 'cancelled';
      tenant.subscription.stripeSubscriptionId = undefined;

      await tenant.save();
    } catch (error) {
      console.error('Subscription deleted webhook error:', error);
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    try {
      if (!(invoice as any).subscription) return;

      const subscription = await this.getSubscription((invoice as any).subscription as string);
      const tenantId = subscription.metadata.tenantId;
      if (!tenantId) return;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) return;

      // Update tenant subscription status
      tenant.subscription.status = 'active';
      tenant.subscription.expiresAt = new Date((subscription as any).current_period_end * 1000);

      await tenant.save();
    } catch (error) {
      console.error('Invoice payment succeeded webhook error:', error);
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    try {
      if (!(invoice as any).subscription) return;

      const subscription = await this.getSubscription((invoice as any).subscription as string);
      const tenantId = subscription.metadata.tenantId;
      if (!tenantId) return;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant) return;

      // Update tenant subscription status
      tenant.subscription.status = 'suspended';

      await tenant.save();
    } catch (error) {
      console.error('Invoice payment failed webhook error:', error);
    }
  }

  // Utility Methods
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });

      return setupIntent;
    } catch (error) {
      console.error('Stripe setup intent creation error:', error);
      throw new Error('Setup intent oluşturulurken hata oluştu');
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'try',
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error('Payment intent oluşturulurken hata oluştu');
    }
  }

  // Webhook handlers for PaymentController
  async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    try {
      console.log('Checkout completed:', session.id);
      // Bu metod gerekirse implement edilebilir
    } catch (error) {
      console.error('Checkout completed webhook error:', error);
    }
  }

  async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    return this.handleInvoicePaymentSucceeded(invoice);
  }

  async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    return this.handleInvoicePaymentFailed(invoice);
  }
}

export const paymentService = new PaymentService();
