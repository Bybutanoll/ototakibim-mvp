import express from 'express';
import { body } from 'express-validator';
import appointmentController from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All appointment routes require authentication
router.use(authenticateToken);

// Validation middleware
const appointmentValidation = [
  body('customerId')
    .notEmpty()
    .withMessage('Müşteri seçimi gereklidir'),
  body('vehicleId')
    .notEmpty()
    .withMessage('Araç seçimi gereklidir'),
  body('service')
    .notEmpty()
    .withMessage('Servis türü gereklidir'),
  body('date')
    .isISO8601()
    .withMessage('Geçerli bir tarih giriniz'),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Geçerli bir saat giriniz (HH:MM formatında)')
];

// Appointment Routes
router.get('/', appointmentController.getAppointments);
router.post('/', appointmentValidation, appointmentController.createAppointment);
router.put('/:id', appointmentValidation, appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

export default router;
