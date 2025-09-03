import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  customer: mongoose.Types.ObjectId; // User ID (müşteri)
  vehicle: mongoose.Types.ObjectId; // Vehicle ID
  assignedTechnician?: mongoose.Types.ObjectId; // User ID (teknisyen)
  serviceType: 'maintenance' | 'repair' | 'inspection' | 'diagnostic' | 'emergency' | 'consultation';
  
  // Randevu detayları
  title: string;
  description: string;
  estimatedDuration: number; // dakika cinsinden
  
  // Tarih ve saat bilgileri
  scheduledDate: Date;
  startTime: string; // HH:MM formatında
  endTime: string; // HH:MM formatında
  actualStartTime?: Date;
  actualEndTime?: Date;
  
  // Durum bilgileri
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Müşteri bilgileri
  customerNotes?: string;
  customerPhone?: string;
  customerEmail?: string;
  
  // Teknisyen bilgileri
  technicianNotes?: string;
  internalNotes?: string; // Sadece teknisyenler görebilir
  
  // Bildirim ayarları
  notifications: {
    sms: boolean;
    email: boolean;
    push: boolean;
    reminderHours: number; // Kaç saat önce hatırlatma
  };
  
  // Randevu geçmişi
  history: Array<{
    action: 'created' | 'confirmed' | 'rescheduled' | 'cancelled' | 'started' | 'completed';
    timestamp: Date;
    performedBy: mongoose.Types.ObjectId;
    notes?: string;
    oldValue?: any;
    newValue?: any;
  }>;
  
  // Ek bilgiler
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // Her X gün/hafta/ay/yıl
    endDate?: Date;
    maxOccurrences?: number;
  };
  
  // Bağlantılı iş emri
  relatedWorkOrder?: mongoose.Types.ObjectId;
  
  // Fotoğraflar
  photos: string[];
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
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
  serviceType: {
    type: String,
    enum: ['maintenance', 'repair', 'inspection', 'diagnostic', 'emergency', 'consultation'],
    required: true
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
    required: true,
    trim: true,
    maxlength: 1000
  },
  estimatedDuration: {
    type: Number,
    required: true,
    min: 15,
    max: 480 // 8 saat
  },
  
  // Tarih ve saat bilgileri
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM formatı
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM formatı
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  
  // Durum bilgileri
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true
  },
  
  // Müşteri bilgileri
  customerNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  customerPhone: {
    type: String,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Teknisyen bilgileri
  technicianNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Bildirim ayarları
  notifications: {
    sms: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: false
    },
    reminderHours: {
      type: Number,
      default: 24,
      min: 1,
      max: 168 // 1 hafta
    }
  },
  
  // Randevu geçmişi
  history: [{
    action: {
      type: String,
      enum: ['created', 'confirmed', 'rescheduled', 'cancelled', 'started', 'completed'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    },
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed
  }],
  
  // Tekrarlayan randevu
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      min: 1,
      max: 365
    },
    endDate: {
      type: Date
    },
    maxOccurrences: {
      type: Number,
      min: 1,
      max: 1000
    }
  },
  
  // Bağlantılı iş emri
  relatedWorkOrder: {
    type: Schema.Types.ObjectId,
    ref: 'WorkOrder'
  },
  
  // Fotoğraflar
  photos: [{
    type: String,
    trim: true
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ customer: 1, status: 1 });
appointmentSchema.index({ vehicle: 1, status: 1 });
appointmentSchema.index({ assignedTechnician: 1, status: 1 });
appointmentSchema.index({ scheduledDate: 1, startTime: 1 });
appointmentSchema.index({ status: 1, priority: 1 });
appointmentSchema.index({ createdAt: 1 });

// Text search index
appointmentSchema.index({
  title: 'text',
  description: 'text'
});

// Virtual field for full datetime
appointmentSchema.virtual('scheduledDateTime').get(function() {
  if (!this.scheduledDate || !this.startTime) return null;
  
  const date = new Date(this.scheduledDate);
  const [hours, minutes] = this.startTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return date;
});

// Virtual field for end datetime
appointmentSchema.virtual('endDateTime').get(function() {
  if (!this.scheduledDate || !this.endTime) return null;
  
  const date = new Date(this.scheduledDate);
  const [hours, minutes] = this.endTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return date;
});

// Virtual field for duration in minutes
appointmentSchema.virtual('durationMinutes').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  
  const [startHours, startMinutes] = this.startTime.split(':').map(Number);
  const [endHours, endMinutes] = this.endTime.split(':').map(Number);
  
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  
  return endTotal - startTotal;
});

// Pre-save middleware to add to history
appointmentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.history.push({
      action: this.status as any,
      timestamp: new Date(),
      performedBy: this.assignedTechnician || this.customer,
      notes: `Durum ${this.status} olarak güncellendi`
    });
  }
  next();
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
