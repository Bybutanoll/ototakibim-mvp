import { Request, Response } from 'express';
import { ARVRService } from '../services/arvrService';

const arvrService = ARVRService.getInstance();

export const arvrController = {
  /**
   * Create a new AR/VR experience
   */
  async createExperience(req: Request, res: Response) {
    try {
      const { userId, vehicleId, workOrderId, experienceType, title, description, content, settings } = req.body;

      if (!userId || !vehicleId || !experienceType || !title || !description || !content) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const experience = await arvrService.createExperience({
        userId,
        vehicleId,
        workOrderId,
        experienceType,
        title,
        description,
        content,
        settings
      });

      res.status(201).json({
        success: true,
        message: 'AR/VR experience created successfully',
        data: experience
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create AR/VR experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get AR/VR experiences for a user
   */
  async getUserExperiences(req: Request, res: Response) {
    try {
      const { userId, vehicleId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const experiences = await arvrService.getUserExperiences(userId, vehicleId);

      res.status(200).json({
        success: true,
        message: 'User experiences retrieved successfully',
        data: experiences
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user experiences',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get a specific AR/VR experience
   */
  async getExperience(req: Request, res: Response) {
    try {
      const { experienceId } = req.params;

      if (!experienceId) {
        return res.status(400).json({
          success: false,
          message: 'Experience ID is required'
        });
      }

      const experience = await arvrService.getExperience(experienceId);

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Experience retrieved successfully',
        data: experience
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Update AR/VR experience
   */
  async updateExperience(req: Request, res: Response) {
    try {
      const { experienceId } = req.params;
      const updateData = req.body;

      if (!experienceId) {
        return res.status(400).json({
          success: false,
          message: 'Experience ID is required'
        });
      }

      const experience = await arvrService.updateExperience(experienceId, updateData);

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Experience updated successfully',
        data: experience
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Track user interaction
   */
  async trackInteraction(req: Request, res: Response) {
    try {
      const { experienceId, userId, action, duration, success, metadata } = req.body;

      if (!experienceId || !userId || !action) {
        return res.status(400).json({
          success: false,
          message: 'Experience ID, User ID, and Action are required'
        });
      }

      await arvrService.trackInteraction({
        experienceId,
        userId,
        action,
        duration: duration || 0,
        success: success !== undefined ? success : true,
        metadata
      });

      res.status(200).json({
        success: true,
        message: 'Interaction tracked successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to track interaction',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Add user rating
   */
  async addRating(req: Request, res: Response) {
    try {
      const { experienceId, userId, rating, feedback } = req.body;

      if (!experienceId || !userId || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Experience ID, User ID, and Rating are required'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      await arvrService.addRating({
        experienceId,
        userId,
        rating,
        feedback: feedback || ''
      });

      res.status(200).json({
        success: true,
        message: 'Rating added successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add rating',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Mark experience as completed
   */
  async markCompleted(req: Request, res: Response) {
    try {
      const { experienceId } = req.params;

      if (!experienceId) {
        return res.status(400).json({
          success: false,
          message: 'Experience ID is required'
        });
      }

      await arvrService.markCompleted(experienceId);

      res.status(200).json({
        success: true,
        message: 'Experience marked as completed'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark experience as completed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get AR/VR analytics
   */
  async getAnalytics(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      const analytics = await arvrService.getAnalytics(userId as string);

      res.status(200).json({
        success: true,
        message: 'Analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Generate demo AR/VR experiences
   */
  async generateDemoExperiences(req: Request, res: Response) {
    try {
      const { userId, vehicleId } = req.body;

      if (!userId || !vehicleId) {
        return res.status(400).json({
          success: false,
          message: 'User ID and Vehicle ID are required'
        });
      }

      const experiences = await arvrService.generateDemoExperiences(userId, vehicleId);

      res.status(201).json({
        success: true,
        message: 'Demo AR/VR experiences generated successfully',
        data: experiences
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate demo experiences',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Search AR/VR experiences
   */
  async searchExperiences(req: Request, res: Response) {
    try {
      const {
        userId,
        vehicleId,
        experienceType,
        difficulty,
        status
      } = req.query;

      const query: any = {};
      if (userId) query.userId = userId as string;
      if (vehicleId) query.vehicleId = vehicleId as string;
      if (experienceType) query.experienceType = experienceType as string;
      if (difficulty) query.difficulty = difficulty as string;
      if (status) query.status = status as string;

      const experiences = await arvrService.searchExperiences(query);

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: experiences
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Delete AR/VR experience
   */
  async deleteExperience(req: Request, res: Response) {
    try {
      const { experienceId } = req.params;

      if (!experienceId) {
        return res.status(400).json({
          success: false,
          message: 'Experience ID is required'
        });
      }

      const { ARVRExperience } = require('../models/ARVRExperience');
      const experience = await ARVRExperience.findByIdAndUpdate(
        experienceId,
        { isActive: false },
        { new: true }
      );

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Experience deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};
