import express from 'express';
import { body } from 'express-validator';
import inventoryController from '../controllers/inventoryController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All inventory routes require authentication
router.use(authenticateToken);

// Validation middleware
const inventoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Parça adı 2-100 karakter arasında olmalıdır'),
  body('category')
    .isIn([
      'engine', 'brake', 'suspension', 'electrical', 'body', 'interior', 
      'exterior', 'transmission', 'fuel_system', 'cooling_system', 
      'exhaust_system', 'tire', 'battery', 'filter', 'fluid', 'tool', 'other'
    ])
    .withMessage('Geçerli bir kategori seçiniz'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU 3-50 karakter arasında olmalıdır'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Miktar 0\'dan büyük olmalıdır'),
  body('minQuantity')
    .isInt({ min: 0 })
    .withMessage('Minimum miktar 0\'dan büyük olmalıdır'),
  body('maxQuantity')
    .isInt({ min: 0 })
    .withMessage('Maksimum miktar 0\'dan büyük olmalıdır'),
  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Birim fiyat 0\'dan büyük olmalıdır'),
  body('costPrice')
    .isFloat({ min: 0 })
    .withMessage('Maliyet fiyatı 0\'dan büyük olmalıdır'),
  body('sellingPrice')
    .isFloat({ min: 0 })
    .withMessage('Satış fiyatı 0\'dan büyük olmalıdır'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Açıklama en fazla 500 karakter olabilir'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Marka adı en fazla 50 karakter olabilir'),
  body('partNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Parça numarası en fazla 50 karakter olabilir')
];

const quantityValidation = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Miktar 0\'dan büyük olmalıdır'),
  body('operation')
    .isIn(['add', 'subtract', 'set'])
    .withMessage('Geçerli bir işlem türü seçiniz')
];

// Inventory Routes
router.get('/', inventoryController.getInventory);
router.get('/stats', inventoryController.getInventoryStats);
router.get('/low-stock', inventoryController.getLowStockItems);
router.get('/compatible', inventoryController.getCompatibleParts);
router.get('/:id', inventoryController.getInventoryItem);
router.post('/', inventoryController.upload.array('images', 5), inventoryController.createInventoryItem);
router.put('/:id', inventoryController.upload.array('images', 5), inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);
router.patch('/:id/quantity', quantityValidation, inventoryController.updateQuantity);

export default router;
