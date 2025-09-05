import { Request, Response } from 'express';
import StripeService, { SUBSCRIPTION_PLANS } from '../services/stripeService';
import Subscription from '../models/Subscription';
import User from '../models/User';

export const paymentController = {
  /**
   * Get available subscription plans
   */
  async getPlans(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        plans: SUBSCRIPTION_PLANS
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch plans'
      });
    }
  },

  /**
   * Create a new payment method
   */
  async createPaymentMethod(req: Request, res: Response) {
    try {
      // In real app, this would integrate with Stripe
      const { cardNumber, expiryDate, cvv, cardholderName, isDefault } = req.body;
      
      // Mock payment method creation
      const paymentMethod = {
        id: `pm_${Date.now()}`,
        userId: req.user?.id || 'demo-user',
        cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
        expiryDate,
        cardholderName,
        isDefault: isDefault || false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        data: paymentMethod
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Payment method creation failed'
      });
    }
  },

  /**
   * Update a payment method
   */
  async updatePaymentMethod(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Mock payment method update
      const paymentMethod = {
        id,
        userId: req.user?.id || 'demo-user',
        cardNumber: `**** **** **** ${updateData.cardNumber?.slice(-4) || '1234'}`,
        expiryDate: updateData.expiryDate,
        cardholderName: updateData.cardholderName,
        isDefault: updateData.isDefault || false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: paymentMethod
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Payment method update failed'
      });
    }
  },

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Mock payment method deletion
      res.json({
        success: true,
        message: 'Payment method deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Payment method deletion failed'
      });
    }
  },

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Mock setting default payment method
      res.json({
        success: true,
        message: 'Default payment method updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update default payment method'
      });
    }
  },

  /**
   * Get payment methods for a user
   */
  async getPaymentMethods(req: Request, res: Response) {
    try {
      const userId = req.user?.id || 'demo-user';
      
      // Mock payment methods data
      const paymentMethods = [
        {
          id: 'pm_1',
          userId,
          cardNumber: '**** **** **** 1234',
          expiryDate: '12/25',
          cardholderName: 'John Doe',
          isDefault: true,
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 'pm_2',
          userId,
          cardNumber: '**** **** **** 5678',
          expiryDate: '06/26',
          cardholderName: 'John Doe',
          isDefault: false,
          status: 'active',
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z'
        }
      ];

      res.json({
        success: true,
        data: paymentMethods
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch payment methods'
      });
    }
  },

  /**
   * Create a new subscription
   */
  async createSubscription(req: Request, res: Response) {
    try {
      const { planId, paymentMethodId } = req.body;
      const userId = (req as any).user.id;
      
      // Find the plan
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return res.status(400).json({
          success: false,
          error: 'Invalid plan ID'
        });
      }

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if user already has an active subscription
      const existingSubscription = await Subscription.findOne({
        userId,
        status: 'active'
      });

      if (existingSubscription) {
        return res.status(400).json({
          success: false,
          error: 'User already has an active subscription'
        });
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await StripeService.createCustomer(
          user.email,
          `${user.firstName} ${user.lastName}`,
          userId
        );
        stripeCustomerId = customer.id;
        
        // Update user with Stripe customer ID
        await User.findByIdAndUpdate(userId, { stripeCustomerId });
      }

      // Attach payment method to customer
      await StripeService.attachPaymentMethod(paymentMethodId, stripeCustomerId);

      // Create Stripe subscription
      const stripeSubscription = await StripeService.createSubscription({
        customerId: stripeCustomerId,
        priceId: plan.stripePriceId,
        paymentMethodId
      });

      // Save subscription to database
      const subscription = new Subscription({
        userId,
        stripeCustomerId,
        stripeSubscriptionId: stripeSubscription.id,
        planId: plan.id,
        planName: plan.name,
        status: stripeSubscription.status,
        amount: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : undefined,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : undefined
      });

      await subscription.save();

      res.status(201).json({
        success: true,
        data: {
          id: subscription._id,
          stripeSubscriptionId: subscription.stripeSubscriptionId,
          planId: subscription.planId,
          planName: subscription.planName,
          status: subscription.status,
          amount: subscription.amount,
          currency: subscription.currency,
          interval: subscription.interval,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          isActive: (subscription as any).isActive,
          isInTrial: (subscription as any).isInTrial
        }
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      res.status(500).json({
        success: false,
        error: 'Subscription creation failed'
      });
    }
  },

  /**
   * Cancel a subscription
   */
  async cancelSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Find the subscription
      const subscription = await Subscription.findOne({
        _id: id,
        userId
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }

      // Cancel in Stripe
      await StripeService.cancelSubscription(subscription.stripeSubscriptionId);

      // Update in database
      subscription.status = 'canceled';
      subscription.canceledAt = new Date();
      await subscription.save();

      res.json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: {
          id: subscription._id,
          status: subscription.status,
          canceledAt: subscription.canceledAt
        }
      });
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      res.status(500).json({
        success: false,
        error: 'Subscription cancellation failed'
      });
    }
  },

  /**
   * Update a subscription
   */
  async updateSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Mock subscription update
      const subscription = {
        id,
        userId: req.user?.id || 'demo-user',
        planId: updateData.planId || 'starter',
        planName: updateData.planId === 'starter' ? 'Starter' : updateData.planId === 'professional' ? 'Professional' : 'Enterprise',
        status: 'active',
        amount: updateData.planId === 'starter' ? 99 : updateData.planId === 'professional' ? 199 : 399,
        currency: 'TRY',
        interval: 'monthly',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: {
          id: 'pm_1',
          cardNumber: '**** **** **** 1234',
          cardholderName: 'John Doe'
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Subscription update failed'
      });
    }
  },

  /**
   * Get subscriptions for a user
   */
  async getSubscriptions(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const subscriptions = await Subscription.find({ userId });

      res.json({
        success: true,
        data: subscriptions.map((sub: any) => ({
          id: sub._id,
          stripeSubscriptionId: sub.stripeSubscriptionId,
          planId: sub.planId,
          planName: sub.planName,
          status: sub.status,
          amount: sub.amount,
          currency: sub.currency,
          interval: sub.interval,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          canceledAt: sub.canceledAt,
          isActive: sub.isActive,
          isInTrial: sub.isInTrial,
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt
        }))
      });
    } catch (error) {
      console.error('Get subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subscriptions'
      });
    }
  },

  /**
   * Get invoices for a user
   */
  async getInvoices(req: Request, res: Response) {
    try {
      const userId = req.user?.id || 'demo-user';
      
      // Mock invoices data
      const invoices = [
        {
          id: 'inv_1',
          userId,
          subscriptionId: 'sub_1',
          description: 'Professional Plan - Ocak 2024',
          amount: 199,
          currency: 'TRY',
          status: 'paid',
          createdAt: '2024-01-01T00:00:00.000Z',
          dueDate: '2024-01-01T00:00:00.000Z',
          paidAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 'inv_2',
          userId,
          subscriptionId: 'sub_1',
          description: 'Professional Plan - Şubat 2024',
          amount: 199,
          currency: 'TRY',
          status: 'pending',
          createdAt: '2024-02-01T00:00:00.000Z',
          dueDate: '2024-02-01T00:00:00.000Z',
          paidAt: null
        }
      ];

      res.json({
        success: true,
        data: invoices
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch invoices'
      });
    }
  },

  /**
   * Create a payment intent
   */
  async createPaymentIntent(req: Request, res: Response) {
    try {
      const { amount, currency } = req.body;
      
      // Mock payment intent creation
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        amount,
        currency,
        status: 'requires_payment_method',
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        data: paymentIntent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Payment intent creation failed'
      });
    }
  },

  /**
   * Confirm a payment
   */
  async confirmPayment(req: Request, res: Response) {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;
      
      // Mock payment confirmation
      res.json({
        success: true,
        message: 'Payment confirmed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Payment confirmation failed'
      });
    }
  }
};
