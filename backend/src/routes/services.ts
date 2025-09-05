import express from 'express';
import serviceController from '../controllers/serviceController';

const router = express.Router();

// Services Routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getService);

export default router;
