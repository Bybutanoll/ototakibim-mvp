import express from 'express';
import { 
  register, 
  login, 
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser, 
  updateProfile, 
  completeOnboarding, 
  getOnboardingStatus 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware - Geçici olarak devre dışı
// const registerValidation = [
//   body('firstName').trim().isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalıdır'),
//   body('lastName').trim().isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalıdır'),
//   body('email').isEmail().normalizeEmail().withMessage('Geçerli bir email adresi giriniz'),
//   body('phone').optional().trim().isLength({ min: 10 }).withMessage('Geçerli bir telefon numarası giriniz'),
//   body('password').isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalıdır'),
//   body('role').optional().isIn(['admin', 'manager', 'technician']).withMessage('Geçerli bir rol seçiniz')
// ];

// const loginValidation = [
//   body('email').isEmail().normalizeEmail().withMessage('Geçerli bir email adresi giriniz'),
//   body('password').notEmpty().withMessage('Şifre gereklidir')
// ];

// const updateProfileValidation = [
//   body('firstName').optional().trim().isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalıdır'),
//   body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalıdır'),
//   body('phone').optional().trim().isLength({ min: 10 }).withMessage('Geçerli bir telefon numarası giriniz')
// ];

// const changePasswordValidation = [
//   body('currentPassword').notEmpty().withMessage('Mevcut şifre gereklidir'),
//   body('newPassword').isLength({ min: 8 }).withMessage('Yeni şifre en az 8 karakter olmalıdır')
// ];

// const forgotPasswordValidation = [
//   body('email').isEmail().normalizeEmail().withMessage('Geçerli bir email adresi giriniz')
// ];

// const resetPasswordValidation = [
//   body('token').notEmpty().withMessage('Token gereklidir'),
//   body('password').isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalıdır')
// ];

// const refreshTokenValidation = [
//   body('refreshToken').notEmpty().withMessage('Refresh token gereklidir')
// ];

// Routes - Geçici olarak validation middleware'leri kaldırıldı
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.get('/onboarding', authenticateToken, getOnboardingStatus);
router.post('/onboarding', authenticateToken, completeOnboarding);

// CORS preflight için OPTIONS method'ları
router.options('/register', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

router.options('/login', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

export default router;
