import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Appointment from '../models/Appointment';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import { catchAsync, CustomError } from '../middleware/errorHandler';

// Demo mode kontrolü
const isDemoMode = process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI;

// Get all appointments with pagination and search
export const getAppointments = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoAppointments = [
      {
        _id: 'demo_appointment_1',
        title: 'Fren Balata Değişimi',
        description: 'Toyota Corolla için fren balata değişimi',
        type: 'repair',
        priority: 'high',
        scheduledDate: new Date('2024-01-16T09:00:00Z'),
        startTime: new Date('2024-01-16T09:00:00Z'),
        endTime: new Date('2024-01-16T11:00:00Z'),
        estimatedDuration: 120,
        status: 'confirmed',
        customerInfo: {
          name: 'Ahmet Yılmaz',
          phone: '+90 555 111 2233',
          email: 'ahmet@demo.com'
        },
        vehicleInfo: {
          plate: '34 ABC 123',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          mileage: 45000
        },
        technicianInfo: {
          name: 'Mehmet Demir',
          phone: '+90 555 222 3344',
          specialization: ['Fren Sistemi', 'Motor']
        },
        services: [
          {
            name: 'Fren Balata Değişimi',
            description: 'Ön fren balata seti değişimi',
            estimatedDuration: 90,
            estimatedCost: 250,
            status: 'pending'
          },
          {
            name: 'Fren Diski Kontrolü',
            description: 'Fren diski kalınlık kontrolü',
            estimatedDuration: 30,
            estimatedCost: 50,
            status: 'pending'
          }
        ],
        customerConfirmation: {
          confirmed: true,
          confirmedAt: new Date('2024-01-15T14:30:00Z'),
          confirmationMethod: 'phone'
        },
        totalEstimatedCost: 300,
        isToday: false,
        isUpcoming: true,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T14:30:00Z')
      },
      {
        _id: 'demo_appointment_2',
        title: 'Periyodik Bakım',
        description: '10.000 km periyodik bakım',
        type: 'maintenance',
        priority: 'medium',
        scheduledDate: new Date('2024-01-15T14:00:00Z'),
        startTime: new Date('2024-01-15T14:00:00Z'),
        endTime: new Date('2024-01-15T16:00:00Z'),
        estimatedDuration: 120,
        status: 'completed',
        customerInfo: {
          name: 'Ayşe Kaya',
          phone: '+90 555 333 4455',
          email: 'ayse@demo.com'
        },
        vehicleInfo: {
          plate: '06 XYZ 789',
          brand: 'Honda',
          model: 'Civic',
          year: 2019,
          mileage: 35000
        },
        technicianInfo: {
          name: 'Ali Veli',
          phone: '+90 555 444 5566',
          specialization: ['Motor', 'Yağ Değişimi']
        },
        services: [
          {
            name: 'Motor Yağı Değişimi',
            description: '5W-30 sentetik motor yağı değişimi',
            estimatedDuration: 60,
            estimatedCost: 180,
            actualCost: 180,
            status: 'completed'
          },
          {
            name: 'Filtre Değişimi',
            description: 'Hava ve yakıt filtresi değişimi',
            estimatedDuration: 30,
            estimatedCost: 80,
            actualCost: 80,
            status: 'completed'
          },
          {
            name: 'Genel Kontrol',
            description: 'Araç genel kontrolü',
            estimatedDuration: 30,
            estimatedCost: 50,
            actualCost: 50,
            status: 'completed'
          }
        ],
        customerConfirmation: {
          confirmed: true,
          confirmedAt: new Date('2024-01-14T16:00:00Z'),
          confirmationMethod: 'sms'
        },
        totalEstimatedCost: 310,
        totalActualCost: 310,
        isToday: true,
        isUpcoming: false,
        createdAt: new Date('2024-01-14T09:00:00Z'),
        updatedAt: new Date('2024-01-15T16:00:00Z')
      },
      {
        _id: 'demo_appointment_3',
        title: 'Araç Teslim',
        description: 'Tamamlanan iş emri için araç teslimi',
        type: 'delivery',
        priority: 'medium',
        scheduledDate: new Date('2024-01-15T17:00:00Z'),
        startTime: new Date('2024-01-15T17:00:00Z'),
        endTime: new Date('2024-01-15T17:30:00Z'),
        estimatedDuration: 30,
        status: 'scheduled',
        customerInfo: {
          name: 'Fatma Özkan',
          phone: '+90 555 555 6677',
          email: 'fatma@demo.com'
        },
        vehicleInfo: {
          plate: '35 DEF 456',
          brand: 'Ford',
          model: 'Focus',
          year: 2021,
          mileage: 25000
        },
        technicianInfo: {
          name: 'Mehmet Demir',
          phone: '+90 555 222 3344',
          specialization: ['Genel']
        },
        services: [
          {
            name: 'Araç Teslimi',
            description: 'Tamamlanan iş emri için araç teslimi',
            estimatedDuration: 30,
            estimatedCost: 0,
            status: 'pending'
          }
        ],
        customerConfirmation: {
          confirmed: false
        },
        totalEstimatedCost: 0,
        isToday: true,
        isUpcoming: true,
        createdAt: new Date('2024-01-15T12:00:00Z'),
        updatedAt: new Date('2024-01-15T12:00:00Z')
      }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const date = req.query.date as string || '';

    let filteredAppointments = demoAppointments;
    
    if (search) {
      filteredAppointments = filteredAppointments.filter(apt =>
        apt.title.toLowerCase().includes(search.toLowerCase()) ||
        apt.description.toLowerCase().includes(search.toLowerCase()) ||
        apt.customerInfo.name.toLowerCase().includes(search.toLowerCase()) ||
        apt.vehicleInfo.plate.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }
    
    if (date) {
      const filterDate = new Date(date);
      filteredAppointments = filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.scheduledDate);
        return aptDate.toDateString() === filterDate.toDateString();
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: paginatedAppointments,
      pagination: {
        current: page,
        pages: Math.ceil(filteredAppointments.length / limit),
        total: filteredAppointments.length
      }
    });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string || '';
  const status = req.query.status as string || '';
  const date = req.query.date as string || '';

  let query: any = { owner: userId, isActive: true };

  if (search) {
    query = {
      ...query,
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } },
        { 'vehicleInfo.plate': { $regex: search, $options: 'i' } }
      ]
    };
  }

  if (status) {
    query.status = status;
  }

  if (date) {
    const filterDate = new Date(date);
    const startOfDay = new Date(filterDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(filterDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    query.scheduledDate = {
      $gte: startOfDay,
      $lte: endOfDay
    };
  }

  const appointments = await Appointment.find(query)
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .populate('assignedTechnician', 'firstName lastName')
    .populate('statusHistory.changedBy', 'firstName lastName')
    .populate('notes.author', 'firstName lastName')
    .sort({ startTime: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Appointment.countDocuments(query);

  res.json({
    status: 'success',
    data: appointments,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// Get single appointment
export const getAppointment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoAppointment = {
      _id: 'demo_appointment_1',
      title: 'Fren Balata Değişimi',
      description: 'Toyota Corolla için fren balata değişimi. Müşteri fren sesi şikayeti ile geldi.',
      type: 'repair',
      priority: 'high',
      scheduledDate: new Date('2024-01-16T09:00:00Z'),
      startTime: new Date('2024-01-16T09:00:00Z'),
      endTime: new Date('2024-01-16T11:00:00Z'),
      estimatedDuration: 120,
      status: 'confirmed',
      customerInfo: {
        name: 'Ahmet Yılmaz',
        phone: '+90 555 111 2233',
        email: 'ahmet@demo.com',
        notes: 'Sabah erken saatleri tercih ediyor'
      },
      vehicleInfo: {
        plate: '34 ABC 123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        mileage: 45000,
        vin: '1HGBH41JXMN109186'
      },
      technicianInfo: {
        name: 'Mehmet Demir',
        phone: '+90 555 222 3344',
        email: 'mehmet@demo.com',
        specialization: ['Fren Sistemi', 'Motor', 'Elektrik']
      },
      services: [
        {
          name: 'Fren Balata Değişimi',
          description: 'Ön fren balata seti değişimi',
          estimatedDuration: 90,
          estimatedCost: 250,
          status: 'pending'
        },
        {
          name: 'Fren Diski Kontrolü',
          description: 'Fren diski kalınlık kontrolü ve gerekirse değişimi',
          estimatedDuration: 30,
          estimatedCost: 50,
          status: 'pending'
        }
      ],
      specialRequirements: [
        {
          type: 'equipment',
          description: 'Fren balata presi',
          isRequired: true,
          provided: true
        },
        {
          type: 'space',
          description: 'Fren işlemi için özel alan',
          isRequired: true,
          provided: true
        }
      ],
      reminders: [
        {
          type: 'sms',
          scheduledAt: new Date('2024-01-15T18:00:00Z'),
          sentAt: new Date('2024-01-15T18:00:00Z'),
          status: 'sent',
          message: 'Yarın saat 09:00\'da randevunuz var. Lütfen zamanında geliniz.'
        }
      ],
      notes: [
        {
          author: 'demo_user_1',
          content: 'Müşteri fren sesi şikayeti ile geldi, balata aşınması muhtemel',
          createdAt: new Date('2024-01-15T10:00:00Z'),
          isInternal: true
        }
      ],
      statusHistory: [
        {
          fromStatus: 'scheduled',
          toStatus: 'confirmed',
          changedAt: new Date('2024-01-15T14:30:00Z'),
          changedBy: 'demo_user_1',
          reason: 'Müşteri onayı'
        }
      ],
      customerConfirmation: {
        confirmed: true,
        confirmedAt: new Date('2024-01-15T14:30:00Z'),
        confirmedBy: 'demo_user_1',
        confirmationMethod: 'phone',
        notes: 'Müşteri telefon ile onayladı'
      },
      tracking: {
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T14:30:00Z'),
        lastReminderSent: new Date('2024-01-15T18:00:00Z'),
        reminderCount: 1,
        noShowCount: 0
      },
      totalEstimatedCost: 300,
      isToday: false,
      isUpcoming: true,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T14:30:00Z')
    };

    res.json({ status: 'success', data: demoAppointment });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const appointment = await Appointment.findOne({ _id: id, owner: userId, isActive: true })
    .populate('customer', 'firstName lastName phone email address')
    .populate('vehicle', 'plate brand vehicleModel year vin mileage')
    .populate('assignedTechnician', 'firstName lastName phone email')
    .populate('statusHistory.changedBy', 'firstName lastName')
    .populate('notes.author', 'firstName lastName');

  if (!appointment) {
    throw new CustomError('Randevu bulunamadı', 404);
  }

  res.json({ status: 'success', data: appointment });
});

// Create new appointment
export const createAppointment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const newAppointment = {
      _id: 'demo_appointment_new',
      title: req.body.title || 'Yeni Randevu',
      description: req.body.description || 'Demo randevu açıklaması',
      type: req.body.type || 'maintenance',
      priority: req.body.priority || 'medium',
      scheduledDate: new Date(req.body.scheduledDate || Date.now()),
      startTime: new Date(req.body.startTime || Date.now()),
      endTime: new Date(req.body.endTime || Date.now() + 2 * 60 * 60 * 1000),
      estimatedDuration: req.body.estimatedDuration || 120,
      status: 'scheduled',
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
      services: req.body.services || [],
      customerConfirmation: {
        confirmed: false
      },
      tracking: {
        createdAt: new Date(),
        updatedAt: new Date(),
        reminderCount: 0,
        noShowCount: 0
      },
      totalEstimatedCost: 0,
      isToday: false,
      isUpcoming: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({ status: 'success', message: 'Randevu başarıyla oluşturuldu', data: newAppointment });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const {
    customer,
    vehicle,
    title,
    description,
    type,
    priority,
    scheduledDate,
    startTime,
    endTime,
    estimatedDuration,
    assignedTechnician,
    services,
    specialRequirements
  } = req.body;

  // Validate customer and vehicle
  const customerExists = await Customer.findOne({ _id: customer, owner: userId, isActive: true });
  if (!customerExists) {
    throw new CustomError('Geçersiz müşteri', 400);
  }

  const vehicleExists = await Vehicle.findOne({ _id: vehicle, owner: userId });
  if (!vehicleExists) {
    throw new CustomError('Geçersiz araç', 400);
  }

  // Check for time conflicts
  const conflictingAppointment = await Appointment.findOne({
    owner: userId,
    isActive: true,
    assignedTechnician: assignedTechnician,
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] },
    $or: [
      {
        startTime: { $lt: new Date(endTime) },
        endTime: { $gt: new Date(startTime) }
      }
    ]
  });

  if (conflictingAppointment) {
    throw new CustomError('Bu saatte başka bir randevu mevcut', 400);
  }

  // Create appointment
  const appointment = new Appointment({
    owner: userId,
    customer,
    vehicle,
    title,
    description,
    type,
    priority,
    scheduledDate: new Date(scheduledDate),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    estimatedDuration,
    assignedTechnician,
    services: services || [],
    specialRequirements: specialRequirements || [],
    customerConfirmation: {
      confirmed: false
    },
    tracking: {
      createdAt: new Date(),
      updatedAt: new Date(),
      reminderCount: 0,
      noShowCount: 0
    },
    status: 'scheduled'
  });

  await appointment.save();

  // Populate and return
  await appointment.populate([
    { path: 'customer', select: 'firstName lastName phone email' },
    { path: 'vehicle', select: 'plate brand vehicleModel year' },
    { path: 'assignedTechnician', select: 'firstName lastName' }
  ]);

  res.status(201).json({ status: 'success', message: 'Randevu başarıyla oluşturuldu', data: appointment });
});

// Update appointment
export const updateAppointment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Randevu başarıyla güncellendi' });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const appointment = await Appointment.findOne({ _id: id, owner: userId, isActive: true });
  if (!appointment) {
    throw new CustomError('Randevu bulunamadı', 404);
  }

  // Update fields
  const allowedUpdates = [
    'title', 'description', 'type', 'priority', 'scheduledDate',
    'startTime', 'endTime', 'estimatedDuration', 'assignedTechnician',
    'services', 'specialRequirements'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      (appointment as any)[field] = req.body[field];
    }
  });

  await appointment.save();

  // Populate and return
  await appointment.populate([
    { path: 'customer', select: 'firstName lastName phone email' },
    { path: 'vehicle', select: 'plate brand vehicleModel year' },
    { path: 'assignedTechnician', select: 'firstName lastName' }
  ]);

  res.json({ status: 'success', message: 'Randevu başarıyla güncellendi', data: appointment });
});

// Confirm appointment
export const confirmAppointment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Randevu başarıyla onaylandı' });
    return;
  }

  const { id } = req.params;
  const { method, notes } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const appointment = await Appointment.findOne({ _id: id, owner: userId, isActive: true });
  if (!appointment) {
    throw new CustomError('Randevu bulunamadı', 404);
  }

  // Confirm appointment using the model method
  appointment.confirm(userId, method, notes);
  await appointment.save();

  res.json({ status: 'success', message: 'Randevu başarıyla onaylandı', data: appointment });
});

// Cancel appointment
export const cancelAppointment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Randevu başarıyla iptal edildi' });
    return;
  }

  const { id } = req.params;
  const { reason, refundAmount } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const appointment = await Appointment.findOne({ _id: id, owner: userId, isActive: true });
  if (!appointment) {
    throw new CustomError('Randevu bulunamadı', 404);
  }

  // Cancel appointment using the model method
  appointment.cancel(userId, reason, refundAmount);
  await appointment.save();

  res.json({ status: 'success', message: 'Randevu başarıyla iptal edildi', data: appointment });
});

// Delete appointment
export const deleteAppointment = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Randevu başarıyla silindi' });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const appointment = await Appointment.findOne({ _id: id, owner: userId, isActive: true });
  if (!appointment) {
    throw new CustomError('Randevu bulunamadı', 404);
  }

  appointment.isActive = false;
  await appointment.save();

  res.json({ status: 'success', message: 'Randevu başarıyla silindi' });
});

// Get appointment statistics
export const getAppointmentStats = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const stats = {
      total: 45,
      scheduled: 8,
      confirmed: 12,
      completed: 20,
      cancelled: 3,
      noShow: 2,
      today: 3,
      thisWeek: 15,
      thisMonth: 45,
      upcoming: 20,
      overdue: 1,
      averageDuration: 95,
      completionRate: 88.9,
      noShowRate: 4.4,
      topServices: [
        { name: 'Periyodik Bakım', count: 15, revenue: 4500 },
        { name: 'Fren Sistemi', count: 8, revenue: 2000 },
        { name: 'Motor Onarımı', count: 6, revenue: 3000 },
        { name: 'Elektrik', count: 4, revenue: 800 },
        { name: 'Diğer', count: 12, revenue: 1200 }
      ]
    };

    res.json({ status: 'success', data: stats });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const stats = await Appointment.aggregate([
    { $match: { owner: userId, isActive: true } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        noShow: {
          $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] }
        },
        averageDuration: { $avg: '$estimatedDuration' }
      }
    }
  ]);

  res.json({ status: 'success', data: stats[0] || {} });
});