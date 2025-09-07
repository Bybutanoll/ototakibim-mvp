import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  // Multi-tenant field
  tenantId: string; // Tenant reference
  
  owner: mongoose.Types.ObjectId; // User ID (servis sahibi)
  customer: mongoose.Types.ObjectId; // Customer ID (araç sahibi)
  plate: string; // Plaka
  brand: string; // Marka
  vehicleModel: string; // Model
  year: number; // Yıl
  vin: string; // VIN numarası
  engineSize: string; // Motor hacmi
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg'; // Yakıt tipi
  transmission: 'manual' | 'automatic' | 'semi-automatic'; // Vites tipi
  mileage: number; // Kilometre
  color: string; // Renk
  description?: string; // Açıklama
  photos: string[]; // Fotoğraflar
  documents: Array<{
    name: string;
    type: 'insurance' | 'registration' | 'inspection' | 'other';
    url: string;
    expiryDate?: Date;
  }>;
  maintenanceHistory: Array<{
    date: Date;
    type: 'service' | 'repair' | 'inspection';
    description: string;
    cost: number;
    mileage: number;
    workshop?: string;
  }>;
  qrCode?: string; // QR kod
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  fullName: string; // Marka + Model + Yıl
}

// Static methods interface
export interface IVehicleModel extends mongoose.Model<IVehicle> {
  findByOwner(ownerId: string): mongoose.Query<IVehicle[], IVehicle>;
  findByCustomer(customerId: string): mongoose.Query<IVehicle[], IVehicle>;
  searchByOwner(ownerId: string, searchTerm: string): mongoose.Query<IVehicle[], IVehicle>;
}

const vehicleSchema = new Schema<IVehicle>({
  // Multi-tenant field
  tenantId: {
    type: String,
    required: [true, 'Tenant ID gereklidir'],
    index: true
  },
  
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  plate: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  vehicleModel: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  vin: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  engineSize: {
    type: String,
    required: true,
    trim: true
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'semi-automatic'],
    required: true
  },
  mileage: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  photos: [{
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
      enum: ['insurance', 'registration', 'inspection', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    expiryDate: {
      type: Date
    }
  }],
  maintenanceHistory: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['service', 'repair', 'inspection'],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    mileage: {
      type: Number,
      required: true,
      min: 0
    },
    workshop: {
      type: String,
      trim: true
    }
  }],
  qrCode: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
vehicleSchema.virtual('fullName').get(function() {
  return `${this.brand} ${this.vehicleModel} ${this.year}`;
});

// Indexes for better performance
vehicleSchema.index({ owner: 1, isActive: 1 });
vehicleSchema.index({ customer: 1, isActive: 1 });
vehicleSchema.index({ plate: 1, owner: 1 }, { unique: true });
vehicleSchema.index({ vin: 1, owner: 1 }, { unique: true });

// Text search index
vehicleSchema.index({
  brand: 'text',
  vehicleModel: 'text',
  plate: 'text',
  vin: 'text'
});

// Static method to find vehicles by owner
vehicleSchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .sort({ createdAt: -1 });
};

// Static method to find vehicles by customer
vehicleSchema.statics.findByCustomer = function(customerId: string) {
  return this.find({ customer: customerId, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .sort({ createdAt: -1 });
};

// Static method to search vehicles
vehicleSchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { plate: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
      { vehicleModel: { $regex: searchTerm, $options: 'i' } },
      { vin: { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .populate('customer', 'firstName lastName phone email')
  .sort({ createdAt: -1 });
};

export default mongoose.model<IVehicle, IVehicleModel>('Vehicle', vehicleSchema);
