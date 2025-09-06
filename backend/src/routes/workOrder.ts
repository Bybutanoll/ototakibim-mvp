import express from 'express';
import { body } from 'express-validator';
import {
  getWorkOrders,
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  changeWorkOrderStatus,
  completeWorkflowStep,
  deleteWorkOrder,
  getWorkOrderStats
} from '../controllers/workOrderController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const createWorkOrderValidation = [
  body('customer').isMongoId().withMessage('Geçerli müşteri ID gerekli'),
  body('vehicle').isMongoId().withMessage('Geçerli araç ID gerekli'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Başlık 1-200 karakter arası olmalı'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Açıklama 1-2000 karakter arası olmalı'),
  body('type').isIn(['maintenance', 'repair', 'inspection', 'diagnostic', 'emergency']).withMessage('Geçerli iş emri tipi gerekli'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Geçerli öncelik seviyesi gerekli'),
  body('estimatedDuration').isFloat({ min: 0.5, max: 168 }).withMessage('Tahmini süre 0.5-168 saat arası olmalı'),
  body('estimatedCost').isFloat({ min: 0 }).withMessage('Tahmini maliyet pozitif olmalı'),
  body('laborCost').isFloat({ min: 0 }).withMessage('İşçilik maliyeti pozitif olmalı'),
  body('partsCost').isFloat({ min: 0 }).withMessage('Parça maliyeti pozitif olmalı'),
  body('scheduledDate').isISO8601().withMessage('Geçerli tarih formatı gerekli'),
  body('assignedTechnician').optional().isMongoId().withMessage('Geçerli teknisyen ID gerekli')
];

const updateWorkOrderValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Başlık 1-200 karakter arası olmalı'),
  body('description').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Açıklama 1-2000 karakter arası olmalı'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Geçerli öncelik seviyesi gerekli'),
  body('estimatedDuration').optional().isFloat({ min: 0.5, max: 168 }).withMessage('Tahmini süre 0.5-168 saat arası olmalı'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Tahmini maliyet pozitif olmalı'),
  body('laborCost').optional().isFloat({ min: 0 }).withMessage('İşçilik maliyeti pozitif olmalı'),
  body('partsCost').optional().isFloat({ min: 0 }).withMessage('Parça maliyeti pozitif olmalı'),
  body('scheduledDate').optional().isISO8601().withMessage('Geçerli tarih formatı gerekli'),
  body('assignedTechnician').optional().isMongoId().withMessage('Geçerli teknisyen ID gerekli')
];

const changeStatusValidation = [
  body('status').isIn(['pending', 'in-progress', 'completed', 'cancelled', 'on-hold', 'waiting-parts', 'waiting-approval', 'quality-check']).withMessage('Geçerli durum gerekli'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Sebep 500 karakterden az olmalı'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notlar 1000 karakterden az olmalı')
];

const completeStepValidation = [
  body('stepNumber').isInt({ min: 1 }).withMessage('Geçerli adım numarası gerekli'),
  body('actualTime').optional().isFloat({ min: 0 }).withMessage('Gerçek süre pozitif olmalı'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notlar 1000 karakterden az olmalı')
];

// Routes
router.get('/', authenticateToken, getWorkOrders);
router.get('/stats', authenticateToken, getWorkOrderStats);
router.get('/:id', authenticateToken, getWorkOrder);
router.post('/', authenticateToken, createWorkOrderValidation, createWorkOrder);
router.put('/:id', authenticateToken, updateWorkOrderValidation, updateWorkOrder);
router.patch('/:id/status', authenticateToken, changeStatusValidation, changeWorkOrderStatus);
router.patch('/:id/complete-step', authenticateToken, completeStepValidation, completeWorkflowStep);
router.delete('/:id', authenticateToken, deleteWorkOrder);

export default router;
