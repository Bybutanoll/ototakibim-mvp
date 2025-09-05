import express from 'express';
import { body } from 'express-validator';
import { customerController } from '../controllers/customerController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All customer routes require authentication
router.use(authenticateToken);

// Validation middleware
const customerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalıdır'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalıdır'),
  body('phone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Telefon numarası 10-15 karakter arasında olmalıdır')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Geçerli bir telefon numarası giriniz'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz'),
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Sokak adı en fazla 100 karakter olabilir'),
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Şehir adı en fazla 50 karakter olabilir'),
  body('address.district')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('İlçe adı en fazla 50 karakter olabilir'),
  body('address.postalCode')
    .optional()
    .matches(/^[0-9]{5}$/)
    .withMessage('Geçerli bir posta kodu giriniz (5 haneli)'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir doğum tarihi giriniz'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Cinsiyet male, female veya other olmalıdır'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notlar en fazla 500 karakter olabilir')
];

// Customer Routes
router.get('/', customerController.getCustomers);
router.get('/search', customerController.searchCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerValidation, customerController.createCustomer);
router.put('/:id', customerValidation, customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
