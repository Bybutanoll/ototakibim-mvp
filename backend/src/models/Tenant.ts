import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  tenantId: string; // Unique identifier (slug format)
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Subscription & Billing
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'cancelled' | 'suspended' | 'trial';
    expiresAt: Date;
    limits: {
      workOrders: number; // -1 for unlimited
      users: number; // -1 for unlimited
      storage: number; // MB
      apiCalls: number; // per month
    };
    features: string[];
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  
  // Company Settings
  settings: {
    branding: {
      logo?: string;
      primaryColor: string;
      secondaryColor: string;
      companyAddress?: string;
      website?: string;
    };
    notifications: {
      sms: boolean;
      email: boolean;
      push: boolean;
    };
    business: {
      timezone: string;
      currency: string;
      language: string;
      workingHours: {
        start: string;
        end: string;
        days: number[]; // 0-6 (Sunday-Saturday)
      };
    };
    integrations: {
      smsProvider?: string;
      emailProvider?: string;
      paymentProvider?: string;
    };
  };
  
  // Usage Tracking
  usage: {
    workOrders: number;
    users: number;
    storage: number; // MB
    apiCalls: number;
    lastReset: Date; // Monthly reset
  };
  
  // Status & Metadata
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  isWithinLimits(): boolean;
  canCreateWorkOrder(): boolean;
  canAddUser(): boolean;
  hasFeature(feature: string): boolean;
  updateUsage(type: 'workOrders' | 'users' | 'storage' | 'apiCalls', amount: number): Promise<void>;
  resetMonthlyUsage(): Promise<void>;
}

