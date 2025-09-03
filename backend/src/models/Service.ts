import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  code: string; // Hizmet kodu (örn: OIL_CHANGE, BRAKE_REPAIR)
  category: 'maintenance' | 'repair' | 'inspection' | 'diagnostic' | 'emergency' | 'cosmetic';
  
  // Hizmet detayları
  description: string;
  shortDescription?: string;
  estimatedDuration: number; // dakika cinsinden
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  
  // Fiyatlandırma
  basePrice: number;
  laborPrice: number;
  partsPrice?: number;
  taxRate: number;
  
  // Dinamik fiyatlandırma
  pricingRules: Array<{
    condition: 'vehicle_age' | 'vehicle_type' | 'urgency' | 'customer_type' | 'season' | 'custom';
    operator: 'equals' | 'greater_than' | 'less_than' | 'in_range' | 'custom';
    value: any;
    adjustment: 'percentage' | 'fixed';
    adjustmentValue: number;
    description: string;
  }>;
  
  // Parça listesi
  requiredParts: Array<{
    partId?: mongoose.Types.ObjectId;
    partName: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    isRequired: boolean;
    supplier?: string;
    warranty?: string;
  }>;
  
  // Gereksinimler
  requirements: {
    vehicleTypes: string[]; // Hangi araç tipleri için uygun
    minVehicleAge?: number; // Minimum araç yaşı
    maxVehicleAge?: number; // Maksimum araç yaşı
    specialTools?: string[]; // Özel araçlar
    certifications?: string[]; // Gerekli sertifikalar
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  
  // Garanti bilgileri
  warranty: {
    type: 'none' | 'parts' | 'labor' | 'full';
    duration: number; // gün cinsinden
    terms: string;
    exclusions: string[];
  };
  
  // Hizmet adımları
  serviceSteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    estimatedTime: number; // dakika cinsinden
    isRequired: boolean;
    notes?: string;
    safetyNotes?: string;
    tools?: string[];
  }>;
  
  // Kalite kontrol
  qualityChecklist: Array<{
    item: string;
    isRequired: boolean;
    notes?: string;
  }>;
  
  // Fotoğraflar ve belgeler
  photos: string[];
  videos: string[];
  documents: Array<{
    name: string;
    type: 'manual' | 'procedure' | 'safety' | 'warranty' | 'other';
    url: string;
    description?: string;
  }>;
  
  // SEO ve pazarlama
  seo: {
    keywords: string[];
    metaDescription?: string;
    featured: boolean;
    popular: boolean;
  };
  
  // Durum ve yönetim
  status: 'active' | 'inactive' | 'discontinued' | 'draft';
  isFeatured: boolean;
  sortOrder: number;
  
  // İstatistikler
  statistics: {
    totalOrders: number;
    averageRating: number;
    totalRevenue: number;
    lastOrderDate?: Date;
  };
  
  // Etiketler
  tags: string[];
  
  // Özel alanlar
  customFields: Map<string, any>;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  category: {
    type: String,
    enum: ['maintenance', 'repair', 'inspection', 'diagnostic', 'emergency', 'cosmetic'],
    required: true
  },
  
  // Hizmet detayları
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 200
  },
  estimatedDuration: {
    type: Number,
    required: true,
    min: 15,
    max: 480 // 8 saat
  },
  complexity: {
    type: String,
    enum: ['simple', 'moderate', 'complex', 'expert'],
    default: 'moderate'
  },
  
  // Fiyatlandırma
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  laborPrice: {
    type: Number,
    required: true,
    min: 0
  },
  partsPrice: {
    type: Number,
    min: 0
  },
  taxRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 18 // %18 KDV
  },
  
  // Dinamik fiyatlandırma
  pricingRules: [{
    condition: {
      type: String,
      enum: ['vehicle_age', 'vehicle_type', 'urgency', 'customer_type', 'season', 'custom'],
      required: true
    },
    operator: {
      type: String,
      enum: ['equals', 'greater_than', 'less_than', 'in_range', 'custom'],
      required: true
    },
    value: Schema.Types.Mixed,
    adjustment: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    adjustmentValue: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    }
  }],
  
  // Parça listesi
  requiredParts: [{
    partId: {
      type: Schema.Types.ObjectId,
      ref: 'Part'
    },
    partName: {
      type: String,
      required: true,
      trim: true
    },
    partNumber: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    supplier: {
      type: String,
      trim: true
    },
    warranty: {
      type: String,
      trim: true
    }
  }],
  
  // Gereksinimler
  requirements: {
    vehicleTypes: [{
      type: String,
      trim: true
    }],
    minVehicleAge: {
      type: Number,
      min: 0
    },
    maxVehicleAge: {
      type: Number,
      min: 0
    },
    specialTools: [{
      type: String,
      trim: true
    }],
    certifications: [{
      type: String,
      trim: true
    }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  },
  
  // Garanti bilgileri
  warranty: {
    type: {
      type: String,
      enum: ['none', 'parts', 'labor', 'full'],
      default: 'none'
    },
    duration: {
      type: Number,
      min: 0,
      default: 0
    },
    terms: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    exclusions: [{
      type: String,
      trim: true
    }]
  },
  
  // Hizmet adımları
  serviceSteps: [{
    stepNumber: {
      type: Number,
      required: true,
      min: 1
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: 1,
      max: 480
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    },
    safetyNotes: {
      type: String,
      trim: true,
      maxlength: 200
    },
    tools: [{
      type: String,
      trim: true
    }]
  }],
  
  // Kalite kontrol
  qualityChecklist: [{
    item: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  
  // Fotoğraflar ve belgeler
  photos: [{
    type: String,
    trim: true
  }],
  videos: [{
    type: String,
    trim: true
  }],
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['manual', 'procedure', 'safety', 'warranty', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  
  // SEO ve pazarlama
  seo: {
    keywords: [{
      type: String,
      trim: true
    }],
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    featured: {
      type: Boolean,
      default: false
    },
    popular: {
      type: Boolean,
      default: false
    }
  },
  
  // Durum ve yönetim
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'draft'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // İstatistikler
  statistics: {
    totalOrders: {
      type: Number,
      default: 0,
      min: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0
    },
    lastOrderDate: {
      type: Date
    }
  },
  
  // Etiketler
  tags: [{
    type: String,
    trim: true
  }],
  
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
serviceSchema.index({ code: 1 });
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ isFeatured: 1, status: 1 });
serviceSchema.index({ sortOrder: 1 });
serviceSchema.index({ createdAt: 1 });

// Text search index
serviceSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text'
});

// Virtual field for total price
serviceSchema.virtual('totalPrice').get(function() {
  const partsCost = this.partsPrice || 0;
  const subtotal = this.basePrice + this.laborPrice + partsCost;
  const tax = subtotal * (this.taxRate / 100);
  return subtotal + tax;
});

// Virtual field for total duration in hours
serviceSchema.virtual('durationHours').get(function() {
  return this.estimatedDuration / 60;
});

// Pre-save middleware to update parts price
serviceSchema.pre('save', function(next) {
  if (this.requiredParts && this.requiredParts.length > 0) {
    this.partsPrice = this.requiredParts.reduce((sum, part) => {
      return sum + (part.unitPrice * part.quantity);
    }, 0);
  }
  next();
});

export default mongoose.model<IService>('Service', serviceSchema);
