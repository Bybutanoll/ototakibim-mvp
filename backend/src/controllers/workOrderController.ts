import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import WorkOrder from '../models/WorkOrder';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import { catchAsync, CustomError } from '../middleware/errorHandler';

// Demo mode kontrolü
const isDemoMode = process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI;

// Get all work orders with pagination and search
export const getWorkOrders = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoWorkOrders = [
      {
        _id: 'demo_workorder_1',
        title: 'Fren Balata Değişimi',
        description: 'Ön fren balataları aşınmış, değişim gerekli',
        status: 'in-progress',
        priority: 'high',
        type: 'repair',
        estimatedDuration: 2,
        actualDuration: null,
        estimatedCost: 450,
        actualCost: null,
        laborCost: 200,
        partsCost: 250,
        scheduledDate: new Date('2024-01-15T09:00:00Z'),
        startDate: new Date('2024-01-15T09:30:00Z'),
        completedDate: null,
        customer: {
          _id: 'demo_customer_1',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          phone: '+90 555 111 2233',
          email: 'ahmet@demo.com'
        },
        vehicle: {
          _id: 'demo_vehicle_1',
          plate: '34 ABC 123',
          brand: 'Toyota',
          vehicleModel: 'Corolla',
          year: 2020
        },
        assignedTechnician: {
          _id: 'demo_technician_1',
          firstName: 'Mehmet',
          lastName: 'Demir'
        },
        workflow: {
          currentStep: 3,
          totalSteps: 6,
          steps: [
            { stepNumber: 1, name: 'Araç Teslim Alma', status: 'completed', estimatedTime: 15, actualTime: 12 },
            { stepNumber: 2, name: 'Arıza Tespiti', status: 'completed', estimatedTime: 60, actualTime: 45 },
            { stepNumber: 3, name: 'Müşteri Onayı', status: 'in-progress', estimatedTime: 0 },
            { stepNumber: 4, name: 'Onarım İşlemleri', status: 'pending', estimatedTime: 180 },
            { stepNumber: 5, name: 'Test ve Kalite Kontrol', status: 'pending', estimatedTime: 45 },
            { stepNumber: 6, name: 'Araç Teslim Etme', status: 'pending', estimatedTime: 15 }
          ]
        },
        statusHistory: [
          {
            fromStatus: 'pending',
            toStatus: 'in-progress',
            changedAt: new Date('2024-01-15T09:30:00Z'),
            changedBy: 'demo_technician_1',
            reason: 'İş emri başlatıldı'
          }
        ],
        createdAt: new Date('2024-01-15T08:00:00Z'),
        updatedAt: new Date('2024-01-15T09:30:00Z')
      },
      {
        _id: 'demo_workorder_2',
        title: 'Periyodik Bakım',
        description: '10.000 km periyodik bakım',
        status: 'completed',
        priority: 'medium',
        type: 'maintenance',
        estimatedDuration: 1.5,
        actualDuration: 1.2,
        estimatedCost: 300,
        actualCost: 280,
        laborCost: 150,
        partsCost: 130,
        scheduledDate: new Date('2024-01-14T10:00:00Z'),
        startDate: new Date('2024-01-14T10:15:00Z'),
        completedDate: new Date('2024-01-14T11:30:00Z'),
        customer: {
          _id: 'demo_customer_2',
          firstName: 'Ayşe',
          lastName: 'Kaya',
          phone: '+90 555 222 3344',
          email: 'ayse@demo.com'
        },
        vehicle: {
          _id: 'demo_vehicle_2',
          plate: '06 XYZ 789',
          brand: 'Honda',
          vehicleModel: 'Civic',
          year: 2019
        },
        assignedTechnician: {
          _id: 'demo_technician_1',
          firstName: 'Mehmet',
          lastName: 'Demir'
        },
        workflow: {
          currentStep: 5,
          totalSteps: 5,
          steps: [
            { stepNumber: 1, name: 'Araç Teslim Alma', status: 'completed', estimatedTime: 15, actualTime: 10 },
            { stepNumber: 2, name: 'Ön Muayene', status: 'completed', estimatedTime: 30, actualTime: 25 },
            { stepNumber: 3, name: 'Bakım İşlemleri', status: 'completed', estimatedTime: 120, actualTime: 100 },
            { stepNumber: 4, name: 'Test ve Kalite Kontrol', status: 'completed', estimatedTime: 30, actualTime: 20 },
            { stepNumber: 5, name: 'Araç Teslim Etme', status: 'completed', estimatedTime: 15, actualTime: 12 }
          ]
        },
        statusHistory: [
          {
            fromStatus: 'pending',
            toStatus: 'in-progress',
            changedAt: new Date('2024-01-14T10:15:00Z'),
            changedBy: 'demo_technician_1',
            reason: 'Bakım başlatıldı'
          },
          {
            fromStatus: 'in-progress',
            toStatus: 'completed',
            changedAt: new Date('2024-01-14T11:30:00Z'),
            changedBy: 'demo_technician_1',
            reason: 'Bakım tamamlandı'
          }
        ],
        createdAt: new Date('2024-01-14T09:00:00Z'),
        updatedAt: new Date('2024-01-14T11:30:00Z')
      }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    let filteredWorkOrders = demoWorkOrders;
    if (search) {
      filteredWorkOrders = demoWorkOrders.filter(wo =>
        wo.title.toLowerCase().includes(search.toLowerCase()) ||
        wo.description.toLowerCase().includes(search.toLowerCase()) ||
        wo.status.toLowerCase().includes(search.toLowerCase()) ||
        wo.priority.toLowerCase().includes(search.toLowerCase()) ||
        `${wo.customer.firstName} ${wo.customer.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        wo.vehicle.plate.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedWorkOrders = filteredWorkOrders.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: paginatedWorkOrders,
      pagination: {
        current: page,
        pages: Math.ceil(filteredWorkOrders.length / limit),
        total: filteredWorkOrders.length
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

  let query: any = { owner: userId, isActive: true };

  if (search) {
    query = {
      ...query,
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { priority: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const workOrders = await WorkOrder.find(query)
    .populate('customer', 'firstName lastName phone email')
    .populate('vehicle', 'plate brand vehicleModel year')
    .populate('assignedTechnician', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await WorkOrder.countDocuments(query);

  res.json({
    status: 'success',
    data: workOrders,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// Get single work order
export const getWorkOrder = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoWorkOrder = {
      _id: 'demo_workorder_1',
      title: 'Fren Balata Değişimi',
      description: 'Ön fren balataları aşınmış, değişim gerekli. Müşteri fren sesi şikayeti ile geldi.',
      status: 'in-progress',
      priority: 'high',
      type: 'repair',
      estimatedDuration: 2,
      actualDuration: null,
      estimatedCost: 450,
      actualCost: null,
      laborCost: 200,
      partsCost: 250,
      taxRate: 18,
      scheduledDate: new Date('2024-01-15T09:00:00Z'),
      startDate: new Date('2024-01-15T09:30:00Z'),
      completedDate: null,
      customer: {
        _id: 'demo_customer_1',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '+90 555 111 2233',
        email: 'ahmet@demo.com',
        address: {
          street: 'Atatürk Caddesi No:123',
          district: 'Kadıköy',
          city: 'İstanbul',
          postalCode: '34710'
        }
      },
      vehicle: {
        _id: 'demo_vehicle_1',
        plate: '34 ABC 123',
        brand: 'Toyota',
        vehicleModel: 'Corolla',
        year: 2020,
        vin: '1HGBH41JXMN109186',
        engineSize: '1.6L',
        fuelType: 'gasoline',
        transmission: 'automatic',
        mileage: 45000,
        color: 'Beyaz'
      },
      assignedTechnician: {
        _id: 'demo_technician_1',
        firstName: 'Mehmet',
        lastName: 'Demir'
      },
      parts: [
        {
          name: 'Fren Balata Seti (Ön)',
          partNumber: 'FB-001',
          quantity: 1,
          unitPrice: 180,
          supplier: 'Toyota Orijinal',
          warranty: '2 yıl'
        },
        {
          name: 'Fren Diski (Ön)',
          partNumber: 'FD-001',
          quantity: 2,
          unitPrice: 35,
          supplier: 'Toyota Orijinal',
          warranty: '2 yıl'
        }
      ],
      workSteps: [
        {
          stepNumber: 1,
          description: 'Araç kaldırma ve tekerlek sökme',
          estimatedTime: 15,
          actualTime: 12,
          status: 'completed',
          notes: 'Araç güvenli şekilde kaldırıldı',
          completedBy: 'demo_technician_1',
          completedAt: new Date('2024-01-15T09:45:00Z')
        },
        {
          stepNumber: 2,
          description: 'Eski fren balatalarını çıkarma',
          estimatedTime: 20,
          actualTime: 18,
          status: 'completed',
          notes: 'Balatalar aşınmış durumda',
          completedBy: 'demo_technician_1',
          completedAt: new Date('2024-01-15T10:05:00Z')
        },
        {
          stepNumber: 3,
          description: 'Yeni fren balatalarını takma',
          estimatedTime: 30,
          actualTime: null,
          status: 'in-progress',
          notes: null,
          completedBy: null,
          completedAt: null
        }
      ],
      workflow: {
        currentStep: 3,
        totalSteps: 6,
        steps: [
          { stepNumber: 1, name: 'Araç Teslim Alma', status: 'completed', estimatedTime: 15, actualTime: 12 },
          { stepNumber: 2, name: 'Arıza Tespiti', status: 'completed', estimatedTime: 60, actualTime: 45 },
          { stepNumber: 3, name: 'Müşteri Onayı', status: 'in-progress', estimatedTime: 0 },
          { stepNumber: 4, name: 'Onarım İşlemleri', status: 'pending', estimatedTime: 180 },
          { stepNumber: 5, name: 'Test ve Kalite Kontrol', status: 'pending', estimatedTime: 45 },
          { stepNumber: 6, name: 'Araç Teslim Etme', status: 'pending', estimatedTime: 15 }
        ]
      },
      statusHistory: [
        {
          fromStatus: 'pending',
          toStatus: 'in-progress',
          changedAt: new Date('2024-01-15T09:30:00Z'),
          changedBy: 'demo_technician_1',
          reason: 'İş emri başlatıldı'
        }
      ],
      customerApproval: {
        required: true,
        requestedAt: new Date('2024-01-15T10:00:00Z'),
        approvedAt: null,
        approvedBy: null,
        notes: 'Fren balata değişimi için müşteri onayı bekleniyor'
      },
      photos: [
        'uploads/workorders/demo_workorder_1/photo1.jpg',
        'uploads/workorders/demo_workorder_1/photo2.jpg'
      ],
      documents: [
        {
          name: 'Fren Balata Faturası',
          type: 'invoice',
          url: 'uploads/workorders/demo_workorder_1/invoice.pdf',
          uploadedAt: new Date('2024-01-15T09:00:00Z')
        }
      ],
      notes: [
        {
          author: 'demo_technician_1',
          content: 'Fren balataları ciddi şekilde aşınmış, acil değişim gerekli',
          createdAt: new Date('2024-01-15T09:45:00Z'),
          isInternal: true
        },
        {
          author: 'demo_technician_1',
          content: 'Müşteriye durum açıklandı, onay bekleniyor',
          createdAt: new Date('2024-01-15T10:00:00Z'),
          isInternal: false
        }
      ],
      qualityCheck: {
        performedBy: null,
        performedAt: null,
        passed: false,
        notes: null,
        checklist: [
          { item: 'Fren balata kalınlığı kontrolü', checked: false },
          { item: 'Fren diski düzgünlük kontrolü', checked: false },
          { item: 'Fren hidrolik sistemi kontrolü', checked: false },
          { item: 'Test sürüşü', checked: false }
        ]
      },
      warranty: {
        type: 'parts',
        duration: 730, // 2 yıl
        startDate: null,
        terms: 'Sadece parça garantisi, işçilik garantisi yok'
      },
      createdAt: new Date('2024-01-15T08:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z')
    };

    res.json({ status: 'success', data: demoWorkOrder });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const workOrder = await WorkOrder.findOne({ _id: id, owner: userId, isActive: true })
    .populate('customer', 'firstName lastName phone email address')
    .populate('vehicle', 'plate brand vehicleModel year vin engineSize fuelType transmission mileage color')
    .populate('assignedTechnician', 'firstName lastName')
    .populate('statusHistory.changedBy', 'firstName lastName')
    .populate('notes.author', 'firstName lastName')
    .populate('workflow.steps.completedBy', 'firstName lastName');

  if (!workOrder) {
    throw new CustomError('İş emri bulunamadı', 404);
  }

  res.json({ status: 'success', data: workOrder });
});

// Create new work order
export const createWorkOrder = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const newWorkOrder = {
      _id: 'demo_workorder_new',
      title: req.body.title || 'Yeni İş Emri',
      description: req.body.description || 'Demo iş emri açıklaması',
      status: 'pending',
      priority: req.body.priority || 'medium',
      type: req.body.type || 'repair',
      estimatedDuration: req.body.estimatedDuration || 2,
      estimatedCost: req.body.estimatedCost || 300,
      laborCost: req.body.laborCost || 150,
      partsCost: req.body.partsCost || 150,
      taxRate: 18,
      scheduledDate: new Date(req.body.scheduledDate || Date.now()),
      customer: {
        _id: req.body.customer || 'demo_customer_1',
        firstName: 'Demo',
        lastName: 'Müşteri'
      },
      vehicle: {
        _id: req.body.vehicle || 'demo_vehicle_1',
        plate: '34 DEMO 001'
      },
      assignedTechnician: req.body.assignedTechnician ? {
        _id: req.body.assignedTechnician,
        firstName: 'Demo',
        lastName: 'Teknisyen'
      } : null,
      workflow: {
        currentStep: 1,
        totalSteps: 5,
        steps: [
          { stepNumber: 1, name: 'Araç Teslim Alma', status: 'pending', estimatedTime: 15 },
          { stepNumber: 2, name: 'Ön Muayene', status: 'pending', estimatedTime: 30 },
          { stepNumber: 3, name: 'İşlemler', status: 'pending', estimatedTime: 120 },
          { stepNumber: 4, name: 'Test ve Kalite Kontrol', status: 'pending', estimatedTime: 30 },
          { stepNumber: 5, name: 'Araç Teslim Etme', status: 'pending', estimatedTime: 15 }
        ]
      },
      statusHistory: [],
      parts: [],
      workSteps: [],
      customerApproval: { required: false },
      photos: [],
      documents: [],
      notes: [],
      qualityCheck: { passed: false, checklist: [] },
      warranty: { type: 'none', duration: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({ status: 'success', message: 'İş emri başarıyla oluşturuldu', data: newWorkOrder });
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
    estimatedDuration,
      estimatedCost,
    laborCost,
    partsCost,
    scheduledDate,
      assignedTechnician,
    parts,
    workSteps
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

    // Create work order
    const workOrder = new WorkOrder({
    owner: userId,
    customer,
    vehicle,
    title,
    description,
    type,
    priority,
    estimatedDuration,
    estimatedCost,
    laborCost,
    partsCost,
    taxRate: 18,
    scheduledDate: new Date(scheduledDate),
    assignedTechnician,
    parts: parts || [],
    workSteps: workSteps || [],
    customerApproval: { required: false },
    photos: [],
    documents: [],
    notes: [],
    qualityCheck: { passed: false, checklist: [] },
    warranty: { type: 'none', duration: 0 },
    statusHistory: []
  });

  // Initialize workflow based on type
  workOrder.initializeWorkflow(type);

    await workOrder.save();

  // Populate and return
            await workOrder.populate([
    { path: 'customer', select: 'firstName lastName phone email' },
    { path: 'vehicle', select: 'plate brand vehicleModel year' },
    { path: 'assignedTechnician', select: 'firstName lastName' }
  ]);

  res.status(201).json({ status: 'success', message: 'İş emri başarıyla oluşturuldu', data: workOrder });
});

// Update work order
export const updateWorkOrder = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'İş emri başarıyla güncellendi' });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const workOrder = await WorkOrder.findOne({ _id: id, owner: userId, isActive: true });
  if (!workOrder) {
    throw new CustomError('İş emri bulunamadı', 404);
  }

  // Update fields
  const allowedUpdates = [
    'title', 'description', 'priority', 'estimatedDuration', 'estimatedCost',
    'laborCost', 'partsCost', 'scheduledDate', 'assignedTechnician', 'parts', 'workSteps'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      (workOrder as any)[field] = req.body[field];
    }
  });

  await workOrder.save();

  // Populate and return
  await workOrder.populate([
    { path: 'customer', select: 'firstName lastName phone email' },
    { path: 'vehicle', select: 'plate brand vehicleModel year' },
    { path: 'assignedTechnician', select: 'firstName lastName' }
  ]);

  res.json({ status: 'success', message: 'İş emri başarıyla güncellendi', data: workOrder });
});

// Change work order status
export const changeWorkOrderStatus = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'İş emri durumu başarıyla değiştirildi' });
    return;
  }

    const { id } = req.params;
  const { status, reason, notes } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const workOrder = await WorkOrder.findOne({ _id: id, owner: userId, isActive: true });
    if (!workOrder) {
    throw new CustomError('İş emri bulunamadı', 404);
  }

  // Change status using the model method
  workOrder.changeStatus(status, userId, reason, notes);
  await workOrder.save();

  res.json({ status: 'success', message: 'İş emri durumu başarıyla değiştirildi', data: workOrder });
});

// Complete workflow step
export const completeWorkflowStep = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Workflow adımı başarıyla tamamlandı' });
    return;
    }

    const { id } = req.params;
  const { stepNumber, actualTime, notes } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const workOrder = await WorkOrder.findOne({ _id: id, owner: userId, isActive: true });
    if (!workOrder) {
    throw new CustomError('İş emri bulunamadı', 404);
  }

  // Complete step using the model method
  workOrder.completeStep(stepNumber, userId, actualTime, notes);
  await workOrder.save();

  res.json({ status: 'success', message: 'Workflow adımı başarıyla tamamlandı', data: workOrder });
});

// Delete work order
export const deleteWorkOrder = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'İş emri başarıyla silindi' });
    return;
  }

    const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const workOrder = await WorkOrder.findOne({ _id: id, owner: userId, isActive: true });
    if (!workOrder) {
    throw new CustomError('İş emri bulunamadı', 404);
  }

  workOrder.isActive = false;
  await workOrder.save();

  res.json({ status: 'success', message: 'İş emri başarıyla silindi' });
});

// Get work order statistics
export const getWorkOrderStats = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const stats = {
      total: 15,
      pending: 3,
      inProgress: 5,
      completed: 6,
      cancelled: 1,
      onHold: 0,
      waitingParts: 2,
      waitingApproval: 1,
      qualityCheck: 1,
      totalRevenue: 12500,
      averageCompletionTime: 2.5,
      topTechnicians: [
        { name: 'Mehmet Demir', completed: 8, rating: 4.8 },
        { name: 'Ali Veli', completed: 6, rating: 4.6 },
        { name: 'Ayşe Kaya', completed: 4, rating: 4.9 }
      ],
      workOrderTypes: {
        maintenance: 8,
        repair: 5,
        inspection: 2,
        diagnostic: 1,
        emergency: 0
      }
    };

    res.json({ status: 'success', data: stats });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const stats = await WorkOrder.aggregate([
    { $match: { owner: userId, isActive: true } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalRevenue: { $sum: '$actualCost' },
        averageCompletionTime: { $avg: '$actualDuration' },
        statusCounts: {
          $push: '$status'
        }
      }
    }
  ]);

  res.json({ status: 'success', data: stats[0] || {} });
});