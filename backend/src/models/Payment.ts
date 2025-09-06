import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  owner: mongoose.Types.ObjectId; // User ID (servis sahibi)
  customer: mongoose.Types.ObjectId; // Customer ID
  vehicle: mongoose.Types.ObjectId; // Vehicle ID
  workOrder?: mongoose.Types.ObjectId; // Work Order ID
  appointment?: mongoose.Types.ObjectId; // Appointment ID
  
  // Fatura bilgileri
  invoiceNumber: string; // Fatura numarası
  invoiceDate: Date; // Fatura tarihi
  dueDate: Date; // Vade tarihi
  
  // Ödeme detayları
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'check' | 'installment' | 'other';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  
  // Tutar bilgileri
  subtotal: number; // Ara toplam (KDV hariç)
  taxRate: number; // Vergi oranı (%)
  taxAmount: number; // Vergi tutarı
  discountRate: number; // İndirim oranı (%)
  discountAmount: number; // İndirim tutarı
  totalAmount: number; // Toplam tutar
  paidAmount: number; // Ödenen tutar
  remainingAmount: number; // Kalan tutar
  
  // Hizmet detayları
  services: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate: number;
    taxAmount: number;
  }>;
  
  // Parça detayları
  parts: Array<{
    partId: mongoose.Types.ObjectId;
    partNumber: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate: number;
    taxAmount: number;
  }>;
  
  // Ödeme geçmişi
  paymentHistory: Array<{
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    referenceNumber?: string;
    notes?: string;
    processedBy: mongoose.Types.ObjectId;
  }>;
  
  // Taksit bilgileri
  installments?: Array<{
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: 'pending' | 'paid' | 'overdue';
    paymentMethod?: string;
    referenceNumber?: string;
  }>;
  
  // Müşteri bilgileri
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      street: string;
      district: string;
      city: string;
      postalCode: string;
    };
    taxNumber?: string;
    taxOffice?: string;
  };
  
  // Araç bilgileri
  vehicleInfo: {
    plate: string;
    brand: string;
    model: string;
    year: number;
    vin?: string;
  };
  
  // Özel notlar
  notes: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    isInternal: boolean;
  }>;
  
  // Durum geçmişi
  statusHistory: Array<{
    fromStatus: string;
    toStatus: string;
    changedAt: Date;
    changedBy: mongoose.Types.ObjectId;
    reason?: string;
    notes?: string;
  }>;
  
  // İade bilgileri
  refundInfo?: {
    refundAmount: number;
    refundDate: Date;
    refundReason: string;
    refundMethod: string;
    processedBy: mongoose.Types.ObjectId;
    notes?: string;
  };
  
  // Belge bilgileri
  documents: Array<{
    type: 'invoice' | 'receipt' | 'contract' | 'warranty' | 'other';
    name: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
  }>;
  
  // Takip bilgileri
  tracking: {
    createdAt: Date;
    updatedAt: Date;
    lastReminderSent?: Date;
    reminderCount: number;
    overdueDays: number;
  };
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
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
  workOrder: {
    type: Schema.Types.ObjectId,
    ref: 'WorkOrder',
    index: true
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    index: true
  },
  
  // Fatura bilgileri
  invoiceNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    index: true
  },
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  
  // Ödeme detayları
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'check', 'installment', 'other'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue', 'cancelled', 'refunded'],
    default: 'pending',
    required: true,
    index: true
  },
  
  // Tutar bilgileri
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 20 // KDV %20
  },
  taxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  discountAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  remainingAmount: {
    type: Number,
    min: 0
  },
  
  // Hizmet detayları
  services: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    taxRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // Parça detayları
  parts: [{
    partId: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    partNumber: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    taxRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // Ödeme geçmişi
  paymentHistory: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true
    },
    referenceNumber: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Taksit bilgileri
  installments: [{
    installmentNumber: {
      type: Number,
      required: true,
      min: 1
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      trim: true
    },
    referenceNumber: {
      type: String,
      trim: true
    }
  }],
  
  // Müşteri bilgileri
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      street: {
        type: String,
        trim: true
      },
      district: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      postalCode: {
        type: String,
        trim: true
      }
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
  
  // Araç bilgileri
  vehicleInfo: {
    plate: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
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
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true
    }
  },
  
  // Özel notlar
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
  
  // Durum geçmişi
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
  
  // İade bilgileri
  refundInfo: {
    refundAmount: {
      type: Number,
      min: 0
    },
    refundDate: Date,
    refundReason: {
      type: String,
      trim: true
    },
    refundMethod: {
      type: String,
      trim: true
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  
  // Belge bilgileri
  documents: [{
    type: {
      type: String,
      enum: ['invoice', 'receipt', 'contract', 'warranty', 'other'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
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
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Takip bilgileri
  tracking: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    lastReminderSent: Date,
    reminderCount: {
      type: Number,
      default: 0,
      min: 0
    },
    overdueDays: {
      type: Number,
      default: 0,
      min: 0
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
paymentSchema.index({ owner: 1, isActive: 1 });
paymentSchema.index({ customer: 1, paymentStatus: 1 });
paymentSchema.index({ vehicle: 1, paymentStatus: 1 });
paymentSchema.index({ workOrder: 1 });
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ invoiceNumber: 1, owner: 1 }, { unique: true });
paymentSchema.index({ paymentStatus: 1, dueDate: 1 });
paymentSchema.index({ 'customerInfo.phone': 1 });
paymentSchema.index({ 'vehicleInfo.plate': 1 });

// Text search index
paymentSchema.index({
  invoiceNumber: 'text',
  'customerInfo.name': 'text',
  'vehicleInfo.plate': 'text'
});

// Virtual fields
paymentSchema.virtual('isOverdue').get(function() {
  return this.paymentStatus === 'pending' && new Date() > this.dueDate;
});

paymentSchema.virtual('isFullyPaid').get(function() {
  return this.paidAmount >= this.totalAmount;
});

paymentSchema.virtual('paymentProgress').get(function() {
  if (this.totalAmount === 0) return 100;
  return (this.paidAmount / this.totalAmount) * 100;
});

paymentSchema.virtual('isOverdue').get(function(this: any) {
  if (this.status === 'paid' || this.status === 'cancelled') return false;
  if (!this.dueDate) return false;
  return new Date() > this.dueDate;
});

paymentSchema.virtual('daysOverdue').get(function(this: any) {
  if (!this.isOverdue) return 0;
  const today = new Date();
  const diffTime = today.getTime() - this.dueDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static methods
paymentSchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .populate('workOrder', 'workOrderNumber status')
    .populate('appointment', 'title status')
    .populate('paymentHistory.processedBy', 'firstName lastName')
    .populate('statusHistory.changedBy', 'firstName lastName')
    .populate('notes.author', 'firstName lastName')
    .sort({ invoiceDate: -1 });
};

paymentSchema.statics.findOverdue = function(ownerId: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    paymentStatus: { $in: ['pending', 'partial'] },
    dueDate: { $lt: new Date() }
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .sort({ dueDate: 1 });
};

paymentSchema.statics.findByStatus = function(ownerId: string, status: string) {
  return this.find({ owner: ownerId, paymentStatus: status, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .sort({ invoiceDate: -1 });
};

paymentSchema.statics.findByDateRange = function(ownerId: string, startDate: Date, endDate: Date) {
  return this.find({
    owner: ownerId,
    isActive: true,
    invoiceDate: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .sort({ invoiceDate: -1 });
};

paymentSchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { invoiceNumber: { $regex: searchTerm, $options: 'i' } },
      { 'customerInfo.name': { $regex: searchTerm, $options: 'i' } },
      { 'customerInfo.phone': { $regex: searchTerm, $options: 'i' } },
      { 'vehicleInfo.plate': { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .sort({ invoiceDate: -1 });
};

// Instance methods
paymentSchema.methods.addPayment = function(amount: number, paymentMethod: string, processedBy: string, referenceNumber?: string, notes?: string) {
  if (amount <= 0) {
    throw new Error('Ödeme tutarı pozitif olmalıdır');
  }

  if (amount > this.remainingAmount) {
    throw new Error('Ödeme tutarı kalan tutardan fazla olamaz');
  }

  this.paidAmount += amount;
  this.remainingAmount = this.totalAmount - this.paidAmount;

  this.paymentHistory.push({
    amount: amount,
    paymentMethod: paymentMethod,
    referenceNumber: referenceNumber,
    notes: notes,
    processedBy: processedBy
  });

  // Update payment status
  if (this.remainingAmount === 0) {
    this.paymentStatus = 'paid';
  } else if (this.paidAmount > 0) {
    this.paymentStatus = 'partial';
  }

  // Update status history
  this.statusHistory.push({
    fromStatus: this.paymentStatus,
    toStatus: this.paymentStatus,
    changedBy: processedBy,
    reason: 'Ödeme eklendi',
    notes: `${amount} TL ödeme eklendi`
  });

  return this;
};

paymentSchema.methods.processRefund = function(refundAmount: number, refundReason: string, refundMethod: string, processedBy: string, notes?: string) {
  if (refundAmount <= 0) {
    throw new Error('İade tutarı pozitif olmalıdır');
  }

  if (refundAmount > this.paidAmount) {
    throw new Error('İade tutarı ödenen tutardan fazla olamaz');
  }

  this.refundInfo = {
    refundAmount: refundAmount,
    refundDate: new Date(),
    refundReason: refundReason,
    refundMethod: refundMethod,
    processedBy: processedBy,
    notes: notes
  };

  this.paidAmount -= refundAmount;
  this.remainingAmount = this.totalAmount - this.paidAmount;
  this.paymentStatus = 'refunded';

  this.statusHistory.push({
    fromStatus: this.paymentStatus,
    toStatus: 'refunded',
    changedBy: processedBy,
    reason: 'İade işlemi',
    notes: `${refundAmount} TL iade edildi`
  });

  return this;
};

paymentSchema.methods.cancel = function(cancelledBy: string, reason: string) {
  this.paymentStatus = 'cancelled';
  
  this.statusHistory.push({
    fromStatus: this.paymentStatus,
    toStatus: 'cancelled',
    changedBy: cancelledBy,
    reason: reason
  });

  return this;
};

paymentSchema.methods.addNote = function(author: string, content: string, isInternal: boolean = false) {
  this.notes.push({
    author: author,
    content: content,
    isInternal: isInternal
  });

  return this;
};

export default mongoose.model<IPayment>('Payment', paymentSchema);
