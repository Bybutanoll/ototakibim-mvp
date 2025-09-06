import express from 'express';
import { body } from 'express-validator';
import {
  getPayments,
  getPayment,
  createPayment,
  addPayment,
  deletePayment,
  getPaymentStats
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const createPaymentValidation = [
  body('customer').isMongoId().withMessage('Geçerli müşteri ID gerekli'),
  body('vehicle').isMongoId().withMessage('Geçerli araç ID gerekli'),
  body('invoiceNumber').trim().isLength({ min: 1, max: 50 }).withMessage('Fatura numarası 1-50 karakter arası olmalı'),
  body('paymentMethod').isIn(['cash', 'credit_card', 'bank_transfer', 'check', 'installment', 'other']).withMessage('Geçerli ödeme yöntemi gerekli'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Ara toplam pozitif olmalı'),
  body('taxRate').isFloat({ min: 0, max: 100 }).withMessage('Vergi oranı 0-100 arası olmalı'),
  body('invoiceDate').isISO8601().withMessage('Geçerli fatura tarihi gerekli'),
  body('dueDate').isISO8601().withMessage('Geçerli vade tarihi gerekli')
];

const addPaymentValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Ödeme tutarı pozitif olmalı'),
  body('paymentMethod').trim().isLength({ min: 1 }).withMessage('Ödeme yöntemi gerekli'),
  body('referenceNumber').optional().trim().isLength({ max: 100 }).withMessage('Referans numarası 100 karakterden az olmalı')
];

// Routes
router.get('/', authenticateToken, getPayments);
router.get('/stats', authenticateToken, getPaymentStats);
router.get('/:id', authenticateToken, getPayment);
router.post('/', authenticateToken, createPaymentValidation, createPayment);
router.patch('/:id/add-payment', authenticateToken, addPaymentValidation, addPayment);
router.delete('/:id', authenticateToken, deletePayment);

export default router;