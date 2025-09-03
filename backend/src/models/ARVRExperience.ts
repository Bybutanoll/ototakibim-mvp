import mongoose, { Document, Schema } from 'mongoose';

export interface IARVRExperience extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  workOrderId?: mongoose.Types.ObjectId;
  experienceType: 'ar_inspection' | 'vr_service' | 'ar_guidance' | 'vr_training' | 'ar_diagnostic';
  title: string;
  description: string;
  content: {
    sceneData: {
      vehicleModel: string;
      environment: string;
      lighting: string;
      cameraPosition: {
        x: number;
        y: number;
        z: number;
      };
      focusPoints: Array<{
        id: string;
        name: string;
        position: { x: number; y: number; z: number };
        description: string;
        action: string;
      }>;
    };
    interactions: Array<{
      id: string;
      type: 'click' | 'hover' | 'drag' | 'voice' | 'gesture';
      target: string;
      action: string;
      feedback: string;
      nextStep?: string;
    }>;
    mediaAssets: Array<{
      type: 'image' | 'video' | '3d_model' | 'audio' | 'texture';
      url: string;
      filename: string;
      size: number;
      metadata: {
        width?: number;
        height?: number;
        duration?: number;
        format?: string;
      };
    }>;
    instructions: Array<{
      step: number;
      title: string;
      description: string;
      duration: number;
      required: boolean;
    }>;
  };
  settings: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // minutes
    language: string;
    accessibility: {
      subtitles: boolean;
      audioDescription: boolean;
      highContrast: boolean;
      largeText: boolean;
    };
    deviceSupport: Array<'mobile' | 'tablet' | 'desktop' | 'vr_headset' | 'ar_glasses'>;
  };
  analytics: {
    views: number;
    completions: number;
    averageDuration: number;
    userRatings: Array<{
      userId: mongoose.Types.ObjectId;
      rating: number;
      feedback: string;
      timestamp: Date;
    }>;
    interactions: Array<{
      action: string;
      timestamp: Date;
      duration: number;
      success: boolean;
    }>;
  };
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const arvrExperienceSchema = new Schema<IARVRExperience>({
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
  experienceType: {
    type: String,
    enum: ['ar_inspection', 'vr_service', 'ar_guidance', 'vr_training', 'ar_diagnostic'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  content: {
    sceneData: {
      vehicleModel: {
        type: String,
        required: true
      },
      environment: {
        type: String,
        default: 'garage'
      },
      lighting: {
        type: String,
        default: 'natural'
      },
      cameraPosition: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
      },
      focusPoints: [{
        id: String,
        name: String,
        position: {
          x: Number,
          y: Number,
          z: Number
        },
        description: String,
        action: String
      }]
    },
    interactions: [{
      id: String,
      type: {
        type: String,
        enum: ['click', 'hover', 'drag', 'voice', 'gesture']
      },
      target: String,
      action: String,
      feedback: String,
      nextStep: String
    }],
    mediaAssets: [{
      type: {
        type: String,
        enum: ['image', 'video', '3d_model', 'audio', 'texture']
      },
      url: String,
      filename: String,
      size: Number,
      metadata: {
        width: Number,
        height: Number,
        duration: Number,
        format: String
      }
    }],
    instructions: [{
      step: Number,
      title: String,
      description: String,
      duration: Number,
      required: Boolean
    }]
  },
  settings: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    duration: {
      type: Number,
      default: 10
    },
    language: {
      type: String,
      default: 'tr'
    },
    accessibility: {
      subtitles: { type: Boolean, default: true },
      audioDescription: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      largeText: { type: Boolean, default: false }
    },
    deviceSupport: [{
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'vr_headset', 'ar_glasses']
    }]
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    averageDuration: {
      type: Number,
      default: 0
    },
    userRatings: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    interactions: [{
      action: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      duration: Number,
      success: Boolean
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
arvrExperienceSchema.index({ userId: 1, vehicleId: 1, experienceType: 1 });
arvrExperienceSchema.index({ status: 1, isActive: 1 });
arvrExperienceSchema.index({ 'analytics.views': -1 });
arvrExperienceSchema.index({ createdAt: -1 });

// Virtual for average rating
arvrExperienceSchema.virtual('averageRating').get(function() {
  if (!this.analytics.userRatings || this.analytics.userRatings.length === 0) {
    return 0;
  }
  const totalRating = this.analytics.userRatings.reduce((sum, rating) => sum + rating.rating, 0);
  return totalRating / this.analytics.userRatings.length;
});

// Virtual for completion rate
arvrExperienceSchema.virtual('completionRate').get(function() {
  if (this.analytics.views === 0) return 0;
  return (this.analytics.completions / this.analytics.views) * 100;
});

// Pre-save middleware to update analytics
arvrExperienceSchema.pre('save', function(next) {
  if (this.analytics.userRatings && this.analytics.userRatings.length > 0) {
    const totalRating = this.analytics.userRatings.reduce((sum, rating) => sum + rating.rating, 0);
    this.analytics.averageDuration = totalRating / this.analytics.userRatings.length;
  }
  next();
});

export const ARVRExperience = mongoose.model<IARVRExperience>('ARVRExperience', arvrExperienceSchema);
