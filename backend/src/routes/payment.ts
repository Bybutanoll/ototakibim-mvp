import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Plans endpoint (public)
router.get('/plans', paymentController.getPlans);

// All other payment routes require authentication
router.use(authenticateToken);

// Payment Methods
router.post('/methods', paymentController.createPaymentMethod);
router.get('/methods', paymentController.getPaymentMethods);
router.put('/methods/:id', paymentController.updatePaymentMethod);
router.delete('/methods/:id', paymentController.deletePaymentMethod);
router.post('/methods/:id/default', paymentController.setDefaultPaymentMethod);

// Subscriptions
router.post('/subscriptions', paymentController.createSubscription);
router.get('/subscriptions', paymentController.getSubscriptions);
router.put('/subscriptions/:id', paymentController.updateSubscription);
router.delete('/subscriptions/:id', paymentController.cancelSubscription);

// Invoices
router.get('/invoices', paymentController.getInvoices);

// Payment Intents
router.post('/intents', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);

export default router;
