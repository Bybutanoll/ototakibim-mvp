import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AIService, { VehicleData } from '../services/aiService';
import Vehicle from '../models/Vehicle';

export const aiController = {
  /**
   * Get maintenance predictions for a vehicle
   */
  async getMaintenancePredictions(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const userId = (req as any).user.id;

      // Get vehicle data
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: userId
      });

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Araç bulunamadı'
        });
      }

      // Prepare vehicle data for AI service
      const vehicleData: VehicleData = {
        make: vehicle.brand,
        model: vehicle.vehicleModel,
        year: vehicle.year,
        mileage: vehicle.mileage,
        lastServiceDate: (vehicle as any).lastService || new Date(),
        lastServiceMileage: vehicle.mileage - 10000, // Estimate
        serviceHistory: vehicle.maintenanceHistory || [],
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        drivingConditions: 'mixed', // Default
        averageMonthlyMileage: 1500 // Default
      };

      // Generate predictions
      const predictions = await AIService.generateMaintenancePredictions(vehicleData);

      res.json({
        status: 'success',
        data: predictions
      });
    } catch (error) {
      console.error('Maintenance predictions error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Bakım tahminleri oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Get maintenance cost estimation
   */
  async estimateMaintenanceCost(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const { serviceType } = req.body;
      const userId = (req as any).user.id;

      if (!serviceType) {
        return res.status(400).json({
          status: 'error',
          message: 'Hizmet türü gereklidir'
        });
      }

      // Get vehicle data
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: userId
      });

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Araç bulunamadı'
        });
      }

      // Prepare vehicle data
      const vehicleData: VehicleData = {
        make: vehicle.brand,
        model: vehicle.vehicleModel,
        year: vehicle.year,
        mileage: vehicle.mileage,
        lastServiceDate: (vehicle as any).lastService || new Date(),
        lastServiceMileage: vehicle.mileage - 10000,
        serviceHistory: vehicle.maintenanceHistory || [],
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        drivingConditions: 'mixed',
        averageMonthlyMileage: 1500
      };

      // Get cost estimation
      const costEstimation = await AIService.estimateMaintenanceCost(vehicleData, serviceType);

      res.json({
        status: 'success',
        data: {
          serviceType,
          costEstimation,
          vehicle: {
            make: vehicle.brand,
            model: vehicle.vehicleModel,
            year: vehicle.year
          }
        }
      });
    } catch (error) {
      console.error('Cost estimation error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Maliyet tahmini oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Get diagnostic suggestions
   */
  async getDiagnosticSuggestions(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;
      const { symptoms } = req.body;
      const userId = (req as any).user.id;

      if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Şikayetler gereklidir'
        });
      }

      // Get vehicle data
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: userId
      });

      if (!vehicle) {
        return res.status(404).json({
          status: 'error',
          message: 'Araç bulunamadı'
        });
      }

      // Prepare vehicle data
      const vehicleData: VehicleData = {
        make: vehicle.brand,
        model: vehicle.vehicleModel,
        year: vehicle.year,
        mileage: vehicle.mileage,
        lastServiceDate: (vehicle as any).lastService || new Date(),
        lastServiceMileage: vehicle.mileage - 10000,
        serviceHistory: vehicle.maintenanceHistory || [],
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        drivingConditions: 'mixed',
        averageMonthlyMileage: 1500
      };

      // Get diagnostic suggestions
      const diagnosticResult = await AIService.getDiagnosticSuggestions(symptoms, vehicleData);

      res.json({
        status: 'success',
        data: {
          symptoms,
          diagnosticResult,
          vehicle: {
            make: vehicle.brand,
            model: vehicle.vehicleModel,
            year: vehicle.year
          }
        }
      });
    } catch (error) {
      console.error('Diagnostic suggestions error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Diagnostik önerileri oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Get AI insights for dashboard
   */
  async getDashboardInsights(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      // Get all user vehicles
      const vehicles = await Vehicle.find({
        owner: userId,
        isActive: true
      });

      if (vehicles.length === 0) {
        return res.json({
          status: 'success',
          data: {
            insights: [],
            recommendations: ['Araç ekleyerek AI önerilerini almaya başlayın']
          }
        });
      }

      const insights = [];
      const recommendations = [];

      // Analyze each vehicle
      for (const vehicle of vehicles) {
        const vehicleData: VehicleData = {
          make: vehicle.brand,
          model: vehicle.vehicleModel,
          year: vehicle.year,
          mileage: vehicle.mileage,
          lastServiceDate: (vehicle as any).lastService || new Date(),
          lastServiceMileage: vehicle.mileage - 10000,
          serviceHistory: vehicle.maintenanceHistory || [],
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          drivingConditions: 'mixed',
          averageMonthlyMileage: 1500
        };

        // Get predictions for this vehicle
        const predictions = await AIService.generateMaintenancePredictions(vehicleData);
        
        // Find urgent predictions
        const urgentPredictions = predictions.filter(p => p.priority === 'urgent' || p.priority === 'high');
        
        if (urgentPredictions.length > 0) {
          insights.push({
            vehicleId: vehicle._id,
            vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`,
            urgentPredictions: urgentPredictions.length,
            nextService: urgentPredictions[0].predictedDate,
            estimatedCost: urgentPredictions.reduce((sum, p) => sum + p.estimatedCost, 0)
          });
        }
      }

      // Generate general recommendations
      if (insights.length === 0) {
        recommendations.push('Araçlarınızın bakım durumu iyi görünüyor');
      } else {
        recommendations.push(`${insights.length} aracınızda acil bakım gerekli`);
        recommendations.push('Öncelikli bakımları planlayın');
      }

      res.json({
        status: 'success',
        data: {
          insights,
          recommendations,
          totalVehicles: vehicles.length,
          vehiclesNeedingAttention: insights.length
        }
      });
    } catch (error) {
      console.error('Dashboard insights error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Dashboard öngörüleri oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Get maintenance schedule optimization
   */
  async getMaintenanceSchedule(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      // Get all user vehicles
      const vehicles = await Vehicle.find({
        owner: userId,
        isActive: true
      });

      const schedule = [];
      const currentMonth = new Date();
      currentMonth.setDate(1);

      // Generate 6-month schedule
      for (let month = 0; month < 6; month++) {
        const monthDate = new Date(currentMonth);
        monthDate.setMonth(currentMonth.getMonth() + month);
        
        const monthSchedule = {
          month: monthDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
          vehicles: []
        };

        for (const vehicle of vehicles) {
          const vehicleData: VehicleData = {
            make: vehicle.brand,
            model: vehicle.vehicleModel,
            year: vehicle.year,
            mileage: vehicle.mileage + (month * 1500), // Estimate future mileage
            lastServiceDate: (vehicle as any).lastService || new Date(),
            lastServiceMileage: vehicle.mileage - 10000,
            serviceHistory: vehicle.maintenanceHistory || [],
            fuelType: vehicle.fuelType,
            transmission: vehicle.transmission,
            drivingConditions: 'mixed',
            averageMonthlyMileage: 1500
          };

          const predictions = await AIService.generateMaintenancePredictions(vehicleData);
          const monthPredictions = predictions.filter(p => {
            const predictionMonth = new Date(p.predictedDate);
            return predictionMonth.getMonth() === monthDate.getMonth() && 
                   predictionMonth.getFullYear() === monthDate.getFullYear();
          });

          if (monthPredictions.length > 0) {
            (monthSchedule.vehicles as any[]).push({
              vehicleId: vehicle._id,
              vehicleName: `${vehicle.brand} ${vehicle.vehicleModel}`,
              services: monthPredictions.map(p => ({
                type: p.predictionType,
                date: p.predictedDate,
                cost: p.estimatedCost,
                priority: p.priority
              }))
            });
          }
        }

        schedule.push(monthSchedule);
      }

      res.json({
        status: 'success',
        data: {
          schedule,
          totalEstimatedCost: schedule.reduce((total, month) => 
            total + month.vehicles.reduce((monthTotal, vehicle) => 
              monthTotal + (vehicle as any).services.reduce((serviceTotal: any, service: any) => 
                serviceTotal + service.cost, 0), 0), 0
          )
        }
      });
    } catch (error) {
      console.error('Maintenance schedule error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Bakım programı oluşturulurken hata oluştu'
      });
    }
  }
};

export default aiController;