const tenantSchema = new Schema<ITenant>({
  tenantId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Tenant ID sadece küçük harf, rakam ve tire içerebilir'],
    minlength: [3, 'Tenant ID en az 3 karakter olmalıdır'],
    maxlength: [50, 'Tenant ID en fazla 50 karakter olabilir']
  },
  companyName: {
    type: String,
    required: [true, 'Şirket adı gereklidir'],
    trim: true,
    maxlength: [100, 'Şirket adı 100 karakterden uzun olamaz']
  },
  contactEmail: {
    type: String,
    required: [true, 'İletişim emaili gereklidir'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
  },
  contactPhone: {
    type: String,
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Geçerli bir telefon numarası giriniz']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'Turkey'
    }
  },
  
  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      default: 'starter',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'suspended', 'trial'],
      default: 'trial',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
    },
    limits: {
      workOrders: {
        type: Number,
        required: true,
        default: 50 // Starter plan limit
      },
      users: {
        type: Number,
        required: true,
        default: 2 // Starter plan limit
      },
      storage: {
        type: Number,
        required: true,
        default: 1000 // 1GB in MB
      },
      apiCalls: {
        type: Number,
        required: true,
        default: 1000 // per month
      }
    },
    features: [{
      type: String,
      enum: [
        'basic_dashboard',
        'vehicle_management',
        'basic_reports',
        'ai_features',
        'advanced_reports',
        'integrations',
        'api_access',
        'white_label',
        'priority_support',
        'bulk_import',
        'custom_branding',
        'advanced_analytics',
        'sms_notifications',
        'email_notifications',
        'mobile_app',
        'backup_restore'
      ]
    }],
    stripeCustomerId: {
      type: String,
      trim: true
    },
    stripeSubscriptionId: {
      type: String,
      trim: true
    }
  },
  
  // Company Settings
  settings: {
    branding: {
      logo: {
        type: String,
        trim: true
      },
      primaryColor: {
        type: String,
        default: '#3B82F6',
        match: [/^#[0-9A-Fa-f]{6}$/, 'Geçerli bir hex renk kodu giriniz']
      },
      secondaryColor: {
        type: String,
        default: '#1E40AF',
        match: [/^#[0-9A-Fa-f]{6}$/, 'Geçerli bir hex renk kodu giriniz']
      },
      companyAddress: {
        type: String,
        trim: true
      },
      website: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Geçerli bir website URL\'si giriniz']
      }
    },
    notifications: {
      sms: {
        type: Boolean,
        default: false
      },
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    business: {
      timezone: {
        type: String,
        default: 'Europe/Istanbul'
      },
      currency: {
        type: String,
        default: 'TRY'
      },
      language: {
        type: String,
        default: 'tr'
      },
      workingHours: {
        start: {
          type: String,
          default: '09:00',
          match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)']
        },
        end: {
          type: String,
          default: '18:00',
          match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)']
        },
        days: [{
          type: Number,
          min: 0,
          max: 6,
          default: [1, 2, 3, 4, 5] // Monday to Friday
        }]
      }
    },
    integrations: {
      smsProvider: {
        type: String,
        enum: ['netgsm', 'iletimerkezi', 'custom'],
        default: 'netgsm'
      },
      emailProvider: {
        type: String,
        enum: ['sendgrid', 'mailgun', 'custom'],
        default: 'sendgrid'
      },
      paymentProvider: {
        type: String,
        enum: ['stripe', 'iyzico', 'paypal'],
        default: 'stripe'
      }
    }
  },
  
  // Usage Tracking
  usage: {
    workOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    users: {
      type: Number,
      default: 0,
      min: 0
    },
    storage: {
      type: Number,
      default: 0,
      min: 0
    },
    apiCalls: {
      type: Number,
      default: 0,
      min: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  },
  
  // Status & Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    select: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
tenantSchema.index({ tenantId: 1 }, { unique: true });
tenantSchema.index({ contactEmail: 1 });
tenantSchema.index({ 'subscription.status': 1 });
tenantSchema.index({ 'subscription.expiresAt': 1 });
tenantSchema.index({ isActive: 1 });

// Virtual for checking if subscription is active
tenantSchema.virtual('subscription.isActive').get(function() {
  return this.subscription.status === 'active' && this.subscription.expiresAt > new Date();
});

// Virtual for checking if in trial
tenantSchema.virtual('subscription.isInTrial').get(function() {
  return this.subscription.status === 'trial' && this.subscription.expiresAt > new Date();
});

// Method to check if within limits
tenantSchema.methods.isWithinLimits = function(): boolean {
  const limits = this.subscription.limits;
  const usage = this.usage;
  
  return (
    (limits.workOrders === -1 || usage.workOrders < limits.workOrders) &&
    (limits.users === -1 || usage.users < limits.users) &&
    (limits.storage === -1 || usage.storage < limits.storage) &&
    (limits.apiCalls === -1 || usage.apiCalls < limits.apiCalls)
  );
};

// Method to check if can create work order
tenantSchema.methods.canCreateWorkOrder = function(): boolean {
  return this.subscription.limits.workOrders === -1 || 
         this.usage.workOrders < this.subscription.limits.workOrders;
};

// Method to check if can add user
tenantSchema.methods.canAddUser = function(): boolean {
  return this.subscription.limits.users === -1 || 
         this.usage.users < this.subscription.limits.users;
};

// Method to check if has feature
tenantSchema.methods.hasFeature = function(feature: string): boolean {
  if (!this.isActive || !this.subscription.isActive) return false;
  return this.subscription.features.includes(feature);
};

// Method to update usage
tenantSchema.methods.updateUsage = async function(type: 'workOrders' | 'users' | 'storage' | 'apiCalls', amount: number): Promise<void> {
  this.usage[type] += amount;
  await this.save();
};

// Method to reset monthly usage
tenantSchema.methods.resetMonthlyUsage = async function(): Promise<void> {
  this.usage.workOrders = 0;
  this.usage.apiCalls = 0;
  this.usage.lastReset = new Date();
  await this.save();
};

// Static method to find by tenantId
tenantSchema.statics.findByTenantId = function(tenantId: string) {
  return this.findOne({ tenantId, isActive: true });
};

// Static method to find active tenants
tenantSchema.statics.findActive = function() {
  return this.find({ isActive: true, 'subscription.status': 'active' });
};

// Static method to find tenants expiring soon
tenantSchema.statics.findExpiringSoon = function(days: number = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    isActive: true,
    'subscription.expiresAt': { $lte: futureDate },
    'subscription.status': { $in: ['active', 'trial'] }
  });
};

// Pre-save middleware to set plan features
tenantSchema.pre('save', function(next) {
  if (this.isModified('subscription.plan')) {
    const planFeatures = {
      starter: ['basic_dashboard', 'vehicle_management', 'basic_reports'],
      professional: [
        'basic_dashboard', 'vehicle_management', 'basic_reports',
        'ai_features', 'advanced_reports', 'integrations', 'sms_notifications'
      ],
      enterprise: [
        'basic_dashboard', 'vehicle_management', 'basic_reports',
        'ai_features', 'advanced_reports', 'integrations', 'api_access',
        'white_label', 'priority_support', 'bulk_import', 'custom_branding',
        'advanced_analytics', 'sms_notifications', 'email_notifications',
        'mobile_app', 'backup_restore'
      ]
    };
    
    const planLimits = {
      starter: { workOrders: 50, users: 2, storage: 1000, apiCalls: 1000 },
      professional: { workOrders: 500, users: 10, storage: 5000, apiCalls: 10000 },
      enterprise: { workOrders: -1, users: -1, storage: -1, apiCalls: -1 }
    };
    
    this.subscription.features = planFeatures[this.subscription.plan as keyof typeof planFeatures];
    this.subscription.limits = planLimits[this.subscription.plan as keyof typeof planLimits];
  }
  next();
});

export default mongoose.model<ITenant>('Tenant', tenantSchema);
