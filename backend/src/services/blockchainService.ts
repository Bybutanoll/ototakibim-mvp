import crypto from 'crypto';
import { BlockchainRecord, IBlockchainRecord } from '../models/BlockchainRecord';

export interface BlockchainData {
  userId: string;
  vehicleId: string;
  workOrderId?: string;
  recordType: 'service_history' | 'maintenance' | 'repair' | 'inspection' | 'warranty';
  serviceData: {
    serviceDate: Date;
    serviceType: string;
    description: string;
    parts: Array<{
      partName: string;
      partNumber: string;
      quantity: number;
      cost: number;
    }>;
    laborHours: number;
    totalCost: number;
    technician: string;
    garage: string;
    mileage: number;
    nextServiceDate?: Date;
  };
}

export interface VerificationResult {
  isValid: boolean;
  message: string;
  details?: any;
}

export class BlockchainService {
  private static instance: BlockchainService;
  private currentBlockNumber: number = 1;

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  /**
   * Create a new blockchain record
   */
  async createRecord(data: BlockchainData): Promise<IBlockchainRecord> {
    try {
      // Get the latest block number
      const latestRecord = await BlockchainRecord.findOne().sort({ blockNumber: -1 });
      this.currentBlockNumber = latestRecord ? latestRecord.blockNumber + 1 : 1;

      // Generate transaction ID
      const transactionId = this.generateTransactionId();

      // Get previous hash
      const previousHash = latestRecord ? latestRecord.hash : '0000000000000000000000000000000000000000000000000000000000000000';

      // Create the record
      const record = new BlockchainRecord({
        userId: data.userId,
        vehicleId: data.vehicleId,
        workOrderId: data.workOrderId,
        recordType: data.recordType,
        data: data.serviceData,
        previousHash,
        blockNumber: this.currentBlockNumber,
        transactionId,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

      // Save the record (hash will be generated in pre-save middleware)
      await record.save();

      return record;
    } catch (error) {
      throw new Error(`Blockchain record creation failed: ${error}`);
    }
  }

  /**
   * Verify a blockchain record
   */
  async verifyRecord(recordId: string): Promise<VerificationResult> {
    try {
      const record = await BlockchainRecord.findById(recordId);
      if (!record) {
        return {
          isValid: false,
          message: 'Record not found'
        };
      }

      // Verify hash
      const dataString = JSON.stringify({
        userId: record.userId,
        vehicleId: record.vehicleId,
        recordType: record.recordType,
        data: record.data,
        timestamp: record.metadata.timestamp
      });
      const expectedHash = crypto.createHash('sha256').update(dataString).digest('hex');

      if (record.hash !== expectedHash) {
        return {
          isValid: false,
          message: 'Hash verification failed',
          details: {
            expected: expectedHash,
            actual: record.hash
          }
        };
      }

      // Verify chain integrity
      if (record.previousHash) {
        const previousRecord = await BlockchainRecord.findOne({ hash: record.previousHash });
        if (!previousRecord) {
          return {
            isValid: false,
            message: 'Previous hash not found in chain'
          };
        }
      }

      // Mark as verified
      record.isVerified = true;
      record.verificationDate = new Date();
      record.verifiedBy = 'system';
      await record.save();

      return {
        isValid: true,
        message: 'Record verified successfully'
      };
    } catch (error) {
      throw new Error(`Verification failed: ${error}`);
    }
  }

  /**
   * Get blockchain records for a vehicle
   */
  async getVehicleRecords(vehicleId: string, userId: string): Promise<IBlockchainRecord[]> {
    try {
      const records = await BlockchainRecord.find({
        vehicleId,
        userId
      })
      .sort({ blockNumber: -1 })
      .populate('workOrderId')
      .exec();

      return records;
    } catch (error) {
      throw new Error(`Failed to fetch vehicle records: ${error}`);
    }
  }

  /**
   * Get blockchain statistics
   */
  async getBlockchainStats(): Promise<any> {
    try {
      const totalRecords = await BlockchainRecord.countDocuments();
      const verifiedRecords = await BlockchainRecord.countDocuments({ isVerified: true });
      const pendingRecords = totalRecords - verifiedRecords;

      const latestBlock = await BlockchainRecord.findOne().sort({ blockNumber: -1 });
      const firstBlock = await BlockchainRecord.findOne().sort({ blockNumber: 1 });

      return {
        totalRecords,
        verifiedRecords,
        pendingRecords,
        verificationRate: totalRecords > 0 ? (verifiedRecords / totalRecords) * 100 : 0,
        latestBlockNumber: latestBlock?.blockNumber || 0,
        firstBlockDate: firstBlock?.createdAt,
        lastBlockDate: latestBlock?.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to get blockchain stats: ${error}`);
    }
  }

  /**
   * Search blockchain records
   */
  async searchRecords(query: {
    userId?: string;
    vehicleId?: string;
    recordType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    isVerified?: boolean;
  }): Promise<IBlockchainRecord[]> {
    try {
      const filter: any = {};

      if (query.userId) filter.userId = query.userId;
      if (query.vehicleId) filter.vehicleId = query.vehicleId;
      if (query.recordType) filter.recordType = query.recordType;
      if (query.isVerified !== undefined) filter.isVerified = query.isVerified;

      if (query.dateFrom || query.dateTo) {
        filter['data.serviceDate'] = {};
        if (query.dateFrom) filter['data.serviceDate'].$gte = query.dateFrom;
        if (query.dateTo) filter['data.serviceDate'].$lte = query.dateTo;
      }

      const records = await BlockchainRecord.find(filter)
        .sort({ blockNumber: -1 })
        .populate('workOrderId')
        .exec();

      return records;
    } catch (error) {
      throw new Error(`Search failed: ${error}`);
    }
  }

  /**
   * Generate demo blockchain data
   */
  async generateDemoData(userId: string, vehicleId: string): Promise<IBlockchainRecord[]> {
    try {
      const demoRecords = [
        {
          recordType: 'maintenance' as const,
          serviceData: {
            serviceDate: new Date('2024-01-15'),
            serviceType: 'Yağ Değişimi',
            description: 'Motor yağı ve filtre değişimi yapıldı',
            parts: [
              { partName: 'Motor Yağı', partNumber: 'OIL-5W30', quantity: 1, cost: 150 },
              { partName: 'Yağ Filtresi', partNumber: 'FILTER-OIL-001', quantity: 1, cost: 25 }
            ],
            laborHours: 1,
            totalCost: 200,
            technician: 'Ahmet Yılmaz',
            garage: 'OtoTakibim Servis',
            mileage: 50000,
            nextServiceDate: new Date('2024-07-15')
          }
        },
        {
          recordType: 'repair' as const,
          serviceData: {
            serviceDate: new Date('2024-02-20'),
            serviceType: 'Fren Sistemi Tamiri',
            description: 'Fren balataları ve diskleri değiştirildi',
            parts: [
              { partName: 'Fren Balatası', partNumber: 'BRAKE-PAD-FRONT', quantity: 2, cost: 120 },
              { partName: 'Fren Diski', partNumber: 'BRAKE-DISC-FRONT', quantity: 2, cost: 200 }
            ],
            laborHours: 3,
            totalCost: 560,
            technician: 'Mehmet Demir',
            garage: 'OtoTakibim Servis',
            mileage: 52000
          }
        },
        {
          recordType: 'inspection' as const,
          serviceData: {
            serviceDate: new Date('2024-03-10'),
            serviceType: 'Genel Muayene',
            description: 'Yıllık genel muayene ve kontrol',
            parts: [],
            laborHours: 0.5,
            totalCost: 50,
            technician: 'Ali Kaya',
            garage: 'OtoTakibim Servis',
            mileage: 54000,
            nextServiceDate: new Date('2025-03-10')
          }
        }
      ];

      const createdRecords: IBlockchainRecord[] = [];

      for (const demoRecord of demoRecords) {
        const record = await this.createRecord({
          userId,
          vehicleId,
          recordType: demoRecord.recordType,
          serviceData: demoRecord.serviceData
        });
        createdRecords.push(record);
      }

      return createdRecords;
    } catch (error) {
      throw new Error(`Demo data generation failed: ${error}`);
    }
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `tx_${timestamp}_${random}`;
  }
}
