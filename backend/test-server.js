const express = require('express');
const app = express();
const PORT = 5001;

// CORS ayarları
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Demo login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'mehmet@demo.com' && password === 'demo123456') {
    res.json({
      status: 'success',
      message: 'Giriş başarılı (Demo Mod)',
      user: {
        _id: 'demo_user_1',
        firstName: 'Mehmet',
        lastName: 'Usta',
        email: 'mehmet@demo.com',
        phone: '+90 555 123 4567',
        role: 'technician',
        isActive: true,
        onboardingCompleted: true,
        businessName: 'Mehmet Usta Oto Servis',
        businessType: 'Oto Tamir',
        address: 'İstanbul, Türkiye',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'demo_access_token_123',
      refreshToken: 'demo_refresh_token_123',
      expiresIn: 604800
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Geçersiz email veya şifre'
    });
  }
});

// Demo vehicles endpoint
app.get('/api/vehicles', (req, res) => {
  const demoVehicles = [
    {
      _id: 'demo_vehicle_1',
      plate: '34 ABC 123',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      vin: '1HGBH41JXMN109186',
      engineSize: '1.6L',
      fuelType: 'gasoline',
      transmission: 'automatic',
      mileage: 45000,
      color: 'Beyaz',
      customer: {
        _id: 'demo_customer_1',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '+90 555 111 2233',
        email: 'ahmet@demo.com'
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'demo_vehicle_2',
      plate: '06 XYZ 789',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2019,
      vin: '1HGBH41JXMN109187',
      engineSize: '1.4L',
      fuelType: 'gasoline',
      transmission: 'manual',
      mileage: 62000,
      color: 'Siyah',
      customer: {
        _id: 'demo_customer_1',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '+90 555 111 2233',
        email: 'ahmet@demo.com'
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  res.json({
    status: 'success',
    data: demoVehicles,
    count: demoVehicles.length,
    message: 'Demo veriler (Demo Mod)'
  });
});

// Demo customers endpoint
app.get('/api/customers', (req, res) => {
  const demoCustomers = [
    {
      _id: 'demo_customer_1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      phone: '+90 555 111 2233',
      email: 'ahmet@demo.com',
      address: 'İstanbul, Türkiye',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'demo_customer_2',
      firstName: 'Fatma',
      lastName: 'Kaya',
      phone: '+90 555 444 5566',
      email: 'fatma@demo.com',
      address: 'Ankara, Türkiye',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  res.json({
    status: 'success',
    data: demoCustomers,
    count: demoCustomers.length,
    message: 'Demo müşteriler (Demo Mod)'
  });
});

// Demo work orders endpoint
app.get('/api/work-orders', (req, res) => {
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

  res.json({
    status: 'success',
    data: demoWorkOrders,
    pagination: {
      current: 1,
      pages: 1,
      total: demoWorkOrders.length
    },
    message: 'Demo iş emirleri (Demo Mod)'
  });
});

// Demo work order stats endpoint
app.get('/api/work-orders/stats', (req, res) => {
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

  res.json({
    status: 'success',
    data: stats,
    message: 'Demo iş emri istatistikleri (Demo Mod)'
  });
});

// Demo inventory endpoint
app.get('/api/inventory', (req, res) => {
  const demoInventory = [
    {
      _id: 'demo_inventory_1',
      partNumber: 'FB-001',
      name: 'Fren Balata Seti (Ön)',
      description: 'Toyota Corolla için ön fren balata seti',
      category: 'Fren Sistemi',
      brand: 'Toyota Orijinal',
      currentStock: 5,
      minimumStock: 3,
      maximumStock: 20,
      reorderPoint: 5,
      reorderQuantity: 10,
      costPrice: 180,
      sellingPrice: 250,
      margin: 38.9,
      location: {
        warehouse: 'Ana Depo',
        shelf: 'A-15',
        bin: 'B-03',
        zone: 'Fren Bölgesi'
      },
      unit: 'adet',
      stockStatus: 'normal',
      needsReorder: false,
      stockValue: 900,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-15T14:30:00Z')
    },
    {
      _id: 'demo_inventory_2',
      partNumber: 'FD-001',
      name: 'Fren Diski (Ön)',
      description: 'Toyota Corolla için ön fren diski',
      category: 'Fren Sistemi',
      brand: 'Toyota Orijinal',
      currentStock: 2,
      minimumStock: 4,
      maximumStock: 15,
      reorderPoint: 6,
      reorderQuantity: 8,
      costPrice: 35,
      sellingPrice: 50,
      margin: 42.9,
      location: {
        warehouse: 'Ana Depo',
        shelf: 'A-15',
        bin: 'B-04',
        zone: 'Fren Bölgesi'
      },
      unit: 'adet',
      stockStatus: 'low-stock',
      needsReorder: true,
      stockValue: 70,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-15T14:30:00Z')
    },
    {
      _id: 'demo_inventory_3',
      partNumber: 'OF-001',
      name: 'Motor Yağı 5W-30',
      description: 'Sentetik motor yağı 5W-30, 4 litre',
      category: 'Yağ ve Sıvılar',
      brand: 'Castrol',
      currentStock: 0,
      minimumStock: 5,
      maximumStock: 25,
      reorderPoint: 8,
      reorderQuantity: 15,
      costPrice: 120,
      sellingPrice: 180,
      margin: 50,
      location: {
        warehouse: 'Ana Depo',
        shelf: 'B-08',
        bin: 'C-01',
        zone: 'Yağ Bölgesi'
      },
      unit: 'adet',
      stockStatus: 'out-of-stock',
      needsReorder: true,
      stockValue: 0,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-14T11:00:00Z')
    }
  ];

  res.json({
    status: 'success',
    data: demoInventory,
    pagination: {
      current: 1,
      pages: 1,
      total: demoInventory.length
    },
    message: 'Demo stok öğeleri (Demo Mod)'
  });
});

// Demo inventory stats endpoint
app.get('/api/inventory/stats', (req, res) => {
  const stats = {
    totalItems: 25,
    totalValue: 125000,
    lowStockItems: 8,
    outOfStockItems: 3,
    overstockItems: 2,
    categories: {
      'Fren Sistemi': 8,
      'Motor Parçaları': 6,
      'Yağ ve Sıvılar': 4,
      'Elektrik': 3,
      'Gövde': 2,
      'Diğer': 2
    },
    topBrands: [
      { name: 'Toyota Orijinal', count: 12, value: 75000 },
      { name: 'Castrol', count: 5, value: 25000 },
      { name: 'Bosch', count: 4, value: 15000 },
      { name: 'Valeo', count: 3, value: 8000 },
      { name: 'Diğer', count: 1, value: 2000 }
    ]
  };

  res.json({
    status: 'success',
    data: stats,
    message: 'Demo stok istatistikleri (Demo Mod)'
  });
});

// Demo appointments endpoint
app.get('/api/appointments', (req, res) => {
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
        }
      ],
      customerConfirmation: {
        confirmed: true,
        confirmedAt: new Date('2024-01-14T16:00:00Z'),
        confirmationMethod: 'sms'
      },
      totalEstimatedCost: 260,
      totalActualCost: 260,
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

  res.json({
    status: 'success',
    data: demoAppointments,
    pagination: {
      current: 1,
      pages: 1,
      total: demoAppointments.length
    },
    message: 'Demo randevular (Demo Mod)'
  });
});

// Demo appointment stats endpoint
app.get('/api/appointments/stats', (req, res) => {
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

  res.json({
    status: 'success',
    data: stats,
    message: 'Demo randevu istatistikleri (Demo Mod)'
  });
});

// Demo payments endpoint
app.get('/api/payments', (req, res) => {
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
    },
    {
      _id: 'demo_payment_3',
      invoiceNumber: 'FAT-2024-003',
      invoiceDate: new Date('2024-01-10T11:00:00Z'),
      dueDate: new Date('2024-01-17T11:00:00Z'),
      paymentMethod: 'cash',
      paymentStatus: 'overdue',
      subtotal: 150,
      taxRate: 20,
      taxAmount: 30,
      totalAmount: 162,
      paidAmount: 0,
      remainingAmount: 162,
      customerInfo: {
        name: 'Fatma Özkan',
        phone: '+90 555 555 6677',
        email: 'fatma@demo.com'
      },
      vehicleInfo: {
        plate: '35 DEF 456',
        brand: 'Ford',
        model: 'Focus',
        year: 2021
      },
      isOverdue: true,
      isFullyPaid: false,
      paymentProgress: 0,
      daysOverdue: 2,
      createdAt: new Date('2024-01-10T11:00:00Z'),
      updatedAt: new Date('2024-01-10T11:00:00Z')
    }
  ];

  res.json({
    status: 'success',
    data: demoPayments,
    pagination: {
      current: 1,
      pages: 1,
      total: demoPayments.length
    },
    message: 'Demo ödemeler (Demo Mod)'
  });
});

// Demo payment stats endpoint
app.get('/api/payments/stats', (req, res) => {
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

  res.json({
    status: 'success',
    data: stats,
    message: 'Demo ödeme istatistikleri (Demo Mod)'
  });
});

// Demo reports endpoint
app.get('/api/reports', (req, res) => {
  const demoReports = [
    {
      _id: 'demo_report_1',
      reportType: 'revenue',
      reportName: 'Aylık Gelir Raporu',
      reportDescription: 'Ocak 2024 aylık gelir analizi',
      dateRange: {
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
        period: 'monthly'
      },
      data: {
        summary: {
          totalRecords: 45,
          totalRevenue: 125000,
          totalCost: 75000,
          totalProfit: 50000,
          averageValue: 2777.78,
          growthRate: 15.5
        },
        timeSeries: [
          { date: new Date('2024-01-01'), value: 5000, label: '1 Ocak' },
          { date: new Date('2024-01-02'), value: 7500, label: '2 Ocak' },
          { date: new Date('2024-01-03'), value: 6200, label: '3 Ocak' },
          { date: new Date('2024-01-04'), value: 8800, label: '4 Ocak' },
          { date: new Date('2024-01-05'), value: 9200, label: '5 Ocak' }
        ],
        categories: [
          { name: 'Fren Sistemi', value: 35000, percentage: 28 },
          { name: 'Motor Onarımı', value: 28000, percentage: 22.4 },
          { name: 'Periyodik Bakım', value: 25000, percentage: 20 },
          { name: 'Elektrik', value: 15000, percentage: 12 },
          { name: 'Diğer', value: 22000, percentage: 17.6 }
        ]
      },
      chartConfig: {
        type: 'bar',
        title: 'Aylık Gelir Dağılımı',
        xAxisLabel: 'Hizmet Türü',
        yAxisLabel: 'Gelir (TL)',
        showLegend: true,
        showGrid: true,
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      },
      status: 'completed',
      generatedAt: new Date('2024-01-31T23:59:59Z'),
      generatedBy: 'demo_user_1',
      exportOptions: {
        formats: ['pdf', 'excel'],
        includeCharts: true,
        includeDetails: true,
        includeSummary: true
      },
      createdAt: new Date('2024-01-31T23:59:59Z'),
      updatedAt: new Date('2024-01-31T23:59:59Z')
    },
    {
      _id: 'demo_report_2',
      reportType: 'customer',
      reportName: 'Müşteri Analizi Raporu',
      reportDescription: 'Müşteri segmentasyonu ve davranış analizi',
      dateRange: {
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
        period: 'monthly'
      },
      data: {
        summary: {
          totalRecords: 120,
          totalRevenue: 125000,
          averageValue: 1041.67,
          growthRate: 8.2
        },
        categories: [
          { name: 'VIP Müşteriler', value: 15, percentage: 12.5 },
          { name: 'Sadık Müşteriler', value: 35, percentage: 29.2 },
          { name: 'Yeni Müşteriler', value: 25, percentage: 20.8 },
          { name: 'Riskli Müşteriler', value: 20, percentage: 16.7 },
          { name: 'Kayıp Müşteriler', value: 25, percentage: 20.8 }
        ]
      },
      chartConfig: {
        type: 'pie',
        title: 'Müşteri Segmentasyonu',
        showLegend: true,
        showGrid: false,
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      },
      status: 'completed',
      generatedAt: new Date('2024-01-31T23:59:59Z'),
      generatedBy: 'demo_user_1',
      exportOptions: {
        formats: ['pdf', 'excel'],
        includeCharts: true,
        includeDetails: true,
        includeSummary: true
      },
      createdAt: new Date('2024-01-31T23:59:59Z'),
      updatedAt: new Date('2024-01-31T23:59:59Z')
    },
    {
      _id: 'demo_report_3',
      reportType: 'work_order',
      reportName: 'İş Emri Performans Raporu',
      reportDescription: 'İş emri tamamlanma süreleri ve verimlilik analizi',
      dateRange: {
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
        period: 'monthly'
      },
      data: {
        summary: {
          totalRecords: 85,
          totalRevenue: 125000,
          averageValue: 1470.59,
          growthRate: 12.3
        },
        timeSeries: [
          { date: new Date('2024-01-01'), value: 3, label: '1 Ocak' },
          { date: new Date('2024-01-02'), value: 5, label: '2 Ocak' },
          { date: new Date('2024-01-03'), value: 4, label: '3 Ocak' },
          { date: new Date('2024-01-04'), value: 6, label: '4 Ocak' },
          { date: new Date('2024-01-05'), value: 7, label: '5 Ocak' }
        ],
        categories: [
          { name: 'Tamamlandı', value: 65, percentage: 76.5 },
          { name: 'Devam Ediyor', value: 12, percentage: 14.1 },
          { name: 'Beklemede', value: 5, percentage: 5.9 },
          { name: 'İptal Edildi', value: 3, percentage: 3.5 }
        ]
      },
      chartConfig: {
        type: 'line',
        title: 'Günlük İş Emri Sayısı',
        xAxisLabel: 'Tarih',
        yAxisLabel: 'İş Emri Sayısı',
        showLegend: true,
        showGrid: true,
        colors: ['#3B82F6']
      },
      status: 'completed',
      generatedAt: new Date('2024-01-31T23:59:59Z'),
      generatedBy: 'demo_user_1',
      exportOptions: {
        formats: ['pdf', 'excel'],
        includeCharts: true,
        includeDetails: true,
        includeSummary: true
      },
      createdAt: new Date('2024-01-31T23:59:59Z'),
      updatedAt: new Date('2024-01-31T23:59:59Z')
    }
  ];

  res.json({
    status: 'success',
    data: demoReports,
    pagination: {
      current: 1,
      pages: 1,
      total: demoReports.length
    },
    message: 'Demo raporlar (Demo Mod)'
  });
});

// Demo report stats endpoint
app.get('/api/reports/stats', (req, res) => {
  const stats = {
    totalReports: 12,
    completedReports: 10,
    scheduledReports: 3,
    failedReports: 1,
    totalExports: 45,
    thisMonth: 5,
    lastMonth: 4,
    averageGenerationTime: 2.5,
    reportTypes: {
      'revenue': 4,
      'customer': 3,
      'work_order': 2,
      'inventory': 1,
      'appointment': 1,
      'payment': 1
    },
    topReports: [
      { name: 'Aylık Gelir Raporu', views: 25, exports: 8 },
      { name: 'Müşteri Analizi Raporu', views: 18, exports: 5 },
      { name: 'İş Emri Performans Raporu', views: 15, exports: 3 },
      { name: 'Stok Durumu Raporu', views: 12, exports: 2 },
      { name: 'Randevu Analizi Raporu', views: 10, exports: 1 }
    ]
  };

  res.json({
    status: 'success',
    data: stats,
    message: 'Demo rapor istatistikleri (Demo Mod)'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'OtoTakibim API çalışıyor (Demo Mod)',
    timestamp: new Date().toISOString(),
    environment: 'demo'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Demo Backend başlatıldı! Port: ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`🚗 Vehicles: http://localhost:${PORT}/api/vehicles`);
});
