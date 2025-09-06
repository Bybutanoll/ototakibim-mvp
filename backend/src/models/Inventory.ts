import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  owner: mongoose.Types.ObjectId; // User ID (servis sahibi)
  partNumber: string; // Parça numarası
  name: string; // Parça adı
  description?: string; // Açıklama
  category: string; // Kategori (fren, motor, elektrik, vb.)
  brand: string; // Marka
  vehicleCompatibility: Array<{
    brand: string;
    model: string;
    yearFrom?: number;
    yearTo?: number;
    engineType?: string;
  }>; // Uyumlu araçlar
  
  // Stok bilgileri
  currentStock: number; // Mevcut stok
  minimumStock: number; // Minimum stok seviyesi
  maximumStock: number; // Maksimum stok seviyesi
  reorderPoint: number; // Yeniden sipariş noktası
  reorderQuantity: number; // Yeniden sipariş miktarı
  
  // Fiyat bilgileri
  costPrice: number; // Maliyet fiyatı
  sellingPrice: number; // Satış fiyatı
  margin: number; // Kar marjı (%)
  
  // Tedarikçi bilgileri
  suppliers: Array<{
    supplierId: mongoose.Types.ObjectId;
    supplierName: string;
    supplierPartNumber?: string;
    costPrice: number;
    leadTime: number; // Teslimat süresi (gün)
    minimumOrderQuantity: number;
    isPrimary: boolean; // Ana tedarikçi mi?
  }>;
  
  // Lokasyon bilgileri
  location: {
    warehouse: string; // Depo
    shelf: string; // Raf
    bin: string; // Bölme
    zone: string; // Bölge
  };
  
  // Özellikler
  unit: string; // Birim (adet, kg, litre, vb.)
  weight?: number; // Ağırlık
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // Garanti ve kalite
  warranty: {
    duration: number; // Garanti süresi (gün)
    type: 'manufacturer' | 'supplier' | 'none';
    terms?: string;
  };
  
  // Stok hareketleri
  stockMovements: Array<{
    type: 'in' | 'out' | 'adjustment' | 'transfer';
    quantity: number;
    reason: string;
    referenceId?: mongoose.Types.ObjectId; // İş emri, sipariş vb.
    referenceType?: 'workorder' | 'purchase' | 'sale' | 'adjustment';
    performedBy: mongoose.Types.ObjectId;
    performedAt: Date;
    notes?: string;
  }>;
  
  // Otomatik sipariş
  autoReorder: {
    enabled: boolean;
    lastReorderDate?: Date;
    nextReorderDate?: Date;
    reorderFrequency: number; // Gün cinsinden
  };
  
  // Durum
  status: 'active' | 'inactive' | 'discontinued';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  partNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  vehicleCompatibility: [{
    brand: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    yearFrom: {
      type: Number,
      min: 1900,
      max: 2030
    },
    yearTo: {
      type: Number,
      min: 1900,
      max: 2030
    },
    engineType: {
      type: String,
      trim: true
    }
  }],
  
  // Stok bilgileri
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maximumStock: {
    type: Number,
    required: true,
    min: 0,
    default: 100
  },
  reorderPoint: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reorderQuantity: {
    type: Number,
    required: true,
    min: 1,
    default: 10
  },
  
  // Fiyat bilgileri
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  margin: {
    type: Number,
    min: 0,
    max: 1000,
    default: 0
  },
  
  // Tedarikçi bilgileri
  suppliers: [{
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    supplierName: {
      type: String,
      required: true,
      trim: true
    },
    supplierPartNumber: {
      type: String,
      trim: true
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0
    },
    leadTime: {
      type: Number,
      required: true,
      min: 0,
      default: 7
    },
    minimumOrderQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Lokasyon bilgileri
  location: {
    warehouse: {
      type: String,
      required: true,
      trim: true,
      default: 'Ana Depo'
    },
    shelf: {
      type: String,
      trim: true
    },
    bin: {
      type: String,
      trim: true
    },
    zone: {
      type: String,
      trim: true
    }
  },
  
  // Özellikler
  unit: {
    type: String,
    required: true,
    trim: true,
    default: 'adet'
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: {
      type: Number,
      min: 0
    },
    width: {
      type: Number,
      min: 0
    },
    height: {
      type: Number,
      min: 0
    }
  },
  
  // Garanti ve kalite
  warranty: {
    duration: {
      type: Number,
      min: 0,
      default: 0
    },
    type: {
      type: String,
      enum: ['manufacturer', 'supplier', 'none'],
      default: 'none'
    },
    terms: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  
  // Stok hareketleri
  stockMovements: [{
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment', 'transfer'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    referenceId: {
      type: Schema.Types.ObjectId
    },
    referenceType: {
      type: String,
      enum: ['workorder', 'purchase', 'sale', 'adjustment']
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  }],
  
  // Otomatik sipariş
  autoReorder: {
    enabled: {
      type: Boolean,
      default: false
    },
    lastReorderDate: Date,
    nextReorderDate: Date,
    reorderFrequency: {
      type: Number,
      min: 1,
      default: 30
    }
  },
  
  // Durum
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
inventorySchema.index({ owner: 1, isActive: 1 });
inventorySchema.index({ partNumber: 1, owner: 1 }, { unique: true });
inventorySchema.index({ category: 1, brand: 1 });
inventorySchema.index({ currentStock: 1 });
inventorySchema.index({ 'vehicleCompatibility.brand': 1, 'vehicleCompatibility.model': 1 });

// Text search index
inventorySchema.index({
  name: 'text',
  description: 'text',
  partNumber: 'text'
});

// Virtual fields
inventorySchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= 0) return 'out-of-stock';
  if (this.currentStock <= this.minimumStock) return 'low-stock';
  if (this.currentStock >= this.maximumStock) return 'overstock';
  return 'normal';
});

