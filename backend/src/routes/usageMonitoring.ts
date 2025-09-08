import express from 'express';
import { usageMonitoringController } from '../controllers/usageMonitoringController';
import { authenticateToken } from '../middleware/auth';
import { requireActiveSubscription } from '../middleware/subscription';
import { trackApiUsage } from '../middleware/rateLimiting';
import { query, param, body } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Get usage statistics
router.get('/stats',
  authenticateToken,
  requireActiveSubscription,
  trackApiUsage,
  [
    query('period').optional().isIn(['day', 'week', 'month', 'year']).withMessage('Geçersiz periyot'),
    validateRequest
  ],
  usageMonitoringController.getUsageStats
);

// Get usage alerts
router.get('/alerts',
  authenticateToken,
  requireActiveSubscription,
  trackApiUsage,
  usageMonitoringController.getUsageAlerts
);

// Generate usage report
router.get('/report',
  authenticateToken,
  requireActiveSubscription,
  trackApiUsage,
  [
    query('period').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Geçersiz periyot'),
    validateRequest
  ],
  usageMonitoringController.generateUsageReport
);

// Get usage dashboard
router.get('/dashboard',
  authenticateToken,
  requireActiveSubscription,
  trackApiUsage,
  usageMonitoringController.getUsageDashboard
);

// Reset usage counters (admin only)
router.post('/reset',
  authenticateToken,
  requireActiveSubscription,
  trackApiUsage,
  usageMonitoringController.resetUsageCounters
);

// Track API usage
router.post('/track',
  authenticateToken,
  requireActiveSubscription,
  [
    body('endpoint').notEmpty().withMessage('Endpoint gereklidir'),
    body('method').notEmpty().withMessage('HTTP method gereklidir'),
    body('userId').optional().isMongoId().withMessage('Geçersiz kullanıcı ID'),
    body('responseTime').optional().isNumeric().withMessage('Yanıt süresi sayısal olmalıdır'),
    body('statusCode').optional().isInt().withMessage('Status kodu tam sayı olmalıdır'),
    validateRequest
  ],
  usageMonitoringController.trackApiUsage
);

export default router;
