import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import WorkOrder from '../models/WorkOrder';
import Customer from '../models/Customer';
import Inventory from '../models/Inventory';
import User from '../models/User';

export const biController = {
  /**
   * Get comprehensive dashboard analytics
   */
  async getDashboardAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { period = '30d' } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Get basic counts
      const [
        totalVehicles,
        totalCustomers,
        totalWorkOrders,
        totalInventoryItems,
        recentWorkOrders,
        lowStockItems,
        upcomingMaintenance
      ] = await Promise.all([
        Vehicle.countDocuments({ user: userId, isActive: true }),
        Customer.countDocuments({ userId, isActive: true }),
        WorkOrder.countDocuments({ user: userId, isActive: true }),
        Inventory.countDocuments({ owner: userId, isActive: true }),
        WorkOrder.find({ 
          user: userId, 
          isActive: true,
          createdAt: { $gte: startDate }
        }).sort({ createdAt: -1 }).limit(10),
        Inventory.find({
          owner: userId,
          isActive: true,
          $expr: { $lte: ['$quantity', '$minQuantity'] }
        }).limit(5),
        Vehicle.find({
          user: userId,
          isActive: true,
          nextServiceDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        }).limit(5)
      ]);

      // Calculate revenue metrics
      const revenueData = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalCost' },
            averageOrderValue: { $avg: '$totalCost' },
            totalOrders: { $sum: 1 }
          }
        }
      ]);

      // Calculate monthly revenue trend
      const monthlyRevenue = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalCost' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      // Calculate vehicle age distribution
      const vehicleAgeDistribution = await Vehicle.aggregate([
        {
          $match: { user: userId, isActive: true }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: [{ $subtract: [new Date().getFullYear(), '$year'] }, 5] }, then: '0-5 years' },
                  { case: { $lt: [{ $subtract: [new Date().getFullYear(), '$year'] }, 10] }, then: '5-10 years' },
                  { case: { $lt: [{ $subtract: [new Date().getFullYear(), '$year'] }, 15] }, then: '10-15 years' },
                  { case: { $lt: [{ $subtract: [new Date().getFullYear(), '$year'] }, 20] }, then: '15-20 years' }
                ],
                default: '20+ years'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);

      // Calculate service type distribution
      const serviceTypeDistribution = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate }
          }
        },
        {
          $unwind: '$services'
        },
        {
          $group: {
            _id: '$services.type',
            count: { $sum: 1 },
            totalCost: { $sum: '$services.cost' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      // Calculate customer retention
      const customerRetention = await Customer.aggregate([
        {
          $match: { userId, isActive: true }
        },
        {
          $lookup: {
            from: 'workorders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $eq: [{ $size: '$orders' }, 1] }, then: '1 order' },
                  { case: { $eq: [{ $size: '$orders' }, 2] }, then: '2 orders' },
                  { case: { $eq: [{ $size: '$orders' }, 3] }, then: '3 orders' },
                  { case: { $lt: [{ $size: '$orders' }, 6] }, then: '4-5 orders' }
                ],
                default: '6+ orders'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);

      // Calculate inventory value
      const inventoryValue = await Inventory.aggregate([
        {
          $match: { owner: userId, isActive: true }
        },
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $multiply: ['$quantity', '$costPrice'] } },
            totalItems: { $sum: 1 },
            lowStockItems: {
              $sum: {
                $cond: [
                  { $lte: ['$quantity', '$minQuantity'] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);

      res.json({
        status: 'success',
        data: {
          overview: {
            totalVehicles,
            totalCustomers,
            totalWorkOrders,
            totalInventoryItems,
            totalRevenue: revenueData[0]?.totalRevenue || 0,
            averageOrderValue: revenueData[0]?.averageOrderValue || 0,
            totalOrders: revenueData[0]?.totalOrders || 0
          },
          trends: {
            monthlyRevenue,
            vehicleAgeDistribution,
            serviceTypeDistribution,
            customerRetention
          },
          inventory: {
            totalValue: inventoryValue[0]?.totalValue || 0,
            totalItems: inventoryValue[0]?.totalItems || 0,
            lowStockItems: inventoryValue[0]?.lowStockItems || 0
          },
          alerts: {
            recentWorkOrders,
            lowStockItems,
            upcomingMaintenance
          }
        }
      });
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Analitik veriler yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { period = '30d', groupBy = 'day' } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Revenue by time period
      const revenueByPeriod = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: groupBy === 'day' 
              ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
              : groupBy === 'week'
              ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
              : groupBy === 'month'
              ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
              : { $dateToString: { format: '%Y', date: '$createdAt' } },
            revenue: { $sum: '$totalCost' },
            orders: { $sum: 1 },
            averageOrderValue: { $avg: '$totalCost' }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      // Revenue by service type
      const revenueByService = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $unwind: '$services'
        },
        {
          $group: {
            _id: '$services.type',
            revenue: { $sum: '$services.cost' },
            count: { $sum: 1 },
            averageCost: { $avg: '$services.cost' }
          }
        },
        {
          $sort: { revenue: -1 }
        }
      ]);

      // Revenue by customer
      const revenueByCustomer = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customerData'
          }
        },
        {
          $unwind: '$customerData'
        },
        {
          $group: {
            _id: '$customer',
            customerName: { $first: { $concat: ['$customerData.firstName', ' ', '$customerData.lastName'] } },
            revenue: { $sum: '$totalCost' },
            orders: { $sum: 1 },
            averageOrderValue: { $avg: '$totalCost' }
          }
        },
        {
          $sort: { revenue: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Revenue by vehicle
      const revenueByVehicle = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $lookup: {
            from: 'vehicles',
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicleData'
          }
        },
        {
          $unwind: '$vehicleData'
        },
        {
          $group: {
            _id: '$vehicle',
            vehicleName: { $first: { $concat: ['$vehicleData.brand', ' ', '$vehicleData.model', ' (', '$vehicleData.plate', ')'] } },
            revenue: { $sum: '$totalCost' },
            orders: { $sum: 1 },
            averageOrderValue: { $avg: '$totalCost' }
          }
        },
        {
          $sort: { revenue: -1 }
        },
        {
          $limit: 10
        }
      ]);

      res.json({
        status: 'success',
        data: {
          revenueByPeriod,
          revenueByService,
          revenueByCustomer,
          revenueByVehicle
        }
      });
    } catch (error) {
      console.error('Revenue analytics error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Gelir analitikleri yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { period = '30d' } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Customer acquisition
      const customerAcquisition = await Customer.aggregate([
        {
          $match: {
            userId,
            isActive: true,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            newCustomers: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ]);

      // Customer lifetime value
      const customerLifetimeValue = await Customer.aggregate([
        {
          $match: { userId, isActive: true }
        },
        {
          $lookup: {
            from: 'workorders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $addFields: {
            totalSpent: { $sum: '$orders.totalCost' },
            orderCount: { $size: '$orders' },
            lastOrderDate: { $max: '$orders.createdAt' }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $eq: ['$orderCount', 0] }, then: 'No orders' },
                  { case: { $eq: ['$orderCount', 1] }, then: '1 order' },
                  { case: { $eq: ['$orderCount', 2] }, then: '2 orders' },
                  { case: { $eq: ['$orderCount', 3] }, then: '3 orders' },
                  { case: { $lt: ['$orderCount', 6] }, then: '4-5 orders' }
                ],
                default: '6+ orders'
              }
            },
            count: { $sum: 1 },
            averageSpent: { $avg: '$totalSpent' }
          }
        }
      ]);

      // Customer retention
      const customerRetention = await Customer.aggregate([
        {
          $match: { userId, isActive: true }
        },
        {
          $lookup: {
            from: 'workorders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $addFields: {
            orderCount: { $size: '$orders' },
            lastOrderDate: { $max: '$orders.createdAt' },
            daysSinceLastOrder: {
              $divide: [
                { $subtract: [new Date(), { $max: '$orders.createdAt' }] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $eq: ['$orderCount', 0] }, then: 'Never ordered' },
                  { case: { $lt: ['$daysSinceLastOrder', 30] }, then: 'Active (30 days)' },
                  { case: { $lt: ['$daysSinceLastOrder', 90] }, then: 'At risk (90 days)' },
                  { case: { $lt: ['$daysSinceLastOrder', 180] }, then: 'Inactive (180 days)' }
                ],
                default: 'Lost (180+ days)'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);

      // Top customers
      const topCustomers = await Customer.aggregate([
        {
          $match: { userId, isActive: true }
        },
        {
          $lookup: {
            from: 'workorders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $addFields: {
            totalSpent: { $sum: '$orders.totalCost' },
            orderCount: { $size: '$orders' },
            lastOrderDate: { $max: '$orders.createdAt' }
          }
        },
        {
          $sort: { totalSpent: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            totalSpent: 1,
            orderCount: 1,
            lastOrderDate: 1
          }
        }
      ]);

      res.json({
        status: 'success',
        data: {
          customerAcquisition,
          customerLifetimeValue,
          customerRetention,
          topCustomers
        }
      });
    } catch (error) {
      console.error('Customer analytics error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Müşteri analitikleri yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get inventory analytics
   */
  async getInventoryAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      // Inventory value by category
      const inventoryByCategory = await Inventory.aggregate([
        {
          $match: { owner: userId, isActive: true }
        },
        {
          $group: {
            _id: '$category',
            totalValue: { $sum: { $multiply: ['$quantity', '$costPrice'] } },
            totalQuantity: { $sum: '$quantity' },
            itemCount: { $sum: 1 },
            lowStockItems: {
              $sum: {
                $cond: [
                  { $lte: ['$quantity', '$minQuantity'] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $sort: { totalValue: -1 }
        }
      ]);

      // Inventory turnover
      const inventoryTurnover = await Inventory.aggregate([
        {
          $match: { owner: userId, isActive: true }
        },
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $multiply: ['$quantity', '$costPrice'] } },
            totalQuantity: { $sum: '$quantity' },
            averageValue: { $avg: { $multiply: ['$quantity', '$costPrice'] } }
          }
        }
      ]);

      // Low stock alerts
      const lowStockAlerts = await Inventory.find({
        owner: userId,
        isActive: true,
        $expr: { $lte: ['$quantity', '$minQuantity'] }
      })
      .sort({ quantity: 1 })
      .limit(20)
      .select('name sku quantity minQuantity maxQuantity category');

      // Inventory aging
      const inventoryAging = await Inventory.aggregate([
        {
          $match: { owner: userId, isActive: true }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: [{ $subtract: [new Date(), '$createdAt'] }, 30 * 24 * 60 * 60 * 1000] }, then: '0-30 days' },
                  { case: { $lt: [{ $subtract: [new Date(), '$createdAt'] }, 90 * 24 * 60 * 60 * 1000] }, then: '30-90 days' },
                  { case: { $lt: [{ $subtract: [new Date(), '$createdAt'] }, 180 * 24 * 60 * 60 * 1000] }, then: '90-180 days' },
                  { case: { $lt: [{ $subtract: [new Date(), '$createdAt'] }, 365 * 24 * 60 * 60 * 1000] }, then: '180-365 days' }
                ],
                default: '365+ days'
              }
            },
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$quantity', '$costPrice'] } }
          }
        }
      ]);

      res.json({
        status: 'success',
        data: {
          inventoryByCategory,
          inventoryTurnover: inventoryTurnover[0] || {},
          lowStockAlerts,
          inventoryAging
        }
      });
    } catch (error) {
      console.error('Inventory analytics error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Envanter analitikleri yüklenirken hata oluştu'
      });
    }
  },

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { period = '30d' } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Work order completion time
      const completionTime = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed',
            completedAt: { $exists: true }
          }
        },
        {
          $addFields: {
            completionTime: {
              $divide: [
                { $subtract: ['$completedAt', '$createdAt'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            averageCompletionTime: { $avg: '$completionTime' },
            minCompletionTime: { $min: '$completionTime' },
            maxCompletionTime: { $max: '$completionTime' }
          }
        }
      ]);

      // Service efficiency
      const serviceEfficiency = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            averageCost: { $avg: '$totalCost' }
          }
        }
      ]);

      // Revenue per vehicle
      const revenuePerVehicle = await WorkOrder.aggregate([
        {
          $match: {
            user: userId,
            isActive: true,
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $lookup: {
            from: 'vehicles',
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicleData'
          }
        },
        {
          $unwind: '$vehicleData'
        },
        {
          $group: {
            _id: '$vehicle',
            vehicleName: { $first: { $concat: ['$vehicleData.brand', ' ', '$vehicleData.model'] } },
            totalRevenue: { $sum: '$totalCost' },
            orderCount: { $sum: 1 },
            averageOrderValue: { $avg: '$totalCost' }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        }
      ]);

      // Customer satisfaction (based on repeat orders)
      const customerSatisfaction = await Customer.aggregate([
        {
          $match: { userId, isActive: true }
        },
        {
          $lookup: {
            from: 'workorders',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $addFields: {
            orderCount: { $size: '$orders' },
            totalSpent: { $sum: '$orders.totalCost' }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $eq: ['$orderCount', 0] }, then: 'No orders' },
                  { case: { $eq: ['$orderCount', 1] }, then: '1 order' },
                  { case: { $eq: ['$orderCount', 2] }, then: '2 orders' },
                  { case: { $eq: ['$orderCount', 3] }, then: '3 orders' },
                  { case: { $lt: ['$orderCount', 6] }, then: '4-5 orders' }
                ],
                default: '6+ orders'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        status: 'success',
        data: {
          completionTime: completionTime[0] || {},
          serviceEfficiency,
          revenuePerVehicle,
          customerSatisfaction
        }
      });
    } catch (error) {
      console.error('Performance metrics error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Performans metrikleri yüklenirken hata oluştu'
      });
    }
  }
};

export default biController;
