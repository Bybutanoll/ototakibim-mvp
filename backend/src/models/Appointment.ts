import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  owner: mongoose.Types.ObjectId; // User ID (servis sahibi)
  customer: mongoose.Types.ObjectId; // Customer ID
  vehicle: mongoose.Types.ObjectId; // Vehicle ID
  assignedTechnician?: mongoose.Types.ObjectId; // User ID (teknisyen)
  
  // Randevu detayları
  title: string; // Randevu başlığı
  description?: string; // Açıklama
  type: 'maintenance' | 'repair' | 'inspection' | 'diagnostic' | 'consultation' | 'pickup' | 'delivery';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Zamanlama
  scheduledDate: Date; // Planlanan tarih
  startTime: Date; // Başlangıç saati
  endTime: Date; // Bitiş saati
  estimatedDuration: number; // Tahmini süre (dakika)
  actualDuration?: number; // Gerçek süre (dakika)
  
  // Durum
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  
  // Müşteri bilgileri
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
  
  // Araç bilgileri
  vehicleInfo: {
    plate: string;
    brand: string;
    model: string;
    year: number;
    mileage?: number;
    vin?: string;
  };
  
  // Teknisyen bilgileri
  technicianInfo?: {
    name: string;
    phone?: string;
    email?: string;
    specialization?: string[];
  };
  
  // Hizmet detayları
  services: Array<{
    name: string;
    description?: string;
    estimatedDuration: number; // dakika
    estimatedCost: number;
    actualCost?: number;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  }>;
  
  // Özel gereksinimler
  specialRequirements: Array<{
    type: 'equipment' | 'space' | 'personnel' | 'material' | 'other';
    description: string;
    isRequired: boolean;
    provided: boolean;
  }>;
  
  // Hatırlatmalar
  reminders: Array<{
    type: 'sms' | 'email' | 'call' | 'push';
    scheduledAt: Date;
    sentAt?: Date;
    status: 'pending' | 'sent' | 'failed';
    message?: string;
  }>;
  
  // Notlar ve yorumlar
  notes: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    isInternal: boolean; // Sadece teknisyenler görebilir
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
  
  // Müşteri onayı
  customerConfirmation: {
    confirmed: boolean;
    confirmedAt?: Date;
    confirmedBy?: mongoose.Types.ObjectId;
    confirmationMethod?: 'phone' | 'email' | 'sms' | 'in-person';
    notes?: string;
  };
  
  // İptal bilgileri
  cancellationInfo?: {
    cancelledAt: Date;
    cancelledBy: mongoose.Types.ObjectId;
    reason: string;
    refundAmount?: number;
    refundStatus?: 'pending' | 'processed' | 'denied';
  };
  
  // Yeniden planlama
  reschedulingInfo?: {
    originalDate: Date;
    rescheduledAt: Date;
    rescheduledBy: mongoose.Types.ObjectId;
    reason: string;
    newDate: Date;
    newStartTime: Date;
    newEndTime: Date;
  };
  
  // Takip bilgileri
  tracking: {
    createdAt: Date;
    updatedAt: Date;
    lastReminderSent?: Date;
    reminderCount: number;
    noShowCount: number;
  };
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
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
  
  // Randevu detayları
  title: {
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
  type: {
    type: String,
    enum: ['maintenance', 'repair', 'inspection', 'diagnostic', 'consultation', 'pickup', 'delivery'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true
  },
  
  // Zamanlama
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  estimatedDuration: {
    type: Number,
    required: true,
    min: 15, // Minimum 15 dakika
    max: 480 // Maximum 8 saat
  },
  actualDuration: {
    type: Number,
    min: 0,
    max: 480
  },
  
  // Durum
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled',
    required: true,
    index: true
  },
  
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
    notes: {
      type: String,
      trim: true,
      maxlength: 500
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
    mileage: {
      type: Number,
      min: 0
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true
    }
  },
  
  // Teknisyen bilgileri
  technicianInfo: {
    name: {
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
    },
    specialization: [{
      type: String,
      trim: true
    }]
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
    estimatedDuration: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedCost: {
      type: Number,
      required: true,
      min: 0
    },
    actualCost: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    }
  }],
  
  // Özel gereksinimler
  specialRequirements: [{
    type: {
      type: String,
      enum: ['equipment', 'space', 'personnel', 'material', 'other'],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    provided: {
      type: Boolean,
      default: false
    }
  }],
  
  // Hatırlatmalar
  reminders: [{
    type: {
      type: String,
      enum: ['sms', 'email', 'call', 'push'],
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    message: {
      type: String,
      trim: true
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
  
  // Müşteri onayı
  customerConfirmation: {
    confirmed: {
      type: Boolean,
      default: false
    },
    confirmedAt: Date,
    confirmedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    confirmationMethod: {
      type: String,
      enum: ['phone', 'email', 'sms', 'in-person']
    },
    notes: {
      type: String,
      trim: true
    }
  },
  
  // İptal bilgileri
  cancellationInfo: {
    cancelledAt: Date,
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      trim: true
    },
    refundAmount: {
      type: Number,
      min: 0
    },
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'denied']
    }
  },
  
  // Yeniden planlama
  reschedulingInfo: {
    originalDate: Date,
    rescheduledAt: Date,
    rescheduledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      trim: true
    },
    newDate: Date,
    newStartTime: Date,
    newEndTime: Date
  },
  
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
    noShowCount: {
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
appointmentSchema.index({ owner: 1, isActive: 1 });
appointmentSchema.index({ customer: 1, status: 1 });
appointmentSchema.index({ vehicle: 1, status: 1 });
appointmentSchema.index({ assignedTechnician: 1, status: 1 });
appointmentSchema.index({ scheduledDate: 1, startTime: 1 });
appointmentSchema.index({ status: 1, priority: 1 });
appointmentSchema.index({ 'customerInfo.phone': 1 });
appointmentSchema.index({ 'vehicleInfo.plate': 1 });

// Text search index
appointmentSchema.index({
  title: 'text',
  description: 'text',
  'customerInfo.name': 'text',
  'vehicleInfo.plate': 'text'
});

// Virtual fields
appointmentSchema.virtual('isOverdue').get(function() {
  return this.status === 'scheduled' && new Date() > this.startTime;
});

appointmentSchema.virtual('isToday').get(function() {
  const today = new Date();
  const appointmentDate = new Date(this.scheduledDate);
  return appointmentDate.toDateString() === today.toDateString();
});

appointmentSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const appointmentTime = new Date(this.startTime);
  return appointmentTime > now && this.status === 'scheduled';
});

appointmentSchema.virtual('totalEstimatedCost').get(function() {
  return this.services.reduce((total, service) => total + service.estimatedCost, 0);
});

appointmentSchema.virtual('totalActualCost').get(function() {
  return this.services.reduce((total, service) => total + (service.actualCost || 0), 0);
});

// Static methods
appointmentSchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true })
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .populate('assignedTechnician', 'firstName lastName')
    .sort({ startTime: 1 });
};

appointmentSchema.statics.findByDate = function(ownerId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    owner: ownerId,
    isActive: true,
    scheduledDate: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .populate('assignedTechnician', 'firstName lastName')
  .sort({ startTime: 1 });
};

appointmentSchema.statics.findByTechnician = function(technicianId: string, startDate: Date, endDate: Date) {
  return this.find({
    assignedTechnician: technicianId,
    isActive: true,
    startTime: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .sort({ startTime: 1 });
};

appointmentSchema.statics.findUpcoming = function(ownerId: string, limit: number = 10) {
  return this.find({
    owner: ownerId,
    isActive: true,
    startTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .populate('assignedTechnician', 'firstName lastName')
  .sort({ startTime: 1 })
  .limit(limit);
};

appointmentSchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { 'customerInfo.name': { $regex: searchTerm, $options: 'i' } },
      { 'customerInfo.phone': { $regex: searchTerm, $options: 'i' } },
      { 'vehicleInfo.plate': { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .populate('customer', 'firstName lastName phone email')
  .populate('vehicle', 'plate brand vehicleModel year')
  .populate('assignedTechnician', 'firstName lastName')
  .sort({ startTime: 1 });
};

// Instance methods
appointmentSchema.methods.confirm = function(confirmedBy: string, method: string, notes?: string) {
  this.customerConfirmation.confirmed = true;
  this.customerConfirmation.confirmedAt = new Date();
  this.customerConfirmation.confirmedBy = confirmedBy;
  this.customerConfirmation.confirmationMethod = method;
  this.customerConfirmation.notes = notes;
  
  if (this.status === 'scheduled') {
    this.status = 'confirmed';
    this.statusHistory.push({
      fromStatus: 'scheduled',
      toStatus: 'confirmed',
      changedBy: confirmedBy,
      reason: 'Müşteri onayı',
      notes: notes
    });
  }
  
  return this;
};

appointmentSchema.methods.cancel = function(cancelledBy: string, reason: string, refundAmount?: number) {
  this.status = 'cancelled';
  this.cancellationInfo = {
    cancelledAt: new Date(),
    cancelledBy: cancelledBy,
    reason: reason,
    refundAmount: refundAmount,
    refundStatus: refundAmount ? 'pending' : undefined
  };
  
  this.statusHistory.push({
    fromStatus: this.status,
    toStatus: 'cancelled',
    changedBy: cancelledBy,
    reason: reason
  });
  
  return this;
};

appointmentSchema.methods.reschedule = function(newDate: Date, newStartTime: Date, newEndTime: Date, rescheduledBy: string, reason: string) {
  this.reschedulingInfo = {
    originalDate: this.scheduledDate,
    rescheduledAt: new Date(),
    rescheduledBy: rescheduledBy,
    reason: reason,
    newDate: newDate,
    newStartTime: newStartTime,
    newEndTime: newEndTime
  };
  
  this.scheduledDate = newDate;
  this.startTime = newStartTime;
  this.endTime = newEndTime;
  this.status = 'rescheduled';
  
  this.statusHistory.push({
    fromStatus: this.status,
    toStatus: 'rescheduled',
    changedBy: rescheduledBy,
    reason: reason
  });
  
  return this;
};

appointmentSchema.methods.addReminder = function(type: string, scheduledAt: Date, message?: string) {
  this.reminders.push({
    type: type,
    scheduledAt: scheduledAt,
    message: message
  });
  
  return this;
};

appointmentSchema.methods.markNoShow = function(markedBy: string, notes?: string) {
  this.status = 'no-show';
  this.tracking.noShowCount += 1;
  
  this.statusHistory.push({
    fromStatus: this.status,
    toStatus: 'no-show',
    changedBy: markedBy,
    reason: 'Müşteri gelmedi',
    notes: notes
  });
  
  return this;
};

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);