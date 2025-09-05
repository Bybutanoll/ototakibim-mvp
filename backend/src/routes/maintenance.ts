import express from 'express';
import { body } from 'express-validator';
import maintenanceController from '../controllers/maintenanceController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All maintenance routes require authentication
router.use(authenticateToken);

// Validation middleware
const maintenanceValidation = [
  body('date')
    .isISO8601()
    .withMessage('Geçerli bir tarih giriniz'),
  body('type')
    .isIn(['service', 'repair', 'inspection'])
    .withMessage('Geçerli bir bakım tipi seçiniz'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Açıklama 10-500 karakter arasında olmalıdır'),
  body('cost')
    .isFloat({ min: 0 })
    .withMessage('Maliyet 0\'dan büyük olmalıdır'),
  body('mileage')
    .isInt({ min: 0 })
    .withMessage('Kilometre 0\'dan büyük olmalıdır'),
  body('workshop')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Servis adı en fazla 100 karakter olabilir'),
  body('nextServiceDate')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir sonraki bakım tarihi giriniz'),
  body('nextServiceMileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sonraki bakım kilometresi 0\'dan büyük olmalıdır')
];

// Maintenance Routes
router.get('/vehicles/:vehicleId/maintenance', maintenanceController.getMaintenanceRecords);
router.get('/vehicles/:vehicleId/maintenance/:id', maintenanceController.getMaintenanceRecord);
router.post('/vehicles/:vehicleId/maintenance', maintenanceValidation, maintenanceController.createMaintenanceRecord);
router.put('/vehicles/:vehicleId/maintenance/:id', maintenanceValidation, maintenanceController.updateMaintenanceRecord);
router.delete('/vehicles/:vehicleId/maintenance/:id', maintenanceController.deleteMaintenanceRecord);

export default router;
