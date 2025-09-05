import express from 'express';
import { body } from 'express-validator';
import { aiController } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All AI routes require authentication
router.use(authenticateToken);

// Validation middleware
const diagnosticValidation = [
  body('symptoms')
    .isArray({ min: 1 })
    .withMessage('En az bir şikayet belirtmelisiniz'),
  body('symptoms.*')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Her şikayet 3-100 karakter arasında olmalıdır')
];

const costEstimationValidation = [
  body('serviceType')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Hizmet türü 2-50 karakter arasında olmalıdır')
];

// AI Routes
router.get('/predictions/:vehicleId', aiController.getMaintenancePredictions);
router.post('/cost-estimation/:vehicleId', costEstimationValidation, aiController.estimateMaintenanceCost);
router.post('/diagnostic/:vehicleId', diagnosticValidation, aiController.getDiagnosticSuggestions);
router.get('/dashboard-insights', aiController.getDashboardInsights);
router.get('/maintenance-schedule', aiController.getMaintenanceSchedule);

export default router;
