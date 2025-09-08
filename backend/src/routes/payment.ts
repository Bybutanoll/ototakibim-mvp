import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';
import { requireActiveSubscription } from '../middleware/subscription';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Customer Management
router.post('/customer',
  authenticateToken,
  [
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('name').notEmpty().withMessage('İsim gereklidir'),
    validateRequest
  ],
  paymentController.createCustomer
);

router.get('/customer',
  authenticateToken,
  paymentController.getCustomer
);

// Products and Prices
router.get('/products',
  authenticateToken,
  paymentController.getProducts
);

router.get('/prices',
  authenticateToken,
  paymentController.getPrices
);

// Subscription Management
router.post('/subscription',
  authenticateToken,
  [
    body('priceId').notEmpty().withMessage('Fiyat ID gereklidir'),
    body('trialPeriodDays').optional().isInt({ min: 0, max: 365 }).withMessage('Deneme süresi 0-365 gün arasında olmalıdır'),
    validateRequest
  ],
  paymentController.createSubscription
);

router.get('/subscription',
  authenticateToken,
  paymentController.getSubscription
);

router.put('/subscription',
  authenticateToken,
  [
    body('priceId').optional().notEmpty().withMessage('Fiyat ID gereklidir'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Miktar 1 veya daha büyük olmalıdır'),
    body('prorationBehavior').optional().isIn(['create_prorations', 'none', 'always_invoice']).withMessage('Geçersiz proration davranışı'),
    validateRequest
  ],
  paymentController.updateSubscription
);

router.delete('/subscription',
  authenticateToken,
  [
    body('immediately').optional().isBoolean().withMessage('Immediately boolean olmalıdır'),
    validateRequest
  ],
  paymentController.cancelSubscription
);

// Payment Methods
router.get('/payment-methods',
  authenticateToken,
  paymentController.getPaymentMethods
);

router.post('/setup-intent',
  authenticateToken,
  paymentController.createSetupIntent
);

// Webhooks
router.post('/webhook',
  paymentController.handleWebhook
);

export default router;