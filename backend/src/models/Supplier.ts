import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  owner: mongoose.Types.ObjectId; // User ID (servis sahibi)
  name: string; // Tedarikçi adı
  code: string; // Tedarikçi kodu
  type: 'manufacturer' | 'distributor' | 'wholesaler' | 'retailer'; // Tedarikçi tipi
  
  // İletişim bilgileri
  contactInfo: {
    primaryContact: {
      name: string;
      title: string;
      phone: string;
      email: string;
    };
    secondaryContact?: {
      name: string;
      title: string;
      phone: string;
      email: string;
    };
    address: {
      street: string;
      district: string;
      city: string;
      postalCode: string;
      country: string;
    };
    website?: string;
    taxNumber?: string;
    taxOffice?: string;
  };
  
  // İş bilgileri
  businessInfo: {
    establishedYear?: number;
    employeeCount?: number;
    annualRevenue?: number;
    certifications?: string[];
    specialties?: string[]; // Uzmanlık alanları
  };
  
  // Performans metrikleri
  performance: {
    rating: number; // 1-5 arası puan
    onTimeDelivery: number; // Zamanında teslimat oranı (%)
    qualityRating: number; // Kalite puanı (1-5)
    responseTime: number; // Ortalama yanıt süresi (saat)
    totalOrders: number; // Toplam sipariş sayısı
    successfulOrders: number; // Başarılı sipariş sayısı
    lastOrderDate?: Date;
    averageOrderValue: number; // Ortalama sipariş değeri
  };
  
  // Ödeme bilgileri
  paymentTerms: {
    creditLimit: number; // Kredi limiti
    paymentTerms: number; // Ödeme vadesi (gün)
    currency: string; // Para birimi
    discountRate?: number; // İndirim oranı (%)
    earlyPaymentDiscount?: {
      rate: number; // Erken ödeme indirimi (%)
      days: number; // Kaç gün içinde
    };
  };
  
  // Teslimat bilgileri
  deliveryInfo: {
    averageLeadTime: number; // Ortalama teslimat süresi (gün)
    minimumOrderValue: number; // Minimum sipariş tutarı
    freeShippingThreshold?: number; // Ücretsiz kargo limiti
    shippingMethods: string[]; // Kargo yöntemleri
    deliveryAreas: string[]; // Teslimat bölgeleri
  };
  
  // Kategori ve ürün bilgileri
  categories: string[]; // Tedarik ettiği kategoriler
  brands: string[]; // Tedarik ettiği markalar
  
  // Durum ve notlar
  status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
  notes: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    isInternal: boolean;
  }>;
  
  // Belgeler
  documents: Array<{
    name: string;
    type: 'contract' | 'certificate' | 'invoice' | 'other';
    url: string;
    uploadedAt: Date;
    expiresAt?: Date;
  }>;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 50
  },
  type: {
    type: String,
    enum: ['manufacturer', 'distributor', 'wholesaler', 'retailer'],
    required: true
  },
  
  // İletişim bilgileri
  contactInfo: {
    primaryContact: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      title: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      }
    },
    secondaryContact: {
      name: {
        type: String,
        trim: true
      },
      title: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true
      },
      district: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      postalCode: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true,
        default: 'Türkiye'
      }
    },
    website: {
      type: String,
      trim: true
    },
    taxNumber: {
      type: String,
      trim: true
    },
    taxOffice: {
      type: String,
      trim: true
    }
  },
  
  // İş bilgileri
  businessInfo: {
    establishedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },
    employeeCount: {
      type: Number,
      min: 0
    },
    annualRevenue: {
      type: Number,
      min: 0
    },
    certifications: [{
      type: String,
      trim: true
    }],
    specialties: [{
      type: String,
      trim: true
    }]
  },
  
  // Performans metrikleri
  performance: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    onTimeDelivery: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    responseTime: {
      type: Number,
      min: 0,
      default: 24
    },
    totalOrders: {
      type: Number,
      min: 0,
      default: 0
    },
    successfulOrders: {
      type: Number,
      min: 0,
      default: 0
    },
    lastOrderDate: Date,
    averageOrderValue: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  
  // Ödeme bilgileri
  paymentTerms: {
    creditLimit: {
      type: Number,
      min: 0,
      default: 0
    },
    paymentTerms: {
      type: Number,
      min: 0,
      default: 30
    },
    currency: {
      type: String,
      default: 'TRY',
      uppercase: true
    },
    discountRate: {
      type: Number,
      min: 0,
      max: 100
    },
    earlyPaymentDiscount: {
      rate: {
        type: Number,
        min: 0,
        max: 100
      },
      days: {
        type: Number,
        min: 0
      }
    }
  },
  
  // Teslimat bilgileri
  deliveryInfo: {
    averageLeadTime: {
      type: Number,
      min: 0,
      default: 7
    },
    minimumOrderValue: {
      type: Number,
      min: 0,
      default: 0
    },
    freeShippingThreshold: {
      type: Number,
      min: 0
    },
    shippingMethods: [{
      type: String,
      trim: true
    }],
    deliveryAreas: [{
      type: String,
      trim: true
    }]
  },
  
  // Kategori ve ürün bilgileri
  categories: [{
    type: String,
    trim: true
  }],
  brands: [{
    type: String,
    trim: true
  }],
  
  // Durum ve notlar
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'blacklisted'],
    default: 'active'
  },
  notes: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  
  // Belgeler
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['contract', 'certificate', 'invoice', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
supplierSchema.index({ owner: 1, isActive: 1 });
supplierSchema.index({ code: 1, owner: 1 }, { unique: true });
supplierSchema.index({ name: 1, owner: 1 });
supplierSchema.index({ type: 1 });
supplierSchema.index({ status: 1 });
supplierSchema.index({ 'performance.rating': -1 });

// Text search index
supplierSchema.index({
  name: 'text',
  code: 'text',
  'contactInfo.primaryContact.name': 'text'
});

// Virtual fields
supplierSchema.virtual('successRate').get(function() {
  if (this.performance.totalOrders === 0) return 0;
  return (this.performance.successfulOrders / this.performance.totalOrders) * 100;
});

supplierSchema.virtual('fullAddress').get(function() {
  const addr = this.contactInfo.address;
  return `${addr.street}, ${addr.district}, ${addr.city} ${addr.postalCode}, ${addr.country}`;
});

// Static methods
supplierSchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true })
    .populate('notes.author', 'firstName lastName')
    .sort({ name: 1 });
};

