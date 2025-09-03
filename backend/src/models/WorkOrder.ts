import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkOrder extends Document {
  customer: mongoose.Types.ObjectId; // User ID (müşteri)
  vehicle: mongoose.Types.ObjectId; // Vehicle ID
  assignedTechnician?: mongoose.Types.ObjectId; // User ID (teknisyen)
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'maintenance' | 'repair' | 'inspection' | 'diagnostic' | 'emergency';
  
  // İş emri detayları
  title: string;
  description: string;
  estimatedDuration: number; // saat cinsinden
  actualDuration?: number; // saat cinsinden
  
  // Tarih bilgileri
  scheduledDate: Date;
  startDate?: Date;
  completedDate?: Date;
  
  // Maliyet bilgileri
  estimatedCost: number;
  actualCost?: number;
  laborCost: number;
  partsCost: number;
  taxRate: number;
  
  // Parça listesi
  parts: Array<{
    name: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    supplier?: string;
    warranty?: string;
  }>;
  
  // İş adımları
  workSteps: Array<{
    stepNumber: number;
    description: string;
    estimatedTime: number; // dakika cinsinden
    actualTime?: number; // dakika cinsinden
    status: 'pending' | 'in-progress' | 'completed';
    notes?: string;
    completedBy?: mongoose.Types.ObjectId;
    completedAt?: Date;
  }>;
  
  // Müşteri onayı
  customerApproval: {
    required: boolean;
    requestedAt?: Date;
    approvedAt?: Date;
    approvedBy?: mongoose.Types.ObjectId;
    notes?: string;
  };
  
  // Fotoğraflar ve belgeler
  photos: string[];
  documents: Array<{
    name: string;
    type: 'invoice' | 'warranty' | 'manual' | 'other';
    url: string;
    uploadedAt: Date;
  }>;
  
  // Notlar ve yorumlar
  notes: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    isInternal: boolean; // Sadece teknisyenler görebilir
  }>;
  
  // Kalite kontrol
  qualityCheck: {
    performedBy?: mongoose.Types.ObjectId;
    performedAt?: Date;
    passed: boolean;
    notes?: string;
    checklist: Array<{
      item: string;
      checked: boolean;
      notes?: string;
    }>;
  };
  
  // Garanti bilgileri
  warranty: {
    type: 'none' | 'parts' | 'labor' | 'full';
    duration: number; // gün cinsinden
    startDate?: Date;
    terms?: string;
  };
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const workOrderSchema = new Schema<IWorkOrder>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true
  },
  assignedTechnician: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
    default: 'pending',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true
  },
  type: {
    type: String,
    enum: ['maintenance', 'repair', 'inspection', 'diagnostic', 'emergency'],
    required: true
  },
  
  // İş emri detayları
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  estimatedDuration: {
    type: Number,
    required: true,
    min: 0.5,
    max: 168 // 1 hafta
  },
  actualDuration: {
    type: Number,
    min: 0,
    max: 168
  },
  
  // Tarih bilgileri
  scheduledDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  
  // Maliyet bilgileri
  estimatedCost: {
    type: Number,
    required: true,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  laborCost: {
    type: Number,
    required: true,
    min: 0
  },
  partsCost: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 18 // %18 KDV
  },
  
  // Parça listesi
  parts: [{
    name: {
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
    supplier: {
      type: String,
      trim: true
    },
    warranty: {
      type: String,
      trim: true
    }
  }],
  
  // İş adımları
  workSteps: [{
    stepNumber: {
      type: Number,
      required: true,
      min: 1
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
      max: 480 // 8 saat
    },
    actualTime: {
      type: Number,
      min: 1,
      max: 480
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    },
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date
    }
  }],
  
  // Müşteri onayı
  customerApproval: {
    required: {
      type: Boolean,
      default: false
    },
    requestedAt: {
      type: Date
    },
    approvedAt: {
      type: Date
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  
  // Fotoğraflar ve belgeler
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
      enum: ['invoice', 'warranty', 'manual', 'other'],
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
    }
  }],
  
  // Notlar ve yorumlar
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
  
  // Kalite kontrol
  qualityCheck: {
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date
    },
    passed: {
      type: Boolean
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    checklist: [{
      item: {
        type: String,
        required: true,
        trim: true
      },
      checked: {
        type: Boolean,
        default: false
      },
      notes: {
        type: String,
        trim: true,
        maxlength: 200
      }
    }]
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
    startDate: {
      type: Date
    },
    terms: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
workOrderSchema.index({ customer: 1, status: 1 });
workOrderSchema.index({ vehicle: 1, status: 1 });
workOrderSchema.index({ assignedTechnician: 1, status: 1 });
workOrderSchema.index({ scheduledDate: 1, status: 1 });
workOrderSchema.index({ status: 1, priority: 1 });
workOrderSchema.index({ createdAt: 1 });

// Text search index
workOrderSchema.index({
  title: 'text',
  description: 'text'
});

export default mongoose.model<IWorkOrder>('WorkOrder', workOrderSchema);
