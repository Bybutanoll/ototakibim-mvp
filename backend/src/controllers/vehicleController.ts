import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Vehicle, { IVehicle } from '../models/Vehicle';

// Tüm araçları getir (kullanıcının kendi araçları)
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const vehicles = await Vehicle.find({ 
      owner: userId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: vehicles
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Araçlar getirilirken hata oluştu'
    });
  }
};

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
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const userId = (req as any).user.id;
    const vehicleData = { ...req.body, owner: userId };

    // Plaka ve VIN benzersizlik kontrolü
    const existingVehicle = await Vehicle.findOne({
      $or: [
        { plate: vehicleData.plate, owner: userId },
        { vin: vehicleData.vin, owner: userId }
      ]
    });

    if (existingVehicle) {
      return res.status(400).json({
        status: 'error',
        message: 'Bu plaka veya VIN numarası zaten kayıtlı'
      });
    }

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    res.status(201).json({
      status: 'success',
      message: 'Araç başarıyla oluşturuldu',
      data: vehicle
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Araç oluşturulurken hata oluştu'
    });
  }
};

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
