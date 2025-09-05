import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Inventory from '../models/Inventory';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/inventory');
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

export const inventoryController = {
  upload,
  /**
   * Get all inventory items for the authenticated user
   */
  async getInventory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { category, search, lowStock, page = 1, limit = 20 } = req.query;

      let query: any = {
        owner: userId,
        isActive: true
      };

      // Filter by category
      if (category && category !== 'all') {
        query.category = category;
      }

      // Filter by low stock
      if (lowStock === 'true') {
        query.$expr = { $lte: ['$quantity', '$minQuantity'] };
      }

      // Search functionality
      if (search && typeof search === 'string') {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { partNumber: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const items = await Inventory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Inventory.countDocuments(query);

      res.json({
        status: 'success',
        data: {
          items,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get inventory error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Envanter yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get a single inventory item
   */
  async getInventoryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const item = await Inventory.findOne({
        _id: id,
        owner: userId,
        isActive: true
      });

      if (!item) {
        return res.status(404).json({
          status: 'error',
          message: 'Envanter öğesi bulunamadı'
        });
      }

      res.json({
        status: 'success',
        data: item
      });
    } catch (error) {
      console.error('Get inventory item error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Envanter öğesi yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Create a new inventory item
   */
  async createInventoryItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      // Handle file uploads
      const images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        images.push(...req.files.map((file: Express.Multer.File) => 
          `/uploads/inventory/${file.filename}`
        ));
      }

      const inventoryData = {
        ...req.body,
        owner: userId,
        images: images,
        quantity: parseInt(req.body.quantity) || 0,
        minQuantity: parseInt(req.body.minQuantity) || 5,
        maxQuantity: parseInt(req.body.maxQuantity) || 100,
        unitPrice: parseFloat(req.body.unitPrice) || 0,
        costPrice: parseFloat(req.body.costPrice) || 0,
        sellingPrice: parseFloat(req.body.sellingPrice) || 0,
        compatibility: req.body.compatibility ? JSON.parse(req.body.compatibility) : [],
        specifications: req.body.specifications ? JSON.parse(req.body.specifications) : {},
        tags: req.body.tags ? JSON.parse(req.body.tags) : []
      };

      const item = new Inventory(inventoryData);
      await item.save();

      res.status(201).json({
        status: 'success',
        data: item,
        message: 'Envanter öğesi başarıyla oluşturuldu'
      });
    } catch (error) {
      console.error('Create inventory item error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Envanter öğesi oluşturulurken hata oluştu'
      });
    }
  },

  /**
   * Update an inventory item
   */
  async updateInventoryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const item = await Inventory.findOne({
        _id: id,
        owner: userId,
        isActive: true
      });

      if (!item) {
        return res.status(404).json({
          status: 'error',
          message: 'Envanter öğesi bulunamadı'
        });
      }

      // Handle file uploads
      const newImages: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        newImages.push(...req.files.map((file: Express.Multer.File) => 
          `/uploads/inventory/${file.filename}`
        ));
      }

      const updateData = {
        ...req.body,
        images: newImages.length > 0 ? newImages : item.images,
        quantity: parseInt(req.body.quantity) || item.quantity,
        minQuantity: parseInt(req.body.minQuantity) || item.minQuantity,
        maxQuantity: parseInt(req.body.maxQuantity) || item.maxQuantity,
        unitPrice: parseFloat(req.body.unitPrice) || item.unitPrice,
        costPrice: parseFloat(req.body.costPrice) || item.costPrice,
        sellingPrice: parseFloat(req.body.sellingPrice) || item.sellingPrice,
        compatibility: req.body.compatibility ? JSON.parse(req.body.compatibility) : item.compatibility,
        specifications: req.body.specifications ? JSON.parse(req.body.specifications) : item.specifications,
        tags: req.body.tags ? JSON.parse(req.body.tags) : item.tags
      };

      const updatedItem = await Inventory.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        status: 'success',
        data: updatedItem,
        message: 'Envanter öğesi başarıyla güncellendi'
      });
    } catch (error) {
      console.error('Update inventory item error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Envanter öğesi güncellenirken hata oluştu'
      });
    }
  },

  /**
   * Delete an inventory item (soft delete)
   */
  async deleteInventoryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const item = await Inventory.findOneAndUpdate(
        {
          _id: id,
          owner: userId,
          isActive: true
        },
        { isActive: false },
        { new: true }
      );

      if (!item) {
        return res.status(404).json({
          status: 'error',
          message: 'Envanter öğesi bulunamadı'
        });
      }

      res.json({
        status: 'success',
        message: 'Envanter öğesi başarıyla silindi'
      });
    } catch (error) {
      console.error('Delete inventory item error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Envanter öğesi silinirken hata oluştu'
      });
    }
  },

  /**
   * Update inventory quantity
   */
  async updateQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity, operation } = req.body; // operation: 'add', 'subtract', 'set'
      const userId = (req as any).user.id;

      const item = await Inventory.findOne({
        _id: id,
        owner: userId,
        isActive: true
      });

      if (!item) {
        return res.status(404).json({
          status: 'error',
          message: 'Envanter öğesi bulunamadı'
        });
      }

      let newQuantity = item.quantity;
      switch (operation) {
        case 'add':
          newQuantity += quantity;
          break;
        case 'subtract':
          newQuantity = Math.max(0, newQuantity - quantity);
          break;
        case 'set':
          newQuantity = Math.max(0, quantity);
          break;
        default:
          return res.status(400).json({
            status: 'error',
            message: 'Geçersiz işlem türü'
          });
      }

      const updatedItem = await Inventory.findByIdAndUpdate(
        id,
        { quantity: newQuantity },
        { new: true }
      );

      res.json({
        status: 'success',
        data: updatedItem,
        message: 'Miktar başarıyla güncellendi'
      });
    } catch (error) {
      console.error('Update quantity error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Miktar güncellenirken hata oluştu'
      });
    }
  },

  /**
   * Get low stock items
   */
  async getLowStockItems(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const items = await Inventory.find({
        owner: userId,
        isActive: true,
        $expr: { $lte: ['$quantity', '$minQuantity'] }
      }).sort({ quantity: 1 });

      res.json({
        status: 'success',
        data: items
      });
    } catch (error) {
      console.error('Get low stock items error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Düşük stok öğeleri yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get compatible parts for a vehicle
   */
  async getCompatibleParts(req: Request, res: Response) {
    try {
      const { make, model, year, category } = req.query;
      const userId = (req as any).user.id;

      if (!make || !model) {
        return res.status(400).json({
          status: 'error',
          message: 'Marka ve model gereklidir'
        });
      }

      let query: any = {
        owner: userId,
        isActive: true,
        'compatibility.make': { $regex: new RegExp(make as string, 'i') },
        'compatibility.model': { $regex: new RegExp(model as string, 'i') }
      };

      if (year) {
        query.$or = [
          { 'compatibility.yearFrom': { $exists: false } },
          { 'compatibility.yearFrom': { $lte: Number(year) } },
          { 'compatibility.yearTo': { $exists: false } },
          { 'compatibility.yearTo': { $gte: Number(year) } }
        ];
      }

      if (category && category !== 'all') {
        query.category = category;
      }

      const items = await Inventory.find(query).sort({ name: 1 });

      res.json({
        status: 'success',
        data: items
      });
    } catch (error) {
      console.error('Get compatible parts error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Uyumlu parçalar yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get inventory statistics
   */
  async getInventoryStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const [
        totalItems,
        lowStockItems,
        outOfStockItems,
        totalValue,
        categoryStats
      ] = await Promise.all([
        Inventory.countDocuments({ owner: userId, isActive: true }),
        Inventory.countDocuments({
          owner: userId,
          isActive: true,
          $expr: { $lte: ['$quantity', '$minQuantity'] }
        }),
        Inventory.countDocuments({
          owner: userId,
          isActive: true,
          quantity: 0
        }),
        Inventory.aggregate([
          { $match: { owner: userId, isActive: true } },
          { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$costPrice'] } } } }
        ]),
        Inventory.aggregate([
          { $match: { owner: userId, isActive: true } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
      ]);

      res.json({
        status: 'success',
        data: {
          totalItems,
          lowStockItems,
          outOfStockItems,
          totalValue: totalValue[0]?.total || 0,
          categoryStats
        }
      });
    } catch (error) {
      console.error('Get inventory stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Envanter istatistikleri yüklenirken hata oluştu'
      });
    }
  }
};

export default inventoryController;
