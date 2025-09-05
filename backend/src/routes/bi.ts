import express from 'express';
import { authenticateToken } from '../middleware/auth';
import biController from '../controllers/biController';

const router = express.Router();

// All BI routes require authentication
router.use(authenticateToken);

// Business Intelligence Routes
router.get('/dashboard', biController.getDashboardAnalytics);
router.get('/revenue', biController.getRevenueAnalytics);
router.get('/customers', biController.getCustomerAnalytics);
router.get('/inventory', biController.getInventoryAnalytics);
router.get('/performance', biController.getPerformanceMetrics);

export default router;
