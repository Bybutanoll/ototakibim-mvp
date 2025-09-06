import express from 'express';
import { body } from 'express-validator';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  confirmAppointment,
  cancelAppointment,
  deleteAppointment,
  getAppointmentStats
} from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const createAppointmentValidation = [
  body('customer').isMongoId().withMessage('Geçerli müşteri ID gerekli'),
  body('vehicle').isMongoId().withMessage('Geçerli araç ID gerekli'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Başlık 1-200 karakter arası olmalı'),
  body('type').isIn(['maintenance', 'repair', 'inspection', 'diagnostic', 'consultation', 'pickup', 'delivery']).withMessage('Geçerli randevu tipi gerekli'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Geçerli öncelik seviyesi gerekli'),
  body('scheduledDate').isISO8601().withMessage('Geçerli tarih formatı gerekli'),
  body('startTime').isISO8601().withMessage('Geçerli başlangıç saati gerekli'),
  body('endTime').isISO8601().withMessage('Geçerli bitiş saati gerekli'),
  body('estimatedDuration').isInt({ min: 15, max: 480 }).withMessage('Tahmini süre 15-480 dakika arası olmalı'),
  body('assignedTechnician').optional().isMongoId().withMessage('Geçerli teknisyen ID gerekli')
];

const updateAppointmentValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Başlık 1-200 karakter arası olmalı'),
  body('type').optional().isIn(['maintenance', 'repair', 'inspection', 'diagnostic', 'consultation', 'pickup', 'delivery']).withMessage('Geçerli randevu tipi gerekli'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Geçerli öncelik seviyesi gerekli'),
  body('scheduledDate').optional().isISO8601().withMessage('Geçerli tarih formatı gerekli'),
  body('startTime').optional().isISO8601().withMessage('Geçerli başlangıç saati gerekli'),
  body('endTime').optional().isISO8601().withMessage('Geçerli bitiş saati gerekli'),
  body('estimatedDuration').optional().isInt({ min: 15, max: 480 }).withMessage('Tahmini süre 15-480 dakika arası olmalı'),
  body('assignedTechnician').optional().isMongoId().withMessage('Geçerli teknisyen ID gerekli')
];

const confirmAppointmentValidation = [
  body('method').isIn(['phone', 'email', 'sms', 'in-person']).withMessage('Geçerli onay yöntemi gerekli'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notlar 500 karakterden az olmalı')
];

const cancelAppointmentValidation = [
  body('reason').trim().isLength({ min: 1, max: 500 }).withMessage('İptal sebebi 1-500 karakter arası olmalı'),
  body('refundAmount').optional().isFloat({ min: 0 }).withMessage('İade tutarı pozitif olmalı')
];

// Routes
router.get('/', authenticateToken, getAppointments);
router.get('/stats', authenticateToken, getAppointmentStats);
router.get('/:id', authenticateToken, getAppointment);
router.post('/', authenticateToken, createAppointmentValidation, createAppointment);
router.put('/:id', authenticateToken, updateAppointmentValidation, updateAppointment);
router.patch('/:id/confirm', authenticateToken, confirmAppointmentValidation, confirmAppointment);
router.patch('/:id/cancel', authenticateToken, cancelAppointmentValidation, cancelAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);

export default router;