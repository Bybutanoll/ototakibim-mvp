import express from 'express';
import { obdController } from '../controllers/obdController';

const router = express.Router();

// Get all OBD devices for a user
router.get('/devices/:userId', obdController.getUserDevices);

// Get a specific OBD device
router.get('/devices/:deviceId', obdController.getDevice);

// Create a new OBD device
router.post('/devices', obdController.createDevice);

// Update OBD device
router.put('/devices/:deviceId', obdController.updateDevice);

// Delete OBD device
router.delete('/devices/:deviceId', obdController.deleteDevice);

// Connect to OBD device
router.post('/devices/:deviceId/connect', obdController.connectDevice);

// Disconnect from OBD device
router.post('/devices/:deviceId/disconnect', obdController.disconnectDevice);

// Get real-time OBD data
router.get('/devices/:deviceId/data', obdController.getRealTimeData);

// Get detailed OBD data
router.get('/devices/:deviceId/data/detailed', obdController.getDetailedData);

// Get OBD system readiness
router.get('/devices/:deviceId/readiness', obdController.getSystemReadiness);

// Generate demo OBD data
router.post('/demo', obdController.generateDemoData);

export default router;
