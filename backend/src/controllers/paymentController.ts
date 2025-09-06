import { Request, Response } from 'express';
import { catchAsync, CustomError } from '../middleware/errorHandler';

// Demo mode kontrolü
const isDemoMode = process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI;

// Get all payments with pagination and search
export const getPayments = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoPayments = [
      {
        _id: 'demo_payment_1',
        invoiceNumber: 'FAT-2024-001',
        invoiceDate: new Date('2024-01-15T10:00:00Z'),
        dueDate: new Date('2024-01-22T10:00:00Z'),
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        subtotal: 250,
        taxRate: 20,
        taxAmount: 50,
        totalAmount: 300,
        paidAmount: 300,
        remainingAmount: 0,
        customerInfo: {
          name: 'Ahmet Yılmaz',
          phone: '+90 555 111 2233',
          email: 'ahmet@demo.com'
        },
        vehicleInfo: {
          plate: '34 ABC 123',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020
        },
        isOverdue: false,
        isFullyPaid: true,
        paymentProgress: 100,
        daysOverdue: 0,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T14:30:00Z')
      },
      {
        _id: 'demo_payment_2',
        invoiceNumber: 'FAT-2024-002',
        invoiceDate: new Date('2024-01-14T09:00:00Z'),
        dueDate: new Date('2024-01-21T09:00:00Z'),
        paymentMethod: 'installment',
        paymentStatus: 'partial',
        subtotal: 260,
        taxRate: 20,
        taxAmount: 52,
        totalAmount: 312,
        paidAmount: 156,
        remainingAmount: 156,
        customerInfo: {
          name: 'Ayşe Kaya',
          phone: '+90 555 333 4455',
          email: 'ayse@demo.com'
        },
        vehicleInfo: {
          plate: '06 XYZ 789',
          brand: 'Honda',
          model: 'Civic',
          year: 2019
        },
        isOverdue: false,
        isFullyPaid: false,
        paymentProgress: 50,
        daysOverdue: 0,
        createdAt: new Date('2024-01-14T09:00:00Z'),
        updatedAt: new Date('2024-01-14T09:00:00Z')
      }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';

    let filteredPayments = demoPayments;
    
    if (search) {
      filteredPayments = filteredPayments.filter(payment =>
        payment.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        payment.customerInfo.name.toLowerCase().includes(search.toLowerCase()) ||
        payment.customerInfo.phone.toLowerCase().includes(search.toLowerCase()) ||
        payment.vehicleInfo.plate.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      filteredPayments = filteredPayments.filter(payment => payment.paymentStatus === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: paginatedPayments,
      pagination: {
        current: page,
        pages: Math.ceil(filteredPayments.length / limit),
        total: filteredPayments.length
      }
    });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  res.json({ status: 'success', data: [], message: 'Production mode - MongoDB gerekli' });
});

// Get payment statistics
export const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const stats = {
      total: 45,
      pending: 8,
      partial: 5,
      paid: 25,
      overdue: 5,
      cancelled: 2,
      totalRevenue: 125000,
      pendingAmount: 15000,
      overdueAmount: 8000,
      thisMonth: 25000,
      lastMonth: 20000,
      averagePayment: 2777.78,
      paymentMethods: {
        'cash': 15,
        'credit_card': 12,
        'bank_transfer': 10,
        'installment': 5,
        'check': 3
      }
    };

    res.json({ status: 'success', data: stats });
    return;
  }

  res.json({ status: 'success', data: {}, message: 'Production mode - MongoDB gerekli' });
});

// Create new payment
export const createPayment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const newPayment = {
      _id: 'demo_payment_new',
      invoiceNumber: req.body.invoiceNumber || 'FAT-2024-NEW',
      invoiceDate: new Date(req.body.invoiceDate || Date.now()),
      dueDate: new Date(req.body.dueDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentMethod: req.body.paymentMethod || 'cash',
      paymentStatus: 'pending',
      subtotal: req.body.subtotal || 100,
      taxRate: req.body.taxRate || 20,
      taxAmount: req.body.taxAmount || 20,
      totalAmount: req.body.totalAmount || 120,
      paidAmount: 0,
      remainingAmount: req.body.totalAmount || 120,
      customerInfo: {
        name: req.body.customerName || 'Demo Müşteri',
        phone: req.body.customerPhone || '+90 555 000 0000',
        email: req.body.customerEmail || 'demo@demo.com'
      },
      vehicleInfo: {
        plate: req.body.vehiclePlate || '34 DEMO 001',
        brand: req.body.vehicleBrand || 'Demo',
        model: req.body.vehicleModel || 'Model',
        year: req.body.vehicleYear || 2020
      },
      isOverdue: false,
      isFullyPaid: false,
      paymentProgress: 0,
      daysOverdue: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({ status: 'success', message: 'Ödeme başarıyla oluşturuldu', data: newPayment });
    return;
  }

  res.json({ status: 'success', message: 'Production mode - MongoDB gerekli' });
});

// Get single payment
export const getPayment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoPayment = {
      _id: 'demo_payment_1',
      invoiceNumber: 'FAT-2024-001',
      invoiceDate: new Date('2024-01-15T10:00:00Z'),
      dueDate: new Date('2024-01-22T10:00:00Z'),
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      subtotal: 250,
      taxRate: 20,
      taxAmount: 50,
      totalAmount: 300,
      paidAmount: 300,
      remainingAmount: 0,
      customerInfo: {
        name: 'Ahmet Yılmaz',
        phone: '+90 555 111 2233',
        email: 'ahmet@demo.com'
      },
      vehicleInfo: {
        plate: '34 ABC 123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020
      },
      isOverdue: false,
      isFullyPaid: true,
      paymentProgress: 100,
      daysOverdue: 0,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T14:30:00Z')
    };

    res.json({ status: 'success', data: demoPayment });
    return;
  }

  res.json({ status: 'success', data: {}, message: 'Production mode - MongoDB gerekli' });
});

// Add payment
export const addPayment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Ödeme başarıyla eklendi' });
    return;
  }

  res.json({ status: 'success', message: 'Production mode - MongoDB gerekli' });
});

// Delete payment
export const deletePayment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Ödeme başarıyla silindi' });
    return;
  }

  res.json({ status: 'success', message: 'Production mode - MongoDB gerekli' });
});