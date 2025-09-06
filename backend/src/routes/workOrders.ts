import express from 'express';
import { body } from 'express-validator';
import { 
  createWorkOrder, 
  getWorkOrders, 
  getWorkOrder, 
  updateWorkOrder, 
  deleteWorkOrder 
} from '../controllers/workOrderController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const createWorkOrderValidation = [
  body('customerName').trim().isLength({ min: 2 }).withMessage('Müşteri adı en az 2 karakter olmalıdır'),
  body('customerPhone').trim().isLength({ min: 10 }).withMessage('Geçerli bir telefon numarası giriniz'),
  body('customerEmail').optional().isEmail().normalizeEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('vehicleBrand').trim().isLength({ min: 2 }).withMessage('Araç markası en az 2 karakter olmalıdır'),
  body('vehicleModel').trim().isLength({ min: 2 }).withMessage('Araç modeli en az 2 karakter olmalıdır'),
  body('vehiclePlate').trim().isLength({ min: 5 }).withMessage('Geçerli bir plaka giriniz'),
  body('vehicleVin').optional().isLength({ min: 17, max: 17 }).withMessage('VIN kodu 17 karakter olmalıdır'),
  body('problemDescription').trim().isLength({ min: 10 }).withMessage('Problem açıklaması en az 10 karakter olmalıdır'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Geçerli bir maliyet giriniz'),
  body('priority').isIn(['low', 'normal', 'high', 'urgent']).withMessage('Geçerli bir öncelik seçiniz'),
  body('estimatedDuration').optional().isFloat({ min: 0.5 }).withMessage('Geçerli bir süre giriniz')
];

const updateWorkOrderValidation = [
  body('problemDescription').optional().trim().isLength({ min: 10 }).withMessage('Problem açıklaması en az 10 karakter olmalıdır'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Geçerli bir maliyet giriniz'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Geçerli bir öncelik seçiniz'),
  body('estimatedDuration').optional().isFloat({ min: 0.5 }).withMessage('Geçerli bir süre giriniz'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Geçerli bir durum seçiniz')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Geçerli bir durum seçiniz'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notlar 500 karakterden uzun olamaz')
];

// Routes
router.post('/', authenticateToken, createWorkOrderValidation, createWorkOrder);
router.get('/', authenticateToken, getWorkOrders);
router.get('/:id', authenticateToken, getWorkOrder);
router.put('/:id', authenticateToken, updateWorkOrderValidation, updateWorkOrder);
router.delete('/:id', authenticateToken, deleteWorkOrder);
router.patch('/:id/status', authenticateToken, updateStatusValidation, updateWorkOrder);

export default router;
