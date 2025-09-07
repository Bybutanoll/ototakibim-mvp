import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  // Multi-tenant fields
  tenantId: string; // Tenant reference
  tenantRole: 'owner' | 'manager' | 'technician'; // Role within tenant
  
  // Personal information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  
  // Global role (for super admin)
  globalRole?: 'super_admin' | 'admin';
  
  // Status
  isActive: boolean;
  avatar?: string;
  onboardingCompleted?: boolean;
  
  // Business information (moved to tenant)
  businessName?: string; // Deprecated - use tenant.companyName
  businessType?: string; // Deprecated - use tenant settings
  address?: string; // Deprecated - use tenant.address
  
  // Authentication
  refreshTokens?: string[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerified?: boolean;
  lastLogin?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  hasPermission(permission: string): boolean;
  isOwner(): boolean;
  isManager(): boolean;
  isTechnician(): boolean;
}

const userSchema = new Schema<IUser>({
  // Multi-tenant fields
  tenantId: {
    type: String,
    required: [true, 'Tenant ID gereklidir'],
    index: true
  },
  tenantRole: {
    type: String,
    enum: ['owner', 'manager', 'technician'],
    default: 'technician',
    required: true
  },
  
  // Personal information
  firstName: {
    type: String,
    required: [true, 'Ad gereklidir'],
    trim: true,
    maxlength: [50, 'Ad 50 karakterden uzun olamaz']
  },
  lastName: {
    type: String,
    required: [true, 'Soyad gereklidir'],
    trim: true,
    maxlength: [50, 'Soyad 50 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'Email gereklidir'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası gereklidir'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Geçerli bir telefon numarası giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false
  },
  globalRole: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: undefined
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: ''
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  businessName: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  refreshTokens: [{
    type: String,
    select: false
  }],
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes
userSchema.index({ tenantId: 1, email: 1 }, { unique: true }); // Unique email per tenant
userSchema.index({ tenantId: 1, tenantRole: 1 });
userSchema.index({ tenantId: 1, isActive: 1 });
userSchema.index({ globalRole: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Virtual for account lock status - removed to avoid conflict with isLocked method

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Method to check if account is locked
userSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function(): Promise<void> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to check permissions
userSchema.methods.hasPermission = function(permission: string): boolean {
  // Super admin has all permissions
  if (this.globalRole === 'super_admin') return true;
  
  // Global admin has most permissions
  if (this.globalRole === 'admin') {
    return !['delete_tenant', 'manage_global_settings'].includes(permission);
  }
  
  // Tenant-based permissions
  const rolePermissions = {
    owner: [
      'read', 'write', 'delete', 'manage_users', 'manage_settings',
      'view_analytics', 'manage_billing', 'manage_integrations'
    ],
    manager: [
      'read', 'write', 'view_analytics', 'manage_technicians'
    ],
    technician: [
      'read', 'write:own_orders', 'view_own_analytics'
    ]
  };
  
  return rolePermissions[this.tenantRole as keyof typeof rolePermissions]?.includes(permission) || false;
};

// Role check methods
userSchema.methods.isOwner = function(): boolean {
  return this.tenantRole === 'owner';
};

userSchema.methods.isManager = function(): boolean {
  return this.tenantRole === 'manager';
};

userSchema.methods.isTechnician = function(): boolean {
  return this.tenantRole === 'technician';
};

export default mongoose.model<IUser>('User', userSchema);
