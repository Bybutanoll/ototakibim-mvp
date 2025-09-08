export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'suspended' | 'trial';

export interface PlanLimits {
  workOrders: number; // -1 for unlimited
  users: number; // -1 for unlimited
  storage: number; // MB, -1 for unlimited
  apiCalls: number; // per month, -1 for unlimited
}

export interface PlanFeatures {
  basic_dashboard: boolean;
  vehicle_management: boolean;
  basic_reports: boolean;
  ai_features: boolean;
  advanced_reports: boolean;
  integrations: boolean;
  api_access: boolean;
  white_label: boolean;
  priority_support: boolean;
  bulk_import: boolean;
  custom_branding: boolean;
  advanced_analytics: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  mobile_app: boolean;
  backup_restore: boolean;
}

export interface SubscriptionUsage {
  workOrders: number;
  users: number;
  storage: number; // MB
  apiCalls: number;
}

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt: Date;
  limits: PlanLimits;
  usage: SubscriptionUsage;
  features: string[];
  isWithinLimits: boolean;
  isActive: boolean;
  isInTrial: boolean;
}

export interface BillingInfo {
  customerId?: string;
  subscriptionId?: string;
  paymentMethod?: string;
  nextBillingDate?: Date;
  amount?: number;
  currency?: string;
}

export interface SubscriptionAnalytics {
  totalTenants: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  planDistribution: Record<SubscriptionPlan, number>;
  monthlyRevenue: number;
  churnRate: number;
  averageRevenuePerUser: number;
}
