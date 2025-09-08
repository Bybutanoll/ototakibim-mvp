import Tenant, { ITenant } from '../models/Tenant';
import { SubscriptionPlan, SubscriptionStatus, PlanLimits, PlanFeatures } from '../types/subscription';

export interface SubscriptionUsage {
  workOrders: number;
  users: number;
  storage: number; // MB
  apiCalls: number;
}

export interface SubscriptionLimits {
  workOrders: number; // -1 for unlimited
  users: number; // -1 for unlimited
  storage: number; // MB, -1 for unlimited
  apiCalls: number; // per month, -1 for unlimited
}

export interface PlanInfo {
  name: string;
  price: number; // Monthly price in TRY
  currency: string;
  features: string[];
  limits: SubscriptionLimits;
  popular?: boolean;
  description: string;
}

export class SubscriptionService {
  // Plan definitions
  static readonly PLANS: Record<SubscriptionPlan, PlanInfo> = {
    starter: {
      name: 'Starter',
      price: 99,
      currency: 'TRY',
      description: 'Küçük işletmeler için temel özellikler',
      features: [
        'Temel dashboard',
        'Araç yönetimi',
        'Basit raporlar',
        'Email bildirimleri',
        'Mobil uygulama erişimi'
      ],
      limits: {
        workOrders: 50,
        users: 2,
        storage: 1000, // 1GB
        apiCalls: 1000
      }
    },
    professional: {
      name: 'Professional',
      price: 299,
      currency: 'TRY',
      description: 'Büyüyen işletmeler için gelişmiş özellikler',
      features: [
        'Tüm Starter özellikleri',
        'AI destekli tanı',
        'Gelişmiş raporlar',
        'SMS bildirimleri',
        'Entegrasyonlar',
        'Öncelikli destek',
        'Toplu veri aktarımı'
      ],
      limits: {
        workOrders: 500,
        users: 10,
        storage: 5000, // 5GB
        apiCalls: 10000
      },
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: 799,
      currency: 'TRY',
      description: 'Büyük işletmeler için sınırsız özellikler',
      features: [
        'Tüm Professional özellikleri',
        'Sınırsız kullanım',
        'API erişimi',
        'White-label çözüm',
        'Özel markalama',
        'Gelişmiş analitik',
        'Yedekleme ve geri yükleme',
        '7/24 öncelikli destek'
      ],
      limits: {
        workOrders: -1, // Unlimited
        users: -1, // Unlimited
        storage: -1, // Unlimited
        apiCalls: -1 // Unlimited
      }
    }
  };

  // Get all available plans
  static getPlans(): PlanInfo[] {
    return Object.values(this.PLANS);
  }

  // Get specific plan info
  static getPlan(plan: SubscriptionPlan): PlanInfo {
    return this.PLANS[plan];
  }

  // Check if tenant can perform action based on limits
  static async checkLimit(tenantId: string, type: keyof SubscriptionLimits): Promise<boolean> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) return false;

    const limit = tenant.subscription.limits[type];
    const usage = tenant.usage[type];

    // -1 means unlimited
    if (limit === -1) return true;

    return usage < limit;
  }

  // Update usage for tenant
  static async updateUsage(
    tenantId: string, 
    type: keyof SubscriptionLimits, 
    amount: number = 1
  ): Promise<boolean> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) return false;

    // Check if within limits before updating
    const canUpdate = await this.checkLimit(tenantId, type);
    if (!canUpdate && amount > 0) {
      throw new Error(`${type} limiti aşıldı`);
    }

    await tenant.updateUsage(type, amount);
    return true;
  }

  // Get usage statistics for tenant
  static async getUsage(tenantId: string): Promise<{
    usage: SubscriptionUsage;
    limits: SubscriptionLimits;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    expiresAt: Date;
    isWithinLimits: boolean;
  }> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      throw new Error('Tenant bulunamadı');
    }

    return {
      usage: {
        workOrders: tenant.usage.workOrders,
        users: tenant.usage.users,
        storage: tenant.usage.storage,
        apiCalls: tenant.usage.apiCalls
      },
      limits: tenant.subscription.limits,
      plan: tenant.subscription.plan,
      status: tenant.subscription.status,
      expiresAt: tenant.subscription.expiresAt,
      isWithinLimits: tenant.isWithinLimits()
    };
  }

  // Upgrade/downgrade subscription
  static async changePlan(
    tenantId: string, 
    newPlan: SubscriptionPlan,
    stripeSubscriptionId?: string
  ): Promise<ITenant> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      throw new Error('Tenant bulunamadı');
    }

    const planInfo = this.getPlan(newPlan);
    
    // Update subscription
    tenant.subscription.plan = newPlan;
    tenant.subscription.limits = planInfo.limits;
    tenant.subscription.features = planInfo.features;
    
    if (stripeSubscriptionId) {
      tenant.subscription.stripeSubscriptionId = stripeSubscriptionId;
    }

    // If upgrading from trial, set status to active
    if (tenant.subscription.status === 'trial') {
      tenant.subscription.status = 'active';
      tenant.subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    await tenant.save();
    return tenant;
  }

  // Cancel subscription
  static async cancelSubscription(tenantId: string): Promise<ITenant> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      throw new Error('Tenant bulunamadı');
    }

    tenant.subscription.status = 'cancelled';
    await tenant.save();
    return tenant;
  }

  // Suspend subscription
  static async suspendSubscription(tenantId: string, reason?: string): Promise<ITenant> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      throw new Error('Tenant bulunamadı');
    }

    tenant.subscription.status = 'suspended';
    await tenant.save();
    return tenant;
  }

  // Reactivate subscription
  static async reactivateSubscription(tenantId: string): Promise<ITenant> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      throw new Error('Tenant bulunamadı');
    }

    tenant.subscription.status = 'active';
    await tenant.save();
    return tenant;
  }

  // Extend trial period
  static async extendTrial(tenantId: string, days: number = 7): Promise<ITenant> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) {
      throw new Error('Tenant bulunamadı');
    }

    if (tenant.subscription.status === 'trial') {
      tenant.subscription.expiresAt = new Date(tenant.subscription.expiresAt.getTime() + days * 24 * 60 * 60 * 1000);
      await tenant.save();
    }

    return tenant;
  }

  // Reset monthly usage (called by cron job)
  static async resetMonthlyUsage(tenantId: string): Promise<void> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) return;

    await tenant.resetMonthlyUsage();
  }

  // Get tenants with expiring subscriptions
  static async getExpiringSubscriptions(days: number = 7): Promise<ITenant[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    
    return await Tenant.find({
      'subscription.expiresAt': { $lte: expirationDate },
      'subscription.status': { $in: ['active', 'trial'] }
    });
  }

  // Get subscription analytics
  static async getAnalytics(): Promise<{
    totalTenants: number;
    activeSubscriptions: number;
    trialSubscriptions: number;
    cancelledSubscriptions: number;
    planDistribution: Record<SubscriptionPlan, number>;
    monthlyRevenue: number;
  }> {
    const tenants = await Tenant.find({});
    
    const analytics = {
      totalTenants: tenants.length,
      activeSubscriptions: 0,
      trialSubscriptions: 0,
      cancelledSubscriptions: 0,
      planDistribution: {
        starter: 0,
        professional: 0,
        enterprise: 0
      } as Record<SubscriptionPlan, number>,
      monthlyRevenue: 0
    };

    tenants.forEach(tenant => {
      // Count by status
      switch (tenant.subscription.status) {
        case 'active':
          analytics.activeSubscriptions++;
          break;
        case 'trial':
          analytics.trialSubscriptions++;
          break;
        case 'cancelled':
          analytics.cancelledSubscriptions++;
          break;
      }

      // Count by plan
      analytics.planDistribution[tenant.subscription.plan]++;

      // Calculate revenue (only for active subscriptions)
      if (tenant.subscription.status === 'active') {
        const planInfo = this.getPlan(tenant.subscription.plan);
        analytics.monthlyRevenue += planInfo.price;
      }
    });

    return analytics;
  }

  // Check if tenant has specific feature
  static async hasFeature(tenantId: string, feature: string): Promise<boolean> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) return false;

    return tenant.hasFeature(feature);
  }

  // Get tenant's available features
  static async getFeatures(tenantId: string): Promise<string[]> {
    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) return [];

    return tenant.subscription.features;
  }
}

export default SubscriptionService;
