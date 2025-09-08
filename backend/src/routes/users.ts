import express from 'express';
import { body, param } from 'express-validator';
import { 
  createUser, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser,
  updateUserRole
} from '../controllers/userController';
import { authenticateToken, requireTenantRole } from '../middleware/auth';
import { 
  checkUsageLimit, 
  requireActiveSubscription, 
  trackApiUsage 
} from '../middleware/subscription';
import { 
  requirePermission, 
  requireAnyPermission, 
  checkResourceOwnership 
} from '../middleware/permissions';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation middleware
const createUserValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  body('firstName').trim().isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalıdır'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalıdır'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Geçerli bir telefon numarası giriniz'),
  body('tenantRole').isIn(['owner', 'manager', 'technician']).withMessage('Geçerli bir rol seçiniz')
];

const updateUserValidation = [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalıdır'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalıdır'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Geçerli bir telefon numarası giriniz'),
  body('isActive').optional().isBoolean().withMessage('Aktif durumu boolean olmalıdır')
];

const updateRoleValidation = [
  body('tenantRole').isIn(['owner', 'manager', 'technician']).withMessage('Geçerli bir rol seçiniz')
];

// Routes
// Create user (owner/manager only)
router.post('/', 
  authenticateToken, 
  requireActiveSubscription, 
  checkUsageLimit('users'),
  requirePermission('users', 'create'),
  createUserValidation,
  validateRequest,
  createUser
);

// Get all users in tenant
router.get('/', 
  authenticateToken, 
  requireActiveSubscription, 
  trackApiUsage, 
  requirePermission('users', 'read'),
  getUsers
);

// Get specific user
router.get('/:id', 
  authenticateToken, 
  requireActiveSubscription, 
  trackApiUsage, 
  requirePermission('users', 'read'),
  param('id').isMongoId().withMessage('Geçerli bir kullanıcı ID\'si giriniz'),
  validateRequest,
  getUser
);

// Update user (owner/manager only, or user updating themselves)
router.put('/:id', 
  authenticateToken, 
  requireActiveSubscription, 
  trackApiUsage,
  requirePermission('users', 'update'),
  param('id').isMongoId().withMessage('Geçerli bir kullanıcı ID\'si giriniz'),
  updateUserValidation,
  validateRequest,
  updateUser
);

// Update user role (owner only)
router.patch('/:id/role', 
  authenticateToken, 
  requireActiveSubscription, 
  trackApiUsage,
  requirePermission('users', 'manage_roles'),
  param('id').isMongoId().withMessage('Geçerli bir kullanıcı ID\'si giriniz'),
  updateRoleValidation,
  validateRequest,
  updateUserRole
);

// Delete user (owner only)
router.delete('/:id', 
  authenticateToken, 
  requireActiveSubscription, 
  trackApiUsage,
  requirePermission('users', 'delete'),
  param('id').isMongoId().withMessage('Geçerli bir kullanıcı ID\'si giriniz'),
  validateRequest,
  deleteUser
);

export default router;
