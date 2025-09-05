import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  planId: string;
  planName: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'unpaid';
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  stripeCustomerId: {
    type: String,
    required: true,
    index: true
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  planId: {
    type: String,
    required: true,
    enum: ['starter', 'professional', 'enterprise']
  },
  planName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'canceled', 'past_due', 'unpaid'],
    default: 'active'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'TRY'
  },
  interval: {
    type: String,
    required: true,
    enum: ['month', 'year']
  },
  currentPeriodStart: {
    type: Date,
    required: true
  },
  currentPeriodEnd: {
    type: Date,
    required: true
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  canceledAt: {
    type: Date
  },
  trialStart: {
    type: Date
  },
  trialEnd: {
    type: Date
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ stripeCustomerId: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });

// Virtual for checking if subscription is active
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.currentPeriodEnd > new Date();
});

// Virtual for checking if subscription is in trial
subscriptionSchema.virtual('isInTrial').get(function() {
  if (!this.trialStart || !this.trialEnd) return false;
  const now = new Date();
  return now >= this.trialStart && now <= this.trialEnd;
});

// Method to check if user has access to a feature
subscriptionSchema.methods.hasFeature = function(feature: string): boolean {
  if (!this.isActive) return false;
  
  const planFeatures = {
    starter: ['basic_dashboard', 'vehicle_management', 'basic_reports'],
    professional: ['basic_dashboard', 'vehicle_management', 'basic_reports', 'ai_features', 'advanced_reports', 'integrations'],
    enterprise: ['basic_dashboard', 'vehicle_management', 'basic_reports', 'ai_features', 'advanced_reports', 'integrations', 'api_access', 'white_label', 'priority_support']
  };
  
  return planFeatures[this.planId as keyof typeof planFeatures]?.includes(feature) || false;
};

// Method to get days until renewal
subscriptionSchema.methods.getDaysUntilRenewal = function(): number {
  const now = new Date();
  const diffTime = this.currentPeriodEnd.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Static method to find active subscription for user
subscriptionSchema.statics.findActiveByUserId = function(userId: string) {
  return this.findOne({
    userId,
    status: 'active',
    currentPeriodEnd: { $gt: new Date() }
  });
};

// Static method to find all subscriptions for user
subscriptionSchema.statics.findByUserId = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);
