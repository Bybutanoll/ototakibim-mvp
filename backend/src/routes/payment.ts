import express from 'express';
import { getPayments, getPayment, createPayment, addPayment, deletePayment, getPaymentStats } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Plans endpoint (public)
router.get('/plans', getPaymentStats);

// All other payment routes require authentication
router.use(authenticateToken);

// Payment Methods
router.post('/methods', createPayment);
router.get('/methods', getPayments);
router.put('/methods/:id', createPayment);
router.delete('/methods/:id', deletePayment);
router.post('/methods/:id/default', createPayment);

// Subscriptions
router.post('/subscriptions', createPayment);
router.get('/subscriptions', getPayments);
router.put('/subscriptions/:id', createPayment);
router.delete('/subscriptions/:id', deletePayment);

// Invoices
router.get('/invoices', getPayments);

// Payment Intents
router.post('/intents', createPayment);
router.post('/confirm', addPayment);

export default router;
