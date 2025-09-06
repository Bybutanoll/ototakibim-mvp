import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Vehicle, { IVehicle } from '../models/Vehicle';
import Customer from '../models/Customer';
import { CustomError, catchAsync } from '../middleware/errorHandler';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/vehicles');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter
});

// Tüm araçları getir (kullanıcının kendi araçları)
export const getVehicles = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { page = 1, limit = 10, search } = req.query;
  
  // Demo mode - return demo vehicles
  if (process.env.DEMO_MODE === 'true') {
    const demoVehicles = [
      {
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
        color: 'Beyaz',
        owner: userId,
        customer: 'demo_customer_1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'demo_vehicle_2',
        plate: '06 XYZ 789',
        brand: 'Volkswagen',
        vehicleModel: 'Golf',
        year: 2019,
        vin: '1HGBH41JXMN109187',
        engineSize: '1.4L',
        fuelType: 'gasoline',
        transmission: 'manual',
        mileage: 62000,
        color: 'Siyah',
        owner: userId,
        customer: 'demo_customer_2',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'demo_vehicle_3',
        plate: '35 DEF 456',
        brand: 'Ford',
        vehicleModel: 'Focus',
        year: 2021,
        vin: '1HGBH41JXMN109188',
        engineSize: '1.5L',
        fuelType: 'diesel',
        transmission: 'automatic',
        mileage: 28000,
        color: 'Mavi',
        owner: userId,
        customer: 'demo_customer_1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ];

      return res.json({
        status: 'success',
        data: demoVehicles,
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          pages: 1
        }
      });
    }
    
    let query: any = { owner: userId, isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { plate: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { vehicleModel: { $regex: search, $options: 'i' } },
        { vin: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate('customer', 'firstName lastName phone email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Vehicle.countDocuments(query)
    ]);

    res.json({
      status: 'success',
      data: vehicles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
});

// Tek araç getir
export const getVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const vehicle = await Vehicle.findOne({ 
      _id: id, 
      owner: userId, 
      isActive: true 
    });

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Araç bulunamadı'
      });
    }

    res.json({
      status: 'success',
      data: vehicle
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Araç getirilirken hata oluştu'
    });
  }
};

// Yeni araç oluştur
export const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  // Handle file uploads
  const photos: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    photos.push(...req.files.map((file: Express.Multer.File) => 
      `/uploads/vehicles/${file.filename}`
    ));
  }

  // Customer validation
  const customer = await Customer.findOne({
    _id: req.body.customer,
    owner: userId,
    isActive: true
  });

  if (!customer) {
    throw new CustomError('Geçersiz müşteri', 400);
  }

  const vehicleData = {
    ...req.body,
    owner: userId,
    customer: req.body.customer,
    photos: photos,
    mileage: parseInt(req.body.mileage) || 0,
    year: parseInt(req.body.year) || new Date().getFullYear(),
    plate: req.body.plate.toUpperCase()
  };

  // Plaka benzersizlik kontrolü
  const existingVehicle = await Vehicle.findOne({
    plate: vehicleData.plate,
    owner: userId,
    isActive: true
  });

  if (existingVehicle) {
    throw new CustomError('Bu plaka zaten kayıtlı', 400);
  }

  const vehicle = new Vehicle(vehicleData);
  await vehicle.save();

  // Populate customer data
  await vehicle.populate('customer', 'firstName lastName phone email');

  res.status(201).json({
    status: 'success',
    message: 'Araç başarıyla oluşturuldu',
    data: vehicle
  });
});

// Araç güncelle
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = (req as any).user.id;
    const updateData = req.body;

    // Plaka ve VIN benzersizlik kontrolü (kendi araçları hariç)
    if (updateData.plate || updateData.vin) {
      const existingVehicle = await Vehicle.findOne({
        _id: { $ne: id },
        owner: userId,
        $or: [
          { plate: updateData.plate },
          { vin: updateData.vin }
        ]
      });

      if (existingVehicle) {
        return res.status(400).json({
          status: 'error',
          message: 'Bu plaka veya VIN numarası zaten kayıtlı'
        });
      }
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, owner: userId, isActive: true },
      updateData,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Araç bulunamadı'
      });
    }

    res.json({
      status: 'success',
      message: 'Araç başarıyla güncellendi',
      data: vehicle
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Araç güncellenirken hata oluştu'
    });
  }
};

// Araç sil (soft delete)
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, owner: userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Araç bulunamadı'
      });
    }

    res.json({
      status: 'success',
      message: 'Araç başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Araç silinirken hata oluştu'
    });
  }
};

// Araç arama
export const searchVehicles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { q, brand, model, year } = req.query;

    let searchQuery: any = { owner: userId, isActive: true };

    // Text search
    if (q) {
      searchQuery.$text = { $search: q as string };
    }

    // Filter by brand
    if (brand) {
      searchQuery.brand = { $regex: brand as string, $options: 'i' };
    }

    // Filter by model
    if (model) {
      searchQuery.model = { $regex: model as string, $options: 'i' };
    }

    // Filter by year
    if (year) {
      searchQuery.year = parseInt(year as string);
    }

    const vehicles = await Vehicle.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      status: 'success',
      data: vehicles
    });
  } catch (error) {
    console.error('Search vehicles error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Araç arama hatası'
    });
  }
};

// Bakım geçmişi ekle
export const addMaintenanceRecord = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = (req as any).user.id;
    const maintenanceData = req.body;

    const vehicle = await Vehicle.findOne({ 
      _id: id, 
      owner: userId, 
      isActive: true 
    });

    if (!vehicle) {
      return res.status(404).json({
        status: 'error',
        message: 'Araç bulunamadı'
      });
    }

    vehicle.maintenanceHistory.push(maintenanceData);
    vehicle.mileage = maintenanceData.mileage; // Kilometreyi güncelle
    await vehicle.save();

    res.json({
      status: 'success',
      message: 'Bakım kaydı eklendi',
      data: vehicle
    });
  } catch (error) {
    console.error('Add maintenance record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Bakım kaydı eklenirken hata oluştu'
    });
  }
};
