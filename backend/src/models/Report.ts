import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  owner: mongoose.Types.ObjectId; // User ID (servis sahibi)
  
  // Rapor bilgileri
  reportType: 'revenue' | 'customer' | 'vehicle' | 'work_order' | 'inventory' | 'appointment' | 'payment' | 'custom';
  reportName: string; // Rapor adı
  reportDescription?: string; // Rapor açıklaması
  
  // Tarih aralığı
  dateRange: {
    startDate: Date;
    endDate: Date;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  };
  
  // Filtreler
  filters: {
    customerIds?: mongoose.Types.ObjectId[];
    vehicleIds?: mongoose.Types.ObjectId[];
    workOrderIds?: mongoose.Types.ObjectId[];
    paymentStatuses?: string[];
    workOrderStatuses?: string[];
    appointmentStatuses?: string[];
    serviceTypes?: string[];
    paymentMethods?: string[];
    customFilters?: Array<{
      field: string;
      operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex';
      value: any;
    }>;
  };
  
  // Rapor verileri
  data: {
    summary: {
      totalRecords: number;
      totalRevenue?: number;
      totalCost?: number;
      totalProfit?: number;
      averageValue?: number;
      growthRate?: number;
    };
    
    // Zaman serisi verileri
    timeSeries?: Array<{
      date: Date;
      value: number;
      label?: string;
    }>;
    
    // Kategori bazlı veriler
    categories?: Array<{
      name: string;
      value: number;
      percentage: number;
      color?: string;
    }>;
    
    // Detaylı veriler
    details?: Array<{
      id: string;
      name: string;
      value: number;
      date: Date;
      status?: string;
      metadata?: any;
    }>;
    
    // Karşılaştırma verileri
    comparison?: {
      previousPeriod: {
        value: number;
        percentage: number;
      };
      samePeriodLastYear: {
        value: number;
        percentage: number;
      };
    };
  };
  
  // Grafik konfigürasyonu
  chartConfig: {
    type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
    title: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    showLegend: boolean;
    showGrid: boolean;
    colors?: string[];
  };
  
  // Rapor durumu
  status: 'generating' | 'completed' | 'failed' | 'scheduled';
  generatedAt?: Date;
  generatedBy: mongoose.Types.ObjectId;
  
  // Zamanlanmış raporlar
  schedule?: {
    isScheduled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number; // 0-6 (Pazar-Cumartesi)
    dayOfMonth?: number; // 1-31
    time: string; // HH:MM format
    recipients: string[]; // Email listesi
    lastSent?: Date;
    nextRun?: Date;
  };
  
  // Export seçenekleri
  exportOptions: {
    formats: ('pdf' | 'excel' | 'csv' | 'json')[];
    includeCharts: boolean;
    includeDetails: boolean;
    includeSummary: boolean;
    customTemplate?: string;
  };
  
  // Rapor geçmişi
  history: Array<{
    action: 'created' | 'generated' | 'exported' | 'scheduled' | 'modified';
    timestamp: Date;
    performedBy: mongoose.Types.ObjectId;
    details?: string;
  }>;
  
  // Paylaşım ayarları
  sharing: {
    isPublic: boolean;
    shareToken?: string;
    allowedUsers?: mongoose.Types.ObjectId[];
    expiresAt?: Date;
  };
  
  // Metadata
  metadata: {
    version: string;
    generatedWith: string; // API version, system version
    dataSource: string; // Which collections were used
    processingTime: number; // Milliseconds
    recordCount: number;
  };
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Rapor bilgileri
  reportType: {
    type: String,
    enum: ['revenue', 'customer', 'vehicle', 'work_order', 'inventory', 'appointment', 'payment', 'custom'],
    required: true,
    index: true
  },
  reportName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  reportDescription: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Tarih aralığı
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
      required: true
    }
  },
  
  // Filtreler
  filters: {
    customerIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    }],
    vehicleIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
    }],
    workOrderIds: [{
      type: Schema.Types.ObjectId,
      ref: 'WorkOrder'
    }],
    paymentStatuses: [String],
    workOrderStatuses: [String],
    appointmentStatuses: [String],
    serviceTypes: [String],
    paymentMethods: [String],
    customFilters: [{
      field: {
        type: String,
        required: true
      },
      operator: {
        type: String,
        enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'regex'],
        required: true
      },
      value: Schema.Types.Mixed
    }]
  },
  
  // Rapor verileri
  data: {
    summary: {
      totalRecords: {
        type: Number,
        default: 0
      },
      totalRevenue: Number,
      totalCost: Number,
      totalProfit: Number,
      averageValue: Number,
      growthRate: Number
    },
    
    timeSeries: [{
      date: {
        type: Date,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      label: String
    }],
    
    categories: [{
      name: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      percentage: {
        type: Number,
        required: true
      },
      color: String
    }],
    
    details: [{
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      status: String,
      metadata: Schema.Types.Mixed
    }],
    
    comparison: {
      previousPeriod: {
        value: Number,
        percentage: Number
      },
      samePeriodLastYear: {
        value: Number,
        percentage: Number
      }
    }
  },
  
  // Grafik konfigürasyonu
  chartConfig: {
    type: {
      type: String,
      enum: ['line', 'bar', 'pie', 'doughnut', 'area', 'scatter'],
      default: 'bar'
    },
    title: {
      type: String,
      required: true
    },
    xAxisLabel: String,
    yAxisLabel: String,
    showLegend: {
      type: Boolean,
      default: true
    },
    showGrid: {
      type: Boolean,
      default: true
    },
    colors: [String]
  },
  
  // Rapor durumu
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'scheduled'],
    default: 'generating',
    index: true
  },
  generatedAt: Date,
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Zamanlanmış raporlar
  schedule: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly']
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31
    },
    time: String,
    recipients: [String],
    lastSent: Date,
    nextRun: Date
  },
  
  // Export seçenekleri
  exportOptions: {
    formats: [{
      type: String,
      enum: ['pdf', 'excel', 'csv', 'json']
    }],
    includeCharts: {
      type: Boolean,
      default: true
    },
    includeDetails: {
      type: Boolean,
      default: true
    },
    includeSummary: {
      type: Boolean,
      default: true
    },
    customTemplate: String
  },
  
  // Rapor geçmişi
  history: [{
    action: {
      type: String,
      enum: ['created', 'generated', 'exported', 'scheduled', 'modified'],
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
    details: String
  }],
  
  // Paylaşım ayarları
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true
    },
    allowedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    expiresAt: Date
  },
  
  // Metadata
  metadata: {
    version: {
      type: String,
      default: '1.0'
    },
    generatedWith: String,
    dataSource: String,
    processingTime: Number,
    recordCount: {
      type: Number,
      default: 0
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
reportSchema.index({ owner: 1, isActive: 1 });
reportSchema.index({ reportType: 1, status: 1 });
reportSchema.index({ 'dateRange.startDate': 1, 'dateRange.endDate': 1 });
reportSchema.index({ 'schedule.nextRun': 1 });
// shareToken already has unique: true, no need for separate index

// Text search index
reportSchema.index({
  reportName: 'text',
  reportDescription: 'text'
});

// Virtual fields
reportSchema.virtual('isOverdue').get(function() {
  if (!this.schedule?.isScheduled || !this.schedule?.nextRun) return false;
  return new Date() > this.schedule.nextRun;
});

reportSchema.virtual('canExport').get(function() {
  return this.status === 'completed' && this.data?.summary?.totalRecords > 0;
});

reportSchema.virtual('isShared').get(function() {
  return this.sharing?.isPublic || (this.sharing?.shareToken && this.sharing?.expiresAt && new Date() < this.sharing.expiresAt);
});

// Static methods
reportSchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true })
    .populate('generatedBy', 'firstName lastName')
    .populate('history.performedBy', 'firstName lastName')
    .sort({ createdAt: -1 });
};

reportSchema.statics.findByType = function(ownerId: string, reportType: string) {
  return this.find({ owner: ownerId, reportType, isActive: true })
    .populate('generatedBy', 'firstName lastName')
    .sort({ createdAt: -1 });
};

reportSchema.statics.findScheduled = function() {
  return this.find({
    'schedule.isScheduled': true,
    'schedule.nextRun': { $lte: new Date() },
    isActive: true
  })
  .populate('owner', 'firstName lastName email')
  .populate('generatedBy', 'firstName lastName');
};

reportSchema.statics.findByDateRange = function(ownerId: string, startDate: Date, endDate: Date) {
  return this.find({
    owner: ownerId,
    isActive: true,
    'dateRange.startDate': { $gte: startDate },
    'dateRange.endDate': { $lte: endDate }
  })
  .populate('generatedBy', 'firstName lastName')
  .sort({ createdAt: -1 });
};

// Instance methods
reportSchema.methods.addHistory = function(action: string, performedBy: string, details?: string) {
  this.history.push({
    action,
    performedBy,
    details
  });
  return this;
};

reportSchema.methods.generateShareToken = function() {
  const crypto = require('crypto');
  this.sharing.shareToken = crypto.randomBytes(32).toString('hex');
  return this;
};

reportSchema.methods.scheduleNextRun = function() {
  if (!this.schedule?.isScheduled) return this;
  
  const now = new Date();
  let nextRun = new Date();
  
  switch (this.schedule.frequency) {
    case 'daily':
      nextRun.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      nextRun.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      nextRun.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      nextRun.setMonth(now.getMonth() + 3);
      break;
  }
  
  this.schedule.nextRun = nextRun;
  return this;
};

export default mongoose.model<IReport>('Report', reportSchema);