import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkOrder extends Document {
  owner: mongoose.Types.ObjectId; // User ID (servis sahibi)
  customer: mongoose.Types.ObjectId; // Customer ID (müşteri)
  vehicle: mongoose.Types.ObjectId; // Vehicle ID
  assignedTechnician?: mongoose.Types.ObjectId; // User ID (teknisyen)
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold' | 'waiting-parts' | 'waiting-approval' | 'quality-check';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'maintenance' | 'repair' | 'inspection' | 'diagnostic' | 'emergency';
  
  // Workflow yönetimi
  workflow: {
    currentStep: number;
    totalSteps: number;
    steps: Array<{
      stepNumber: number;
      name: string;
      status: 'pending' | 'in-progress' | 'completed' | 'skipped';
      required: boolean;
      estimatedTime: number; // dakika
      actualTime?: number;
      completedAt?: Date;
      completedBy?: mongoose.Types.ObjectId;
      notes?: string;
    }>;
    canTransition: (fromStatus: string, toStatus: string) => boolean;
  };
  
  // Durum geçiş geçmişi
  statusHistory: Array<{
    fromStatus: string;
    toStatus: string;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
    reason?: string;
    notes?: string;
  }>;
  
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
    enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold', 'waiting-parts', 'waiting-approval', 'quality-check'],
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
  
  // Workflow yönetimi
  workflow: {
    currentStep: {
      type: Number,
      default: 1,
      min: 1
    },
    totalSteps: {
      type: Number,
      default: 5,
      min: 1
    },
    steps: [{
      stepNumber: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'skipped'],
        default: 'pending'
      },
      required: {
        type: Boolean,
        default: true
      },
      estimatedTime: {
        type: Number,
        required: true,
        min: 0
      },
      actualTime: {
        type: Number,
        min: 0
      },
      completedAt: Date,
      completedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: {
        type: String,
        trim: true
      }
    }]
  },
  
  // Durum geçiş geçmişi
  statusHistory: [{
    fromStatus: {
      type: String,
      required: true
    },
    toStatus: {
      type: String,
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
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
workOrderSchema.index({ owner: 1, isActive: 1 });
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

// Static method to find work orders by owner
workOrderSchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .populate('assignedTechnician', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method to find work orders by customer
workOrderSchema.statics.findByCustomer = function(customerId: string) {
  return this.find({ customer: customerId, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .populate('assignedTechnician', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method to find work orders by vehicle
workOrderSchema.statics.findByVehicle = function(vehicleId: string) {
  return this.find({ vehicle: vehicleId, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .populate('assignedTechnician', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method to search work orders
workOrderSchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { status: { $regex: searchTerm, $options: 'i' } },
      { priority: { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .populate('assignedTechnician', 'firstName lastName')
  .sort({ createdAt: -1 });
};

// Workflow yönetimi methodları
workOrderSchema.methods.initializeWorkflow = function(type: string) {
  const workflowTemplates = {
    maintenance: [
      { stepNumber: 1, name: 'Araç Teslim Alma', estimatedTime: 15, required: true },
      { stepNumber: 2, name: 'Ön Muayene', estimatedTime: 30, required: true },
      { stepNumber: 3, name: 'Bakım İşlemleri', estimatedTime: 120, required: true },
      { stepNumber: 4, name: 'Test ve Kalite Kontrol', estimatedTime: 30, required: true },
      { stepNumber: 5, name: 'Araç Teslim Etme', estimatedTime: 15, required: true }
    ],
    repair: [
      { stepNumber: 1, name: 'Araç Teslim Alma', estimatedTime: 15, required: true },
      { stepNumber: 2, name: 'Arıza Tespiti', estimatedTime: 60, required: true },
      { stepNumber: 3, name: 'Müşteri Onayı', estimatedTime: 0, required: true },
      { stepNumber: 4, name: 'Onarım İşlemleri', estimatedTime: 180, required: true },
      { stepNumber: 5, name: 'Test ve Kalite Kontrol', estimatedTime: 45, required: true },
      { stepNumber: 6, name: 'Araç Teslim Etme', estimatedTime: 15, required: true }
    ],
    inspection: [
      { stepNumber: 1, name: 'Araç Teslim Alma', estimatedTime: 15, required: true },
      { stepNumber: 2, name: 'Detaylı Muayene', estimatedTime: 90, required: true },
      { stepNumber: 3, name: 'Rapor Hazırlama', estimatedTime: 30, required: true },
      { stepNumber: 4, name: 'Müşteri Bilgilendirme', estimatedTime: 15, required: true },
      { stepNumber: 5, name: 'Araç Teslim Etme', estimatedTime: 15, required: true }
    ],
    diagnostic: [
      { stepNumber: 1, name: 'Araç Teslim Alma', estimatedTime: 15, required: true },
      { stepNumber: 2, name: 'Elektronik Tanı', estimatedTime: 45, required: true },
      { stepNumber: 3, name: 'Manuel Kontrol', estimatedTime: 30, required: true },
      { stepNumber: 4, name: 'Rapor Hazırlama', estimatedTime: 20, required: true },
      { stepNumber: 5, name: 'Müşteri Bilgilendirme', estimatedTime: 15, required: true },
      { stepNumber: 6, name: 'Araç Teslim Etme', estimatedTime: 15, required: true }
    ],
    emergency: [
      { stepNumber: 1, name: 'Acil Müdahale', estimatedTime: 30, required: true },
      { stepNumber: 2, name: 'Geçici Çözüm', estimatedTime: 60, required: true },
      { stepNumber: 3, name: 'Müşteri Bilgilendirme', estimatedTime: 10, required: true },
      { stepNumber: 4, name: 'Kalıcı Onarım Planı', estimatedTime: 30, required: true },
      { stepNumber: 5, name: 'Araç Teslim Etme', estimatedTime: 15, required: true }
    ]
  };

  const template = workflowTemplates[type as keyof typeof workflowTemplates] || workflowTemplates.repair;
  
  this.workflow = {
    currentStep: 1,
    totalSteps: template.length,
    steps: template.map((step: any) => ({
      ...step,
      status: 'pending' as const
    }))
  };
  
  return this;
};

// Durum geçiş kuralları
workOrderSchema.methods.canTransitionTo = function(newStatus: string) {
  const validTransitions: { [key: string]: string[] } = {
    'pending': ['in-progress', 'cancelled', 'on-hold'],
    'in-progress': ['completed', 'cancelled', 'on-hold', 'waiting-parts', 'waiting-approval'],
    'waiting-parts': ['in-progress', 'cancelled', 'on-hold'],
    'waiting-approval': ['in-progress', 'cancelled', 'on-hold'],
    'on-hold': ['in-progress', 'cancelled'],
    'quality-check': ['completed', 'in-progress'],
    'completed': [], // Tamamlanan iş emri değiştirilemez
    'cancelled': [] // İptal edilen iş emri değiştirilemez
  };

  return validTransitions[this.status]?.includes(newStatus) || false;
};

// Durum değiştirme
workOrderSchema.methods.changeStatus = function(newStatus: string, changedBy: string, reason?: string, notes?: string) {
  if (!this.canTransitionTo(newStatus)) {
    throw new Error(`Geçersiz durum geçişi: ${this.status} -> ${newStatus}`);
  }

  // Durum geçmişine ekle
  this.statusHistory.push({
    fromStatus: this.status,
    toStatus: newStatus,
    changedAt: new Date(),
    changedBy: changedBy,
    reason: reason,
    notes: notes
  });

  // Durumu güncelle
  this.status = newStatus;

  // Duruma göre tarihleri güncelle
  if (newStatus === 'in-progress' && !this.startDate) {
    this.startDate = new Date();
  } else if (newStatus === 'completed') {
    this.completedDate = new Date();
    if (this.startDate) {
      this.actualDuration = (this.completedDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60);
    }
  }

  return this;
};

// Workflow adımını tamamla
workOrderSchema.methods.completeStep = function(stepNumber: number, completedBy: string, actualTime?: number, notes?: string) {
  const step = this.workflow.steps.find((s: any) => s.stepNumber === stepNumber);
  if (!step) {
    throw new Error(`Adım bulunamadı: ${stepNumber}`);
  }

  step.status = 'completed';
  step.completedAt = new Date();
  step.completedBy = completedBy;
  step.actualTime = actualTime || step.estimatedTime;
  step.notes = notes;

  // Sonraki adıma geç
  if (stepNumber < this.workflow.totalSteps) {
    this.workflow.currentStep = stepNumber + 1;
    const nextStep = this.workflow.steps.find((s: any) => s.stepNumber === stepNumber + 1);
    if (nextStep) {
      nextStep.status = 'in-progress';
    }
  } else {
    // Tüm adımlar tamamlandı
    this.workflow.currentStep = this.workflow.totalSteps;
    this.changeStatus('quality-check', completedBy, 'Tüm adımlar tamamlandı');
  }

  return this;
};

export default mongoose.model<IWorkOrder>('WorkOrder', workOrderSchema);
