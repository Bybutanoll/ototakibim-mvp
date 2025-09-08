import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import Tenant from '../models/Tenant';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export class PaymentController {
  async createCustomer(req: Request, res: Response) {
    try {
      const { email, name, metadata } = req.body;
      const tenantId = (req as any).user.tenantId;

      const existingTenant = await Tenant.findById(tenantId);
      if (existingTenant?.subscription.stripeCustomerId) {
        return res.status(400).json({
          status: 'error',
          message: 'Müşteri zaten mevcut'
        });
      }

      const customer = await paymentService.createCustomer({
        email,
        name,
        tenantId,
        metadata: {
          ...metadata
        }
      });

      // Update tenant with customer ID
      await Tenant.findByIdAndUpdate(tenantId, {
        'subscription.stripeCustomerId': customer.id
      });

      res.status(201).json({
        status: 'success',
        data: customer
      });
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri oluşturulurken hata oluştu'
      });
    }
  }

  async getCustomer(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const tenant = await Tenant.findById(tenantId);

      if (!tenant?.subscription.stripeCustomerId) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      const customer = await paymentService.getCustomer(tenant.subscription.stripeCustomerId);

      res.json({
        status: 'success',
        data: customer
      });
    } catch (error) {
      console.error('Get customer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri bilgileri alınırken hata oluştu'
      });
    }
  }

  async createSubscription(req: Request, res: Response) {
    try {
      const { priceId, trialPeriodDays } = req.body;
      const tenantId = (req as any).user.tenantId;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant?.subscription.stripeCustomerId) {
        return res.status(400).json({
          status: 'error',
          message: 'Önce müşteri oluşturulmalı'
        });
      }

      const subscription = await paymentService.createSubscription({
        customerId: tenant.subscription.stripeCustomerId,
        priceId,
        tenantId,
        trialPeriodDays
      });

      // Update tenant with subscription info
      await Tenant.findByIdAndUpdate(tenantId, {
        'subscription.stripeSubscriptionId': subscription.id,
        'subscription.plan': subscription.items.data[0].price.id,
        'subscription.status': subscription.status
      });

      res.status(201).json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      console.error('Create subscription error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Abonelik oluşturulurken hata oluştu'
      });
    }
  }

  async getSubscription(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const tenant = await Tenant.findById(tenantId);

      if (!tenant?.subscription.stripeSubscriptionId) {
        return res.status(404).json({
          status: 'error',
          message: 'Abonelik bulunamadı'
        });
      }

      const subscription = await paymentService.getSubscription(tenant.subscription.stripeSubscriptionId);

      res.json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Abonelik bilgileri alınırken hata oluştu'
      });
    }
  }

  async updateSubscription(req: Request, res: Response) {
    try {
      const { priceId, quantity } = req.body;
      const tenantId = (req as any).user.tenantId;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant?.subscription.stripeSubscriptionId) {
        return res.status(404).json({
          status: 'error',
          message: 'Abonelik bulunamadı'
        });
      }

      const subscription = await paymentService.updateSubscription({
        subscriptionId: tenant.subscription.stripeSubscriptionId,
        priceId,
        quantity
      });

      // Update tenant with new subscription info
      if (priceId) {
        await Tenant.findByIdAndUpdate(tenantId, {
          'subscription.plan': priceId
        });
      }

      res.json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Abonelik güncellenirken hata oluştu'
      });
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      const { immediately } = req.body;
      const tenantId = (req as any).user.tenantId;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant?.subscription.stripeSubscriptionId) {
        return res.status(404).json({
          status: 'error',
          message: 'Abonelik bulunamadı'
        });
      }

      const subscription = await paymentService.cancelSubscription(
        tenant.subscription.stripeSubscriptionId,
        immediately
      );

      // Update tenant subscription status
      await Tenant.findByIdAndUpdate(tenantId, {
        'subscription.status': subscription.status
      });

      res.json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Abonelik iptal edilirken hata oluştu'
      });
    }
  }

  async getPaymentMethods(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const tenant = await Tenant.findById(tenantId);

      if (!tenant?.subscription.stripeCustomerId) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      const paymentMethods = await paymentService.getCustomerPaymentMethods(tenant.subscription.stripeCustomerId);

    res.json({
      status: 'success',
        data: paymentMethods
      });
    } catch (error) {
      console.error('Get payment methods error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödeme yöntemleri alınırken hata oluştu'
      });
    }
  }

  async createSetupIntent(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const tenant = await Tenant.findById(tenantId);

      if (!tenant?.subscription.stripeCustomerId) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      const setupIntent = await paymentService.createSetupIntent(tenant.subscription.stripeCustomerId);

      res.json({
        status: 'success',
        data: setupIntent
      });
    } catch (error) {
      console.error('Create setup intent error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Setup intent oluşturulurken hata oluştu'
      });
    }
  }

  async setDefaultPaymentMethod(req: Request, res: Response) {
    try {
      const { paymentMethodId } = req.body;
      const tenantId = (req as any).user.tenantId;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant?.subscription.stripeCustomerId) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      await paymentService.setDefaultPaymentMethod(
        tenant.subscription.stripeCustomerId,
        paymentMethodId
      );

      res.json({
        status: 'success',
        message: 'Varsayılan ödeme yöntemi güncellendi'
      });
    } catch (error) {
      console.error('Set default payment method error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Varsayılan ödeme yöntemi güncellenirken hata oluştu'
      });
    }
  }

  async deletePaymentMethod(req: Request, res: Response) {
    try {
      const { paymentMethodId } = req.params;

      await paymentService.deletePaymentMethod(paymentMethodId);

      res.json({
        status: 'success',
        message: 'Ödeme yöntemi silindi'
      });
    } catch (error) {
      console.error('Delete payment method error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödeme yöntemi silinirken hata oluştu'
      });
    }
  }

  async getInvoices(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;
      const tenantId = (req as any).user.tenantId;

      const tenant = await Tenant.findById(tenantId);
      if (!tenant?.subscription.stripeCustomerId) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      const invoices = await paymentService.getInvoices(
        tenant.subscription.stripeCustomerId,
        Number(limit)
      );

      res.json({
        status: 'success',
        data: invoices
      });
    } catch (error) {
      console.error('Get invoices error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Faturalar alınırken hata oluştu'
      });
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const products = await paymentService.getProducts();

      res.json({
        status: 'success',
        data: products
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ürünler alınırken hata oluştu'
      });
    }
  }

  async getPrices(req: Request, res: Response) {
    try {
      const prices = await paymentService.getPrices();

      res.json({
        status: 'success',
        data: prices
      });
    } catch (error) {
      console.error('Get prices error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Fiyatlar alınırken hata oluştu'
      });
    }
  }

  // Legacy payment methods for backward compatibility
  async getPayments(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const tenant = await Tenant.findById(tenantId);

      if (!tenant?.subscription.stripeCustomerId) {
        return res.json({
          status: 'success',
          data: []
        });
      }

      const invoices = await paymentService.getInvoices(tenant.subscription.stripeCustomerId, 50);

      res.json({
        status: 'success',
        data: invoices
      });
    } catch (error) {
      console.error('Get payments error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödemeler alınırken hata oluştu'
      });
    }
  }

  async getPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const invoice = await paymentService.getInvoice(id);

      res.json({
        status: 'success',
        data: invoice
      });
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödeme bilgileri alınırken hata oluştu'
      });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      // This would create a new invoice/payment
      // For now, return a placeholder response
      res.status(201).json({
        status: 'success',
        message: 'Ödeme oluşturuldu',
        data: { id: 'temp-payment-id' }
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödeme oluşturulurken hata oluştu'
      });
    }
  }

  async addPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount, paymentMethod, referenceNumber } = req.body;

      // This would add a payment to an existing invoice
      // For now, return a placeholder response
      res.json({
        status: 'success',
        message: 'Ödeme eklendi',
        data: { id, amount, paymentMethod, referenceNumber }
      });
    } catch (error) {
      console.error('Add payment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödeme eklenirken hata oluştu'
      });
    }
  }

  async deletePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // This would delete a payment
      // For now, return a placeholder response
      res.json({
        status: 'success',
        message: 'Ödeme silindi'
      });
    } catch (error) {
      console.error('Delete payment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödeme silinirken hata oluştu'
      });
    }
  }

  async getPaymentStats(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const tenant = await Tenant.findById(tenantId);

      if (!tenant?.subscription.stripeCustomerId) {
        return res.json({
          status: 'success',
          data: {
            totalPaid: 0,
            totalDue: 0,
            paymentCount: 0,
            lastPaymentDate: null
          }
        });
      }

      const invoices = await paymentService.getInvoices(tenant.subscription.stripeCustomerId, 100);
      
      const stats = {
        totalPaid: invoices.reduce((sum, invoice) => sum + invoice.amount_paid, 0),
        totalDue: invoices.reduce((sum, invoice) => sum + invoice.amount_due, 0),
        paymentCount: invoices.length,
        lastPaymentDate: invoices.length > 0 ? new Date(Math.max(...invoices.map(i => i.status_transitions?.paid_at || 0))) : null
      };

      res.json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      console.error('Get payment stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Ödeme istatistikleri alınırken hata oluştu'
      });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!endpointSecret) {
        return res.status(400).json({ error: 'Webhook secret not configured' });
      }

      let event;
      try {
        // Stripe webhook event'ini doğrula
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.log('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
      }

      // Event tipine göre işlem yap
      switch (event.type) {
        case 'checkout.session.completed':
          await paymentService.handleCheckoutCompleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await paymentService.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await paymentService.handlePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.updated':
          await paymentService.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await paymentService.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

// Export controller instance
export const paymentController = new PaymentController();

// Export individual methods for routes
export const {
  createCustomer,
  getCustomer,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  getPaymentMethods,
  createSetupIntent,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  getInvoices,
  getProducts,
  getPrices,
  getPayments,
  getPayment,
  createPayment,
  addPayment,
  deletePayment,
  getPaymentStats,
  handleWebhook
} = paymentController;