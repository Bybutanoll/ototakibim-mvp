import express from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser, updateProfile, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('firstName').trim().isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalıdır'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalıdır'),
  body('email').isEmail().normalizeEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Geçerli bir telefon numarası giriniz'),
  body('password').isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalıdır'),
  body('role').optional().isIn(['admin', 'manager', 'technician']).withMessage('Geçerli bir rol seçiniz')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('password').notEmpty().withMessage('Şifre gereklidir')
];

const updateProfileValidation = [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalıdır'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalıdır'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Geçerli bir telefon numarası giriniz')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Mevcut şifre gereklidir'),
  body('newPassword').isLength({ min: 8 }).withMessage('Yeni şifre en az 8 karakter olmalıdır')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);

export default router;
