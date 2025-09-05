import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export const appointmentController = {
  /**
   * Get all appointments for the authenticated user
   */
  async getAppointments(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      // Mock appointments data
      const appointments = [
        {
          _id: new mongoose.Types.ObjectId(),
          customer: {
            _id: new mongoose.Types.ObjectId(),
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            phone: '0532 123 45 67'
          },
          vehicle: {
            _id: new mongoose.Types.ObjectId(),
            brand: 'Toyota',
            model: 'Corolla',
            plate: '34 ABC 123'
          },
          service: 'Yağ Değişimi',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          time: '10:00',
          status: 'scheduled',
          notes: 'Motor yağı değişimi ve filtre kontrolü',
          estimatedDuration: 30,
          estimatedCost: 150
        },
        {
          _id: new mongoose.Types.ObjectId(),
          customer: {
            _id: new mongoose.Types.ObjectId(),
            firstName: 'Ayşe',
            lastName: 'Demir',
            phone: '0533 987 65 43'
          },
          vehicle: {
            _id: new mongoose.Types.ObjectId(),
            brand: 'Honda',
            model: 'Civic',
            plate: '06 XYZ 789'
          },
          service: 'Fren Servisi',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          time: '14:30',
          status: 'scheduled',
          notes: 'Fren balata ve disk kontrolü',
          estimatedDuration: 60,
          estimatedCost: 300
        }
      ];

      res.json({
        status: 'success',
        data: appointments
      });
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Randevular yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Create a new appointment
   */
  async createAppointment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const appointmentData = {
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        status: 'scheduled',
        createdAt: new Date()
      };

      res.status(201).json({
        status: 'success',
        data: appointmentData,
        message: 'Randevu başarıyla oluşturuldu'
      });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Randevu oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Update an appointment
   */
  async updateAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };

      res.json({
        status: 'success',
        data: updateData,
        message: 'Randevu başarıyla güncellendi'
      });
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Randevu güncellenirken hata oluştu'
      });
    }
  },

  /**
   * Delete an appointment
   */
  async deleteAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      res.json({
        status: 'success',
        message: 'Randevu başarıyla silindi'
      });
    } catch (error) {
      console.error('Delete appointment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Randevu silinirken hata oluştu'
      });
    }
  }
};

export default appointmentController;
