import express from 'express';
import { blockchainController } from '../controllers/blockchainController';

const router = express.Router();

// Create a new blockchain record
router.post('/records', blockchainController.createRecord);

// Get a specific blockchain record
router.get('/records/:recordId', blockchainController.getRecord);

// Verify a blockchain record
router.post('/records/:recordId/verify', blockchainController.verifyRecord);

// Get blockchain records for a vehicle
router.get('/vehicles/:vehicleId/users/:userId/records', blockchainController.getVehicleRecords);

// Get blockchain statistics
router.get('/stats', blockchainController.getBlockchainStats);

// Search blockchain records
router.get('/search', blockchainController.searchRecords);

// Generate demo blockchain data
router.post('/demo', blockchainController.generateDemoData);

// Get blockchain chain integrity
router.get('/integrity', blockchainController.getChainIntegrity);

export default router;
