import api from './api';

export interface SubscriptionPlan {
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    workOrders: number;
    users: number;
    storage: number;
    apiCalls: number;
  };
  popular?: boolean;
  description: string;
}

export interface SubscriptionUsage {
  workOrders: number;
  users: number;
  storage: number;
  apiCalls: number;
}

export interface SubscriptionLimits {
  workOrders: number;
  users: number;
  storage: number;
  apiCalls: number;
}

export interface SubscriptionInfo {
  usage: SubscriptionUsage;
  limits: SubscriptionLimits;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'suspended' | 'trial';
  expiresAt: string;
  isWithinLimits: boolean;
}

export interface SubscriptionAnalytics {
  totalTenants: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  planDistribution: Record<string, number>;
  monthlyRevenue: number;
}

class SubscriptionService {
  // Get all available subscription plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get('/subscription/plans');
    return response.data.data;
  }

  // Get specific plan details
  async getPlan(plan: string): Promise<SubscriptionPlan> {
    const response = await api.get(`/subscription/plans/${plan}`);
    return response.data.data;
  }

  // Get current subscription usage and limits
  async getUsage(): Promise<SubscriptionInfo> {
    const response = await api.get('/subscription/usage');
    return response.data.data;
  }

  // Check if tenant can perform specific action
  async checkLimit(type: 'workOrders' | 'users' | 'storage' | 'apiCalls', amount: number = 1): Promise<boolean> {
    const response = await api.post('/subscription/check-limit', { type, amount });
    return response.data.data.canPerform;
  }

  // Change subscription plan
  async changePlan(plan: 'starter' | 'professional' | 'enterprise', stripeSubscriptionId?: string): Promise<void> {
    await api.post('/subscription/change-plan', { plan, stripeSubscriptionId });
  }

  // Cancel subscription
  async cancelSubscription(): Promise<void> {
    await api.post('/subscription/cancel');
  }

  // Extend trial period
  async extendTrial(days: number = 7): Promise<void> {
    await api.post('/subscription/extend-trial', { days });
  }

  // Check if tenant has specific feature
  async hasFeature(feature: string): Promise<boolean> {
    const response = await api.get(`/subscription/features/${feature}`);
    return response.data.data.hasFeature;
  }

  // Get all available features for tenant
  async getFeatures(): Promise<string[]> {
    const response = await api.get('/subscription/features');
    return response.data.data;
  }

  // Get subscription analytics (admin only)
  async getAnalytics(): Promise<SubscriptionAnalytics> {
    const response = await api.get('/subscription/admin/analytics');
    return response.data.data;
  }

  // Get expiring subscriptions (admin only)
  async getExpiringSubscriptions(days: number = 7): Promise<any[]> {
    const response = await api.get(`/subscription/admin/expiring?days=${days}`);
    return response.data.data;
  }

  // Suspend subscription (admin only)
  async suspendSubscription(tenantId: string, reason?: string): Promise<void> {
    await api.post(`/subscription/admin/suspend/${tenantId}`, { reason });
  }

  // Reactivate subscription (admin only)
  async reactivateSubscription(tenantId: string): Promise<void> {
    await api.post(`/subscription/admin/reactivate/${tenantId}`);
  }

  // Helper method to format usage percentage
  formatUsagePercentage(current: number, limit: number): number {
    if (limit === -1) return 0; // Unlimited
    return Math.round((current / limit) * 100);
  }

  // Helper method to format storage size
  formatStorageSize(mb: number): string {
    if (mb < 1024) {
      return `${mb} MB`;
    } else if (mb < 1024 * 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    } else {
      return `${(mb / (1024 * 1024)).toFixed(1)} TB`;
    }
  }

  // Helper method to get plan color
  getPlanColor(plan: string): string {
    const colors = {
      starter: 'bg-blue-500',
      professional: 'bg-purple-500',
      enterprise: 'bg-gold-500'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-500';
  }

  // Helper method to get plan icon
  getPlanIcon(plan: string): string {
    const icons = {
      starter: '🚀',
      professional: '⭐',
      enterprise: '👑'
    };
    return icons[plan as keyof typeof icons] || '📦';
  }
}

export default new SubscriptionService();