supplierSchema.statics.findByCategory = function(ownerId: string, category: string) {
  return this.find({ 
    owner: ownerId, 
    isActive: true, 
    categories: category 
  })
  .populate('notes.author', 'firstName lastName')
  .sort({ name: 1 });
};

supplierSchema.statics.findByBrand = function(ownerId: string, brand: string) {
  return this.find({ 
    owner: ownerId, 
    isActive: true, 
    brands: brand 
  })
  .populate('notes.author', 'firstName lastName')
  .sort({ name: 1 });
};

supplierSchema.statics.findTopPerformers = function(ownerId: string, limit: number = 10) {
  return this.find({ 
    owner: ownerId, 
    isActive: true, 
    status: 'active' 
  })
  .sort({ 'performance.rating': -1, 'performance.onTimeDelivery': -1 })
  .limit(limit)
  .populate('notes.author', 'firstName lastName');
};

supplierSchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { code: { $regex: searchTerm, $options: 'i' } },
      { 'contactInfo.primaryContact.name': { $regex: searchTerm, $options: 'i' } },
      { 'contactInfo.primaryContact.email': { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .populate('notes.author', 'firstName lastName')
  .sort({ name: 1 });
};

// Instance methods
supplierSchema.methods.updatePerformance = function(orderSuccess: boolean, deliveryTime?: number, qualityRating?: number) {
  this.performance.totalOrders += 1;
  
  if (orderSuccess) {
    this.performance.successfulOrders += 1;
  }
  
  if (deliveryTime !== undefined) {
    // Zamanında teslimat hesaplama (varsayılan 7 gün)
    const expectedDelivery = this.deliveryInfo.averageLeadTime;
    const isOnTime = deliveryTime <= expectedDelivery;
    
    // Hareketli ortalama ile güncelleme
    const currentRate = this.performance.onTimeDelivery;
    const newRate = (currentRate * 0.8) + (isOnTime ? 100 : 0) * 0.2;
    this.performance.onTimeDelivery = Math.round(newRate);
  }
  
  if (qualityRating !== undefined) {
    // Kalite puanı güncelleme
    const currentRating = this.performance.qualityRating;
    const newRating = (currentRating * 0.8) + (qualityRating * 0.2);
    this.performance.qualityRating = Math.round(newRating * 10) / 10;
  }
  
  // Genel puan hesaplama
  const successRate = this.performance.successfulOrders / this.performance.totalOrders;
  const deliveryScore = this.performance.onTimeDelivery / 100;
  const qualityScore = this.performance.qualityRating / 5;
  
  this.performance.rating = Math.round(((successRate + deliveryScore + qualityScore) / 3) * 5 * 10) / 10;
  
  this.performance.lastOrderDate = new Date();
  
  return this;
};

supplierSchema.methods.addNote = function(author: string, content: string, isInternal: boolean = false) {
  this.notes.push({
    author: author,
    content: content,
    isInternal: isInternal
  });
  
  return this;
};

export default mongoose.model<ISupplier>('Supplier', supplierSchema);
