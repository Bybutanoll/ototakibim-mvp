import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  user: mongoose.Types.ObjectId;
  
  // Kişisel bilgiler
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  
  // Adres bilgileri
  addresses: Array<{
    type: 'home' | 'work' | 'billing' | 'shipping';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  
  // İletişim tercihleri
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    pushNotification: boolean;
    marketingEmails: boolean;
    preferredLanguage: 'tr' | 'en';
  };
  
  // Acil durum iletişim
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Şirket bilgileri
  company?: {
    name: string;
    position: string;
    department: string;
    taxNumber?: string;
  };
  
  // Araç bilgileri
  vehicles: mongoose.Types.ObjectId[];
  
  // Hizmet geçmişi
  serviceHistory: Array<{
    date: Date;
    serviceType: string;
    vehicle: mongoose.Types.ObjectId;
    cost: number;
    rating?: number;
    feedback?: string;
    technician: mongoose.Types.ObjectId;
  }>;
  
  // Randevu geçmişi
  appointmentHistory: Array<{
    date: Date;
    serviceType: string;
    vehicle: mongoose.Types.ObjectId;
    status: string;
    notes?: string;
  }>;
  
  // Müşteri notları
  notes: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    category: 'general' | 'preference' | 'issue' | 'opportunity';
    isInternal: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  
  // Etiketler
  tags: string[];
  
  // Sosyal medya
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  
  // Referans bilgileri
  referredBy?: mongoose.Types.ObjectId;
  referrals: mongoose.Types.ObjectId[];
  
  // Müşteri durumu
  status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
  statusReason?: string;
  statusChangedAt?: Date;
  statusChangedBy?: mongoose.Types.ObjectId;
  
  // İstatistikler
  statistics: {
    totalSpent: number;
    averageOrderValue: number;
    lastVisitDate?: Date;
    visitFrequency: number;
    preferredServices: string[];
    preferredTimeSlots: string[];
  };
  
  // Özel alanlar
  customFields: Map<string, any>;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Kişisel bilgiler
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  
  // Adres bilgileri
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'billing', 'shipping'],
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Turkey'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  
  // İletişim tercihleri
  communicationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    phone: {
      type: Boolean,
      default: true
    },
    pushNotification: {
      type: Boolean,
      default: false
    },
    marketingEmails: {
      type: Boolean,
      default: false
    },
    preferredLanguage: {
      type: String,
      enum: ['tr', 'en'],
      default: 'tr'
    }
  },
  
  // Acil durum iletişim
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String
  },
  
  // Şirket bilgileri
  company: {
    name: String,
    position: String,
    department: String,
    taxNumber: String
  },
  
  // Araç bilgileri
  vehicles: [{
    type: Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  
  // Hizmet geçmişi
  serviceHistory: [{
    date: {
      type: Date,
      required: true
    },
    serviceType: {
      type: String,
      required: true
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    technician: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Randevu geçmişi
  appointmentHistory: [{
    date: {
      type: Date,
      required: true
    },
    serviceType: {
      type: String,
      required: true
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    status: {
      type: String,
      required: true
    },
    notes: String
  }],
  
  // Müşteri notları
  notes: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['general', 'preference', 'issue', 'opportunity'],
      default: 'general'
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Etiketler
  tags: [String],
  
  // Sosyal medya
  socialMedia: {
    facebook: String,
    instagram: String,
    linkedin: String,
    twitter: String
  },
  
  // Referans bilgileri
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  referrals: [{
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  }],
  
  // Müşteri durumu
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'blacklisted'],
    default: 'active'
  },
  statusReason: String,
  statusChangedAt: Date,
  statusChangedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // İstatistikler
  statistics: {
    totalSpent: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    lastVisitDate: Date,
    visitFrequency: {
      type: Number,
      default: 0
    },
    preferredServices: [String],
    preferredTimeSlots: [String]
  },
  
  // Özel alanlar
  customFields: {
    type: Map,
    of: Schema.Types.Mixed
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ 'addresses.city': 1 });
customerSchema.index({ createdAt: -1 });

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware
customerSchema.pre('save', function(next) {
  // Update statistics
  if (this.serviceHistory && this.serviceHistory.length > 0) {
    const totalSpent = this.serviceHistory.reduce((sum, service) => sum + service.cost, 0);
    this.statistics.totalSpent = totalSpent;
    this.statistics.averageOrderValue = totalSpent / this.serviceHistory.length;
  }
  
  // Update last visit date
  if (this.serviceHistory && this.serviceHistory.length > 0) {
    const lastService = this.serviceHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    this.statistics.lastVisitDate = lastService.date;
  }
  
  next();
});

export default mongoose.model<ICustomer>('Customer', customerSchema);
