import express from 'express';
import { body } from 'express-validator';
import {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats
} from '../controllers/inventoryController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const createInventoryValidation = [
  body('partNumber').trim().isLength({ min: 1, max: 50 }).withMessage('Parça numarası 1-50 karakter arası olmalı'),
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Parça adı 1-200 karakter arası olmalı'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('Kategori 1-100 karakter arası olmalı'),
  body('brand').trim().isLength({ min: 1, max: 100 }).withMessage('Marka 1-100 karakter arası olmalı'),
  body('minimumStock').isInt({ min: 0 }).withMessage('Minimum stok pozitif tam sayı olmalı'),
  body('maximumStock').isInt({ min: 1 }).withMessage('Maksimum stok pozitif tam sayı olmalı'),
  body('costPrice').isFloat({ min: 0 }).withMessage('Maliyet fiyatı pozitif olmalı'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Satış fiyatı pozitif olmalı')
];

const updateInventoryValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Parça adı 1-200 karakter arası olmalı'),
  body('category').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Kategori 1-100 karakter arası olmalı'),
  body('brand').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Marka 1-100 karakter arası olmalı'),
  body('minimumStock').optional().isInt({ min: 0 }).withMessage('Minimum stok pozitif tam sayı olmalı'),
  body('maximumStock').optional().isInt({ min: 1 }).withMessage('Maksimum stok pozitif tam sayı olmalı'),
  body('costPrice').optional().isFloat({ min: 0 }).withMessage('Maliyet fiyatı pozitif olmalı'),
  body('sellingPrice').optional().isFloat({ min: 0 }).withMessage('Satış fiyatı pozitif olmalı')
];

// Routes
router.get('/', authenticateToken, getInventoryItems);
router.get('/stats', authenticateToken, getInventoryStats);
router.get('/:id', authenticateToken, getInventoryItem);
router.post('/', authenticateToken, createInventoryValidation, createInventoryItem);
router.put('/:id', authenticateToken, updateInventoryValidation, updateInventoryItem);
router.delete('/:id', authenticateToken, deleteInventoryItem);

export default router;