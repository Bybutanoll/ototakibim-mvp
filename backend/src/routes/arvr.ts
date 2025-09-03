import express from 'express';
import { arvrController } from '../controllers/arvrController';

const router = express.Router();

// Create a new AR/VR experience
router.post('/experiences', arvrController.createExperience);

// Get AR/VR experiences for a user
router.get('/users/:userId/experiences', arvrController.getUserExperiences);

// Get a specific AR/VR experience
router.get('/experiences/:experienceId', arvrController.getExperience);

// Update AR/VR experience
router.put('/experiences/:experienceId', arvrController.updateExperience);

// Delete AR/VR experience
router.delete('/experiences/:experienceId', arvrController.deleteExperience);

// Track user interaction
router.post('/interactions', arvrController.trackInteraction);

// Add user rating
router.post('/ratings', arvrController.addRating);

// Mark experience as completed
router.post('/experiences/:experienceId/complete', arvrController.markCompleted);

// Get AR/VR analytics
router.get('/analytics', arvrController.getAnalytics);

// Generate demo AR/VR experiences
router.post('/demo', arvrController.generateDemoExperiences);

// Search AR/VR experiences
router.get('/search', arvrController.searchExperiences);

export default router;
