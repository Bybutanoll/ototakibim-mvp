import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Vehicle from '../models/Vehicle';

export const maintenanceController = {
  /**
   * Get all maintenance records for a vehicle
   */
  async getMaintenanceRecords(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const userId = (req as any).user.id;

      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
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
        data: vehicle.maintenanceHistory || []
      });
    } catch (error) {
      console.error('Get maintenance records error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Bakım kayıtları yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get a single maintenance record
   */
  async getMaintenanceRecord(req: Request, res: Response) {
    try {
      const { vehicleId, id } = req.params;
      const userId = (req as any).user.id;

      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: userId,
        isActive: true
      });

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Araç bulunamadı'
        });
      }

      const maintenanceRecord = vehicle.maintenanceHistory?.find(
        (record: any) => record._id?.toString() === id
      );

      if (!maintenanceRecord) {
        return res.status(404).json({
          status: 'error',
          message: 'Bakım kaydı bulunamadı'
        });
      }

      res.json({
        status: 'success',
        data: maintenanceRecord
      });
    } catch (error) {
      console.error('Get maintenance record error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Bakım kaydı yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Create a new maintenance record
   */
  async createMaintenanceRecord(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const { vehicleId } = req.params;
      const userId = (req as any).user.id;

      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: userId,
        isActive: true
      });

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Araç bulunamadı'
        });
      }

      const maintenanceData = {
        ...req.body,
        date: new Date(req.body.date),
        cost: parseFloat(req.body.cost) || 0,
        mileage: parseInt(req.body.mileage) || 0,
        nextServiceDate: req.body.nextServiceDate ? new Date(req.body.nextServiceDate) : undefined,
        nextServiceMileage: req.body.nextServiceMileage ? parseInt(req.body.nextServiceMileage) : undefined,
        createdAt: new Date()
      };

      // Add maintenance record to vehicle
      if (!vehicle.maintenanceHistory) {
        vehicle.maintenanceHistory = [];
      }

      vehicle.maintenanceHistory.push(maintenanceData);

      // Update vehicle mileage if the maintenance mileage is higher
      if (maintenanceData.mileage > vehicle.mileage) {
        vehicle.mileage = maintenanceData.mileage;
      }

      await vehicle.save();

      res.status(201).json({
        status: 'success',
        data: maintenanceData,
        message: 'Bakım kaydı başarıyla oluşturuldu'
      });
    } catch (error) {
      console.error('Create maintenance record error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Bakım kaydı oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Update a maintenance record
   */
  async updateMaintenanceRecord(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const { vehicleId, id } = req.params;
      const userId = (req as any).user.id;

      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: userId,
        isActive: true
      });

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Araç bulunamadı'
        });
      }

      const maintenanceIndex = vehicle.maintenanceHistory?.findIndex(
        (record: any) => record._id?.toString() === id
      );

      if (maintenanceIndex === -1 || maintenanceIndex === undefined) {
        return res.status(404).json({
          status: 'error',
          message: 'Bakım kaydı bulunamadı'
        });
      }

      const updatedMaintenanceData = {
        ...req.body,
        date: new Date(req.body.date),
        cost: parseFloat(req.body.cost) || 0,
        mileage: parseInt(req.body.mileage) || 0,
        nextServiceDate: req.body.nextServiceDate ? new Date(req.body.nextServiceDate) : undefined,
        nextServiceMileage: req.body.nextServiceMileage ? parseInt(req.body.nextServiceMileage) : undefined,
        updatedAt: new Date()
      };

      // Update the maintenance record
      vehicle.maintenanceHistory[maintenanceIndex] = {
        ...vehicle.maintenanceHistory[maintenanceIndex],
        ...updatedMaintenanceData
      };

      // Update vehicle mileage if the maintenance mileage is higher
      if (updatedMaintenanceData.mileage > vehicle.mileage) {
        vehicle.mileage = updatedMaintenanceData.mileage;
      }

      await vehicle.save();

      res.json({
        status: 'success',
        data: vehicle.maintenanceHistory[maintenanceIndex],
        message: 'Bakım kaydı başarıyla güncellendi'
      });
    } catch (error) {
      console.error('Update maintenance record error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Bakım kaydı güncellenirken hata oluştu'
      });
    }
  },

  /**
   * Delete a maintenance record
   */
  async deleteMaintenanceRecord(req: Request, res: Response) {
    try {
      const { vehicleId, id } = req.params;
      const userId = (req as any).user.id;

      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: userId,
        isActive: true
      });

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Araç bulunamadı'
        });
      }

      const maintenanceIndex = vehicle.maintenanceHistory?.findIndex(
        (record: any) => record._id?.toString() === id
      );

      if (maintenanceIndex === -1 || maintenanceIndex === undefined) {
        return res.status(404).json({
          status: 'error',
          message: 'Bakım kaydı bulunamadı'
        });
      }

      // Remove the maintenance record
      vehicle.maintenanceHistory.splice(maintenanceIndex, 1);

      await vehicle.save();

      res.json({
        status: 'success',
        message: 'Bakım kaydı başarıyla silindi'
      });
    } catch (error) {
      console.error('Delete maintenance record error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Bakım kaydı silinirken hata oluştu'
      });
    }
  }
};

export default maintenanceController;
