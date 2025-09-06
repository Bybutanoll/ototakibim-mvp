import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import { CustomError, catchAsync } from '../middleware/errorHandler';

export const customerController = {
  /**
   * Get all customers for the authenticated user
   */
  getCustomers: catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10, search } = req.query;

    // Demo mode - return hardcoded demo customers
    if (process.env.DEMO_MODE === 'true') {
      const demoCustomers = [
        {
          _id: 'demo_customer_1',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          phone: '+90 555 123 4567',
          email: 'ahmet@example.com',
          address: {
            street: 'Atatürk Caddesi No:123',
            city: 'İstanbul',
            district: 'Kadıköy',
            postalCode: '34710'
          },
          owner: userId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'demo_customer_2',
          firstName: 'Fatma',
          lastName: 'Demir',
          phone: '+90 555 987 6543',
          email: 'fatma@example.com',
          address: {
            street: 'Cumhuriyet Caddesi No:456',
            city: 'Ankara',
            district: 'Çankaya',
            postalCode: '06420'
          },
          owner: userId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      return res.json({
        status: 'success',
        data: demoCustomers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      });
    }

    let query: any = { owner: userId, isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Customer.countDocuments(query)
    ]);

    res.json({
      status: 'success',
      data: customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  }),

  /**
   * Get a single customer by ID with vehicles
   */
  getCustomer: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Demo mode
    if (process.env.DEMO_MODE === 'true') {
      const demoCustomer = {
        _id: 'demo_customer_1',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '+90 555 123 4567',
        email: 'ahmet@example.com',
        address: {
          street: 'Atatürk Caddesi No:123',
          city: 'İstanbul',
          district: 'Kadıköy',
          postalCode: '34710'
        },
        owner: userId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return res.json({
        status: 'success',
        data: demoCustomer
      });
    }

    const customer = await Customer.findOne({
      _id: id,
      owner: userId,
      isActive: true
    });

    if (!customer) {
      throw new CustomError('Müşteri bulunamadı', 404);
    }

    // Get customer's vehicles
    const vehicles = await Vehicle.findByCustomer(customer._id.toString());

    res.json({
      status: 'success',
      data: {
        ...customer.toObject(),
        vehicles
      }
    });
  }),

  /**
   * Create a new customer
   */
  createCustomer: catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError('Geçersiz veri', 400);
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
  }),

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
