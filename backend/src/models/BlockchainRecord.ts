import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockchainRecord extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  workOrderId?: mongoose.Types.ObjectId;
  recordType: 'service_history' | 'maintenance' | 'repair' | 'inspection' | 'warranty';
  data: {
    serviceDate: Date;
    serviceType: string;
    description: string;
    parts: Array<{
      partName: string;
      partNumber: string;
      quantity: number;
      cost: number;
    }>;
    laborHours: number;
    totalCost: number;
    technician: string;
    garage: string;
    mileage: number;
    nextServiceDate?: Date;
  };
  hash: string;
  previousHash?: string;
  blockNumber: number;
  transactionId: string;
  isVerified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
  metadata: {
    ipfsHash?: string;
    timestamp: Date;
    version: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const blockchainRecordSchema = new Schema<IBlockchainRecord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true
  },
  workOrderId: {
    type: Schema.Types.ObjectId,
    ref: 'WorkOrder',
    index: true
  },
  recordType: {
    type: String,
    enum: ['service_history', 'maintenance', 'repair', 'inspection', 'warranty'],
    required: true
  },
  data: {
    serviceDate: {
      type: Date,
      required: true
    },
    serviceType: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    parts: [{
      partName: String,
      partNumber: String,
      quantity: Number,
      cost: Number
    }],
    laborHours: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      required: true
    },
    technician: {
      type: String,
      required: true
    },
    garage: {
      type: String,
      required: true
    },
    mileage: {
      type: Number,
      required: true
    },
    nextServiceDate: Date
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  previousHash: String,
  blockNumber: {
    type: Number,
    required: true,
    index: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  verifiedBy: String,
  metadata: {
    ipfsHash: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    version: {
      type: String,
      default: '1.0.0'
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying (hash and transactionId already have unique: true)
blockchainRecordSchema.index({ userId: 1, vehicleId: 1, recordType: 1 });
blockchainRecordSchema.index({ isVerified: 1 });
blockchainRecordSchema.index({ 'data.serviceDate': -1 });

// Virtual for verification status
blockchainRecordSchema.virtual('verificationStatus').get(function() {
  if (this.isVerified) {
    return 'verified';
  }
  return 'pending';
});

// Pre-save middleware to generate hash if not provided
blockchainRecordSchema.pre('save', function(next) {
  if (!this.hash) {
    const dataString = JSON.stringify({
      userId: this.userId,
      vehicleId: this.vehicleId,
      recordType: this.recordType,
      data: this.data,
      timestamp: this.metadata.timestamp
    });
    this.hash = require('crypto').createHash('sha256').update(dataString).digest('hex');
  }
  next();
});

export const BlockchainRecord = mongoose.model<IBlockchainRecord>('BlockchainRecord', blockchainRecordSchema);
