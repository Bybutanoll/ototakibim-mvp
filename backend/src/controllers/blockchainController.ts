import { Request, Response } from 'express';
import { BlockchainService } from '../services/blockchainService';

const blockchainService = BlockchainService.getInstance();

export const blockchainController = {
  /**
   * Create a new blockchain record
   */
  async createRecord(req: Request, res: Response) {
    try {
      const { userId, vehicleId, workOrderId, recordType, serviceData } = req.body;

      if (!userId || !vehicleId || !recordType || !serviceData) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const record = await blockchainService.createRecord({
        userId,
        vehicleId,
        workOrderId,
        recordType,
        serviceData
      });

      res.status(201).json({
        success: true,
        message: 'Blockchain record created successfully',
        data: record
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create blockchain record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Verify a blockchain record
   */
  async verifyRecord(req: Request, res: Response) {
    try {
      const { recordId } = req.params;

      if (!recordId) {
        return res.status(400).json({
          success: false,
          message: 'Record ID is required'
        });
      }

      const result = await blockchainService.verifyRecord(recordId);

      res.status(200).json({
        success: true,
        message: 'Verification completed',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Verification failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get blockchain records for a vehicle
   */
  async getVehicleRecords(req: Request, res: Response) {
    try {
      const { vehicleId, userId } = req.params;

      if (!vehicleId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle ID and User ID are required'
        });
      }

      const records = await blockchainService.getVehicleRecords(vehicleId, userId);

      res.status(200).json({
        success: true,
        message: 'Vehicle records retrieved successfully',
        data: records
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve vehicle records',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get blockchain statistics
   */
  async getBlockchainStats(req: Request, res: Response) {
    try {
      const stats = await blockchainService.getBlockchainStats();

      res.status(200).json({
        success: true,
        message: 'Blockchain statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve blockchain statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Search blockchain records
   */
  async searchRecords(req: Request, res: Response) {
    try {
      const {
        userId,
        vehicleId,
        recordType,
        dateFrom,
        dateTo,
        isVerified
      } = req.query;

      const query: any = {};
      if (userId) query.userId = userId as string;
      if (vehicleId) query.vehicleId = vehicleId as string;
      if (recordType) query.recordType = recordType as string;
      if (dateFrom) query.dateFrom = new Date(dateFrom as string);
      if (dateTo) query.dateTo = new Date(dateTo as string);
      if (isVerified !== undefined) query.isVerified = isVerified === 'true';

      const records = await blockchainService.searchRecords(query);

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: records
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
   * Generate demo blockchain data
   */
  async generateDemoData(req: Request, res: Response) {
    try {
      const { userId, vehicleId } = req.body;

      if (!userId || !vehicleId) {
        return res.status(400).json({
          success: false,
          message: 'User ID and Vehicle ID are required'
        });
      }

      const records = await blockchainService.generateDemoData(userId, vehicleId);

      res.status(201).json({
        success: true,
        message: 'Demo blockchain data generated successfully',
        data: records
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate demo data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get a specific blockchain record
   */
  async getRecord(req: Request, res: Response) {
    try {
      const { recordId } = req.params;

      if (!recordId) {
        return res.status(400).json({
          success: false,
          message: 'Record ID is required'
        });
      }

      const { BlockchainRecord } = require('../models/BlockchainRecord');
      const record = await BlockchainRecord.findById(recordId).populate('workOrderId');

      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Record retrieved successfully',
        data: record
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get blockchain chain integrity
   */
  async getChainIntegrity(req: Request, res: Response) {
    try {
      const { BlockchainRecord } = require('../models/BlockchainRecord');
      
      const records = await BlockchainRecord.find()
        .sort({ blockNumber: 1 })
        .select('hash previousHash blockNumber transactionId');

      let integrityIssues = [];
      let isValid = true;

      for (let i = 1; i < records.length; i++) {
        const currentRecord = records[i];
        const previousRecord = records[i - 1];

        if (currentRecord.previousHash !== previousRecord.hash) {
          integrityIssues.push({
            blockNumber: currentRecord.blockNumber,
            issue: 'Previous hash mismatch',
            expected: previousRecord.hash,
            actual: currentRecord.previousHash
          });
          isValid = false;
        }
      }

      res.status(200).json({
        success: true,
        message: 'Chain integrity check completed',
        data: {
          totalBlocks: records.length,
          isValid,
          integrityIssues
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Chain integrity check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};
