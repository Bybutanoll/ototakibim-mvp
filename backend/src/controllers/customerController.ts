import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Customer from '../models/Customer';

export const customerController = {
  /**
   * Get all customers for the authenticated user
   */
  async getCustomers(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const customers = await Customer.find({
        owner: userId,
        isActive: true
      }).sort({ createdAt: -1 });

      res.json({
        status: 'success',
        data: customers
      });
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteriler yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get a single customer by ID
   */
  async getCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const customer = await Customer.findOne({
        _id: id,
        owner: userId,
        isActive: true
      });

      if (!customer) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      res.json({
        status: 'success',
        data: customer
      });
    } catch (error) {
      console.error('Get customer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Create a new customer
   */
  async createCustomer(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const userId = (req as any).user.id;
      const customerData = {
        ...req.body,
        owner: userId
      };

      const customer = new Customer(customerData);
      await customer.save();

      res.status(201).json({
        status: 'success',
        data: customer,
        message: 'Müşteri başarıyla oluşturuldu'
      });
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Update a customer
   */
  async updateCustomer(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz veri',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const userId = (req as any).user.id;

      const customer = await Customer.findOneAndUpdate(
        {
          _id: id,
          owner: userId,
          isActive: true
        },
        req.body,
        { new: true, runValidators: true }
      );

      if (!customer) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      res.json({
        status: 'success',
        data: customer,
        message: 'Müşteri başarıyla güncellendi'
      });
    } catch (error) {
      console.error('Update customer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri güncellenirken hata oluştu'
      });
    }
  },

  /**
   * Delete a customer (soft delete)
   */
  async deleteCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const customer = await Customer.findOneAndUpdate(
        {
          _id: id,
          owner: userId,
          isActive: true
        },
        { isActive: false },
        { new: true }
      );

      if (!customer) {
        return res.status(404).json({
          status: 'error',
          message: 'Müşteri bulunamadı'
        });
      }

      res.json({
        status: 'success',
        message: 'Müşteri başarıyla silindi'
      });
    } catch (error) {
      console.error('Delete customer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri silinirken hata oluştu'
      });
    }
  },

  /**
   * Search customers
   */
  async searchCustomers(req: Request, res: Response) {
    try {
      const { q } = req.query;
      const userId = (req as any).user.id;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Arama terimi gereklidir'
        });
      }

      const customers = await Customer.find({
        owner: userId,
        isActive: true,
        $or: [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      }).limit(10);

      res.json({
        status: 'success',
        data: customers
      });
    } catch (error) {
      console.error('Search customers error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri arama sırasında hata oluştu'
      });
    }
  }
};

export default customerController;
