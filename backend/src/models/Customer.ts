import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  notes?: string;
  owner: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  fullName: string;
}

const customerSchema = new Schema<ICustomer>({
  firstName: {
    type: String,
    required: [true, 'Ad gereklidir'],
    trim: true,
    maxlength: [50, 'Ad en fazla 50 karakter olabilir']
  },
  lastName: {
    type: String,
    required: [true, 'Soyad gereklidir'],
    trim: true,
    maxlength: [50, 'Soyad en fazla 50 karakter olabilir']
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası gereklidir'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Geçerli bir telefon numarası giriniz']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [100, 'Sokak adı en fazla 100 karakter olabilir']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'Şehir adı en fazla 50 karakter olabilir']
    },
    district: {
      type: String,
      trim: true,
      maxlength: [50, 'İlçe adı en fazla 50 karakter olabilir']
    },
    postalCode: {
      type: String,
      trim: true,
      match: [/^[0-9]{5}$/, 'Geçerli bir posta kodu giriniz (5 haneli)']
    }
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value < new Date();
      },
      message: 'Doğum tarihi gelecekte olamaz'
    }
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Cinsiyet male, female veya other olmalıdır'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notlar en fazla 500 karakter olabilir']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for better performance
customerSchema.index({ owner: 1, isActive: 1 });
customerSchema.index({ phone: 1, owner: 1 });
customerSchema.index({ email: 1, owner: 1 });
customerSchema.index({ firstName: 1, lastName: 1, owner: 1 });

// Static method to find customers by owner
customerSchema.statics.findByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId, isActive: true }).sort({ createdAt: -1 });
};

// Static method to search customers
customerSchema.statics.searchByOwner = function(ownerId: string, searchTerm: string) {
  return this.find({
    owner: ownerId,
    isActive: true,
    $or: [
      { firstName: { $regex: searchTerm, $options: 'i' } },
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { phone: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 });
};

// Pre-save middleware to ensure unique phone per owner
customerSchema.pre('save', async function(next) {
  if (this.isModified('phone')) {
    const existingCustomer = await Customer.findOne({
      phone: this.phone,
      owner: this.owner,
      isActive: true,
      _id: { $ne: this._id }
    });
    
    if (existingCustomer) {
      const error = new Error('Bu telefon numarası zaten kullanılıyor');
      return next(error);
    }
  }
  next();
});

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;