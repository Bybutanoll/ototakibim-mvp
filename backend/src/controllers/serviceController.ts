import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const serviceController = {
  /**
   * Get all available services
   */
  async getServices(req: Request, res: Response) {
    try {
      const services = [
        {
          id: 'oil_change',
          name: 'Yağ Değişimi',
          description: 'Motor yağı ve filtre değişimi',
          category: 'maintenance',
          estimatedDuration: 30,
          basePrice: 150
        },
        {
          id: 'brake_service',
          name: 'Fren Servisi',
          description: 'Fren balata ve disk kontrolü',
          category: 'repair',
          estimatedDuration: 60,
          basePrice: 300
        },
        {
          id: 'tire_rotation',
          name: 'Lastik Rotasyonu',
          description: 'Lastik pozisyon değişimi',
          category: 'maintenance',
          estimatedDuration: 20,
          basePrice: 50
        },
        {
          id: 'general_inspection',
          name: 'Genel Muayene',
          description: 'Araç genel kontrolü',
          category: 'inspection',
          estimatedDuration: 45,
          basePrice: 100
        },
        {
          id: 'battery_check',
          name: 'Batarya Kontrolü',
          description: 'Batarya ve şarj sistemi kontrolü',
          category: 'electrical',
          estimatedDuration: 15,
          basePrice: 25
        },
        {
          id: 'air_filter',
          name: 'Hava Filtresi',
          description: 'Hava filtresi değişimi',
          category: 'maintenance',
          estimatedDuration: 15,
          basePrice: 40
        },
        {
          id: 'spark_plugs',
          name: 'Buji Değişimi',
          description: 'Buji ve buji kablosu değişimi',
          category: 'maintenance',
          estimatedDuration: 30,
          basePrice: 80
        },
        {
          id: 'transmission_service',
          name: 'Şanzıman Servisi',
          description: 'Şanzıman yağı değişimi',
          category: 'maintenance',
          estimatedDuration: 45,
          basePrice: 200
        }
      ];

      res.json({
        status: 'success',
        data: services
      });
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Servisler yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get service by ID
   */
  async getService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const services = [
        {
          id: 'oil_change',
          name: 'Yağ Değişimi',
          description: 'Motor yağı ve filtre değişimi',
          category: 'maintenance',
          estimatedDuration: 30,
          basePrice: 150
        },
        {
          id: 'brake_service',
          name: 'Fren Servisi',
          description: 'Fren balata ve disk kontrolü',
          category: 'repair',
          estimatedDuration: 60,
          basePrice: 300
        },
        {
          id: 'tire_rotation',
          name: 'Lastik Rotasyonu',
          description: 'Lastik pozisyon değişimi',
          category: 'maintenance',
          estimatedDuration: 20,
          basePrice: 50
        },
        {
          id: 'general_inspection',
          name: 'Genel Muayene',
          description: 'Araç genel kontrolü',
          category: 'inspection',
          estimatedDuration: 45,
          basePrice: 100
        },
        {
          id: 'battery_check',
          name: 'Batarya Kontrolü',
          description: 'Batarya ve şarj sistemi kontrolü',
          category: 'electrical',
          estimatedDuration: 15,
          basePrice: 25
        },
        {
          id: 'air_filter',
          name: 'Hava Filtresi',
          description: 'Hava filtresi değişimi',
          category: 'maintenance',
          estimatedDuration: 15,
          basePrice: 40
        },
        {
          id: 'spark_plugs',
          name: 'Buji Değişimi',
          description: 'Buji ve buji kablosu değişimi',
          category: 'maintenance',
          estimatedDuration: 30,
          basePrice: 80
        },
        {
          id: 'transmission_service',
          name: 'Şanzıman Servisi',
          description: 'Şanzıman yağı değişimi',
          category: 'maintenance',
          estimatedDuration: 45,
          basePrice: 200
        }
      ];

      const service = services.find(s => s.id === id);
      
      if (!service) {
        return res.status(404).json({
          status: 'error',
          message: 'Servis bulunamadı'
        });
      }

      res.json({
        status: 'success',
        data: service
      });
    } catch (error) {
      console.error('Get service error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Servis yüklenirken hata oluştu'
      });
    }
  }
};

export default serviceController;