inventorySchema.virtual('needsReorder').get(function() {
  return this.currentStock <= this.reorderPoint;
});

inventorySchema.virtual('stockValue').get(function() {
  return this.currentStock * this.costPrice;
});

// Static methods
inventorySchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true })
    .populate('suppliers.supplierId', 'name contactInfo')
    .sort({ name: 1 });
};

inventorySchema.statics.findLowStock = function(ownerId: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $expr: { $lte: ['$currentStock', '$minimumStock'] }
  })
  .populate('suppliers.supplierId', 'name contactInfo')
  .sort({ currentStock: 1 });
};

inventorySchema.statics.findByCategory = function(ownerId: string, category: string) {
  return this.find({ owner: ownerId, category: category, isActive: true })
    .populate('suppliers.supplierId', 'name contactInfo')
    .sort({ name: 1 });
};

inventorySchema.statics.findByVehicle = function(ownerId: string, brand: string, model: string, year?: number) {
  const query: any = {
    owner: ownerId,
    isActive: true,
    'vehicleCompatibility.brand': brand,
    'vehicleCompatibility.model': model
  };

  if (year) {
    query.$or = [
      { 'vehicleCompatibility.yearFrom': { $exists: false } },
      { 'vehicleCompatibility.yearFrom': { $lte: year } },
      { 'vehicleCompatibility.yearTo': { $exists: false } },
      { 'vehicleCompatibility.yearTo': { $gte: year } }
    ];
  }

  return this.find(query)
    .populate('suppliers.supplierId', 'name contactInfo')
    .sort({ name: 1 });
};

inventorySchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { partNumber: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .populate('suppliers.supplierId', 'name contactInfo')
  .sort({ name: 1 });
};

// Instance methods
inventorySchema.methods.addStock = function(quantity: number, reason: string, performedBy: string, referenceId?: string, referenceType?: string, notes?: string) {
  if (quantity <= 0) {
    throw new Error('Miktar pozitif olmalıdır');
  }

  this.currentStock += quantity;
  
  this.stockMovements.push({
    type: 'in',
    quantity: quantity,
    reason: reason,
    referenceId: referenceId,
    referenceType: referenceType,
    performedBy: performedBy,
    notes: notes
  });

  return this;
};

inventorySchema.methods.removeStock = function(quantity: number, reason: string, performedBy: string, referenceId?: string, referenceType?: string, notes?: string) {
  if (quantity <= 0) {
    throw new Error('Miktar pozitif olmalıdır');
  }

  if (this.currentStock < quantity) {
    throw new Error('Yetersiz stok');
  }

  this.currentStock -= quantity;
  
  this.stockMovements.push({
    type: 'out',
    quantity: quantity,
    reason: reason,
    referenceId: referenceId,
    referenceType: referenceType,
    performedBy: performedBy,
    notes: notes
  });

  return this;
};

inventorySchema.methods.adjustStock = function(newQuantity: number, reason: string, performedBy: string, notes?: string) {
  const difference = newQuantity - this.currentStock;
  
  this.currentStock = newQuantity;
  
  this.stockMovements.push({
    type: 'adjustment',
    quantity: Math.abs(difference),
    reason: reason,
    performedBy: performedBy,
    notes: notes
  });

  return this;
};

inventorySchema.methods.checkReorder = function() {
  if (this.autoReorder.enabled && this.currentStock <= this.reorderPoint) {
    const nextReorder = new Date();
    nextReorder.setDate(nextReorder.getDate() + this.autoReorder.reorderFrequency);
    this.autoReorder.nextReorderDate = nextReorder;
    return true;
  }
  return false;
};

export default mongoose.model<IInventory>('Inventory', inventorySchema);