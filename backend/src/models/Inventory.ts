import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  description?: string;
  category: string;
  brand?: string;
  partNumber?: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  costPrice: number;
  sellingPrice: number;
  supplier?: {
    name: string;
    contact: string;
    email?: string;
    phone?: string;
  };
  location?: {
    warehouse: string;
    shelf: string;
    bin?: string;
  };
  compatibility: Array<{
    make: string;
    model: string;
    yearFrom?: number;
    yearTo?: number;
    engineType?: string;
  }>;
  images: string[];
  documents: Array<{
    name: string;
    type: 'manual' | 'warranty' | 'certificate' | 'other';
    url: string;
  }>;
  specifications: Record<string, any>;
  tags: string[];
  isActive: boolean;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  totalValue: number;
}

const inventorySchema = new Schema<IInventory>({
  name: {
    type: String,
    required: [true, 'Parça adı gereklidir'],
    trim: true,
    maxlength: [100, 'Parça adı en fazla 100 karakter olabilir']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Açıklama en fazla 500 karakter olabilir']
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: [
      'engine',
      'brake',
      'suspension',
      'electrical',
      'body',
      'interior',
      'exterior',
      'transmission',
      'fuel_system',
      'cooling_system',
      'exhaust_system',
      'tire',
      'battery',
      'filter',
      'fluid',
      'tool',
      'other'
    ]
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Marka adı en fazla 50 karakter olabilir']
  },
  partNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Parça numarası en fazla 50 karakter olabilir']
  },
  sku: {
    type: String,
    required: [true, 'SKU gereklidir'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, 'SKU en fazla 50 karakter olabilir']
  },
  quantity: {
    type: Number,
    required: [true, 'Miktar gereklidir'],
    min: [0, 'Miktar negatif olamaz'],
    default: 0
  },
  minQuantity: {
    type: Number,
    required: [true, 'Minimum miktar gereklidir'],
    min: [0, 'Minimum miktar negatif olamaz'],
    default: 5
  },
  maxQuantity: {
    type: Number,
    required: [true, 'Maksimum miktar gereklidir'],
    min: [0, 'Maksimum miktar negatif olamaz'],
    default: 100
  },
  unitPrice: {
    type: Number,
    required: [true, 'Birim fiyat gereklidir'],
    min: [0, 'Birim fiyat negatif olamaz']
  },
  costPrice: {
    type: Number,
    required: [true, 'Maliyet fiyatı gereklidir'],
    min: [0, 'Maliyet fiyatı negatif olamaz']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Satış fiyatı gereklidir'],
    min: [0, 'Satış fiyatı negatif olamaz']
  },
  supplier: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Tedarikçi adı en fazla 100 karakter olabilir']
    },
    contact: {
      type: String,
      trim: true,
      maxlength: [100, 'İletişim bilgisi en fazla 100 karakter olabilir']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]+$/, 'Geçerli bir telefon numarası giriniz']
    }
  },
  location: {
    warehouse: {
      type: String,
      trim: true,
      maxlength: [50, 'Depo adı en fazla 50 karakter olabilir']
    },
    shelf: {
      type: String,
      trim: true,
      maxlength: [20, 'Raf numarası en fazla 20 karakter olabilir']
    },
    bin: {
      type: String,
      trim: true,
      maxlength: [20, 'Kutu numarası en fazla 20 karakter olabilir']
    }
  },
  compatibility: [{
    make: {
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
      max: new Date().getFullYear() + 1
    },
    yearTo: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    engineType: {
      type: String,
      trim: true
    }
  }],
  images: [{
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
      enum: ['manual', 'warranty', 'certificate', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  }],
  specifications: {
    type: Schema.Types.Mixed,
    default: {}
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity <= this.minQuantity) return 'low_stock';
  return 'in_stock';
});

// Virtual for total value
inventorySchema.virtual('totalValue').get(function() {
  return this.quantity * this.costPrice;
});

// Indexes for better performance
inventorySchema.index({ owner: 1, isActive: 1 });
inventorySchema.index({ sku: 1, owner: 1 });
inventorySchema.index({ category: 1, owner: 1 });
inventorySchema.index({ brand: 1, owner: 1 });
inventorySchema.index({ name: 1, owner: 1 });
inventorySchema.index({ 'compatibility.make': 1, 'compatibility.model': 1 });
inventorySchema.index({ tags: 1 });

// Static method to find inventory by owner
inventorySchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true }).sort({ createdAt: -1 });
};

// Static method to find low stock items
inventorySchema.statics.findLowStock = function(ownerId: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $expr: { $lte: ['$quantity', '$minQuantity'] }
  }).sort({ quantity: 1 });
};

// Static method to search inventory
inventorySchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { sku: { $regex: searchTerm, $options: 'i' } },
      { partNumber: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 });
};

// Static method to find compatible parts
inventorySchema.statics.findCompatible = function(ownerId: string, make: string, model: string, year?: number) {
  const query: any = {
    owner: ownerId,
    isActive: true,
    'compatibility.make': { $regex: new RegExp(make, 'i') },
    'compatibility.model': { $regex: new RegExp(model, 'i') }
  };

  if (year) {
    query.$or = [
      { 'compatibility.yearFrom': { $exists: false } },
      { 'compatibility.yearFrom': { $lte: year } },
      { 'compatibility.yearTo': { $exists: false } },
      { 'compatibility.yearTo': { $gte: year } }
    ];
  }

  return this.find(query).sort({ name: 1 });
};

// Pre-save middleware to ensure unique SKU per owner
inventorySchema.pre('save', async function(next) {
  if (this.isModified('sku')) {
    const existingItem = await Inventory.findOne({
      sku: this.sku,
      owner: this.owner,
      isActive: true,
      _id: { $ne: this._id }
    });
    
    if (existingItem) {
      const error = new Error('Bu SKU zaten kullanılıyor');
      return next(error);
    }
  }
  next();
});

const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);

export default Inventory;
