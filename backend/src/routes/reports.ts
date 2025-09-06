import express from 'express';
import { body } from 'express-validator';
import {
  getReports,
  getReport,
  generateReport,
  deleteReport,
  getReportStats
} from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const generateReportValidation = [
  body('reportType').isIn(['revenue', 'customer', 'vehicle', 'work_order', 'inventory', 'appointment', 'payment', 'custom']).withMessage('Geçerli rapor türü gerekli'),
  body('reportName').trim().isLength({ min: 1, max: 200 }).withMessage('Rapor adı 1-200 karakter arası olmalı'),
  body('reportDescription').optional().trim().isLength({ max: 1000 }).withMessage('Rapor açıklaması 1000 karakterden az olmalı'),
  body('startDate').isISO8601().withMessage('Geçerli başlangıç tarihi gerekli'),
  body('endDate').isISO8601().withMessage('Geçerli bitiş tarihi gerekli'),
  body('period').isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']).withMessage('Geçerli dönem gerekli'),
  body('chartConfig.type').optional().isIn(['line', 'bar', 'pie', 'doughnut', 'area', 'scatter']).withMessage('Geçerli grafik türü gerekli')
];

// Routes
router.get('/', authenticateToken, getReports);
router.get('/stats', authenticateToken, getReportStats);
router.get('/:id', authenticateToken, getReport);
router.post('/generate', authenticateToken, generateReportValidation, generateReport);
router.delete('/:id', authenticateToken, deleteReport);

export default router;