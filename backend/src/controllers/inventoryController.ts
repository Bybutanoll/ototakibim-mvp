import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Inventory from '../models/Inventory';
import Supplier from '../models/Supplier';
import { catchAsync, CustomError } from '../middleware/errorHandler';

// Demo mode kontrolü
const isDemoMode = process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI;

// Get all inventory items with pagination and search
export const getInventoryItems = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
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
      }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    let filteredInventory = demoInventory;
    
    if (search) {
      filteredInventory = filteredInventory.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: paginatedInventory,
      pagination: {
        current: page,
        pages: Math.ceil(filteredInventory.length / limit),
        total: filteredInventory.length
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
          { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const inventoryItems = await Inventory.find(query)
    .populate('suppliers.supplierId', 'name contactInfo')
    .populate('stockMovements.performedBy', 'firstName lastName')
    .sort({ name: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

      const total = await Inventory.countDocuments(query);

      res.json({
        status: 'success',
    data: inventoryItems,
          pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// Get inventory statistics
export const getInventoryStats = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
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
      }
    };

    res.json({ status: 'success', data: stats });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const stats = await Inventory.aggregate([
    { $match: { owner: userId, isActive: true } },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } },
        lowStockItems: {
          $sum: {
            $cond: [{ $lte: ['$currentStock', '$minimumStock'] }, 1, 0]
          }
        },
        outOfStockItems: {
          $sum: {
            $cond: [{ $eq: ['$currentStock', 0] }, 1, 0]
          }
        }
      }
    }
  ]);

  res.json({ status: 'success', data: stats[0] || {} });
});

// Create new inventory item
export const createInventoryItem = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const newItem = {
      _id: 'demo_inventory_new',
      partNumber: req.body.partNumber || 'NEW-001',
      name: req.body.name || 'Yeni Stok Öğesi',
      description: req.body.description || 'Demo stok öğesi',
      category: req.body.category || 'Genel',
      brand: req.body.brand || 'Demo Marka',
      currentStock: req.body.currentStock || 0,
      minimumStock: req.body.minimumStock || 5,
      maximumStock: req.body.maximumStock || 50,
      costPrice: req.body.costPrice || 100,
      sellingPrice: req.body.sellingPrice || 150,
      margin: 50,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({ status: 'success', message: 'Stok öğesi başarıyla oluşturuldu', data: newItem });
    return;
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const {
    partNumber,
    name,
    description,
    category,
    brand,
    currentStock,
    minimumStock,
    maximumStock,
    costPrice,
    sellingPrice
  } = req.body;

  // Check if part number already exists
  const existingItem = await Inventory.findOne({ partNumber, owner: userId, isActive: true });
  if (existingItem) {
    throw new CustomError('Bu parça numarası zaten mevcut', 400);
  }

  // Create inventory item
  const inventoryItem = new Inventory({
        owner: userId,
    partNumber,
    name,
    description,
    category,
    brand,
    currentStock: currentStock || 0,
    minimumStock,
    maximumStock,
    reorderPoint: minimumStock,
    reorderQuantity: Math.ceil(maximumStock * 0.5),
    costPrice,
    sellingPrice,
    margin: ((sellingPrice - costPrice) / costPrice) * 100,
    location: {
      warehouse: 'Ana Depo',
      shelf: '',
      bin: '',
      zone: ''
    },
    unit: 'adet',
    warranty: {
      duration: 0,
      type: 'none'
    },
    stockMovements: [],
    autoReorder: {
      enabled: false,
      reorderFrequency: 30
    },
    status: 'active'
  });

  await inventoryItem.save();

  res.status(201).json({ status: 'success', message: 'Stok öğesi başarıyla oluşturuldu', data: inventoryItem });
});

// Get single inventory item
export const getInventoryItem = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    const demoItem = {
      _id: 'demo_inventory_1',
      partNumber: 'FB-001',
      name: 'Fren Balata Seti (Ön)',
      description: 'Toyota Corolla için ön fren balata seti',
      category: 'Fren Sistemi',
      brand: 'Toyota Orijinal',
      currentStock: 5,
      minimumStock: 3,
      maximumStock: 20,
      costPrice: 180,
      sellingPrice: 250,
      margin: 38.9,
      status: 'active',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-15T14:30:00Z')
    };

    res.json({ status: 'success', data: demoItem });
    return;
  }

      const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const inventoryItem = await Inventory.findOne({ _id: id, owner: userId, isActive: true });
  if (!inventoryItem) {
    throw new CustomError('Stok öğesi bulunamadı', 404);
  }

  res.json({ status: 'success', data: inventoryItem });
});

// Update inventory item
export const updateInventoryItem = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Stok öğesi başarıyla güncellendi' });
    return;
  }

      const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const inventoryItem = await Inventory.findOne({ _id: id, owner: userId, isActive: true });
  if (!inventoryItem) {
    throw new CustomError('Stok öğesi bulunamadı', 404);
  }

  // Update fields
  const allowedUpdates = [
    'name', 'description', 'category', 'brand',
    'minimumStock', 'maximumStock', 'costPrice', 'sellingPrice', 'status'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      (inventoryItem as any)[field] = req.body[field];
    }
  });

  // Recalculate margin
  if (req.body.costPrice !== undefined || req.body.sellingPrice !== undefined) {
    inventoryItem.margin = ((inventoryItem.sellingPrice - inventoryItem.costPrice) / inventoryItem.costPrice) * 100;
  }

  await inventoryItem.save();

  res.json({ status: 'success', message: 'Stok öğesi başarıyla güncellendi', data: inventoryItem });
});

// Delete inventory item
export const deleteInventoryItem = catchAsync(async (req: Request, res: Response) => {
  if (isDemoMode) {
    res.json({ status: 'success', message: 'Stok öğesi başarıyla silindi' });
    return;
  }

  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new CustomError('Kullanıcı kimliği bulunamadı', 401);
  }

  const inventoryItem = await Inventory.findOne({ _id: id, owner: userId, isActive: true });
  if (!inventoryItem) {
    throw new CustomError('Stok öğesi bulunamadı', 404);
  }

  inventoryItem.isActive = false;
  await inventoryItem.save();

  res.json({ status: 'success', message: 'Stok öğesi başarıyla silindi' });
});