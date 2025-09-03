import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  owner: mongoose.Types.ObjectId; // User ID
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for owner and plate
vehicleSchema.index({ owner: 1, plate: 1 }, { unique: true });

// Text search index
vehicleSchema.index({
  brand: 'text',
  model: 'text',
  plate: 'text',
  vin: 'text'
});

export default mongoose.model<IVehicle>('Vehicle', vehicleSchema);
