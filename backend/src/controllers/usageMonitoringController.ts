import { Request, Response } from 'express';
import { usageMonitoringService } from '../services/usageMonitoringService';
import { query, param } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import Tenant from '../models/Tenant';

export class UsageMonitoringController {
  // Get usage statistics
  async getUsageStats(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const { period = 'month' } = req.query;

      const stats = await usageMonitoringService.getUsageStats(
        tenantId,
        period as 'day' | 'week' | 'month' | 'year'
      );

      res.json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      console.error('Get usage stats error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Kullanım istatistikleri alınırken hata oluştu'
      });
    }
  }

  // Get usage alerts
  async getUsageAlerts(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;

      const alerts = await usageMonitoringService.checkUsageLimits(tenantId);

      res.json({
        status: 'success',
        data: alerts
      });
    } catch (error) {
      console.error('Get usage alerts error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Kullanım uyarıları alınırken hata oluştu'
      });
    }
  }

  // Generate usage report
  async generateUsageReport(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const { period = 'monthly' } = req.query;

      const report = await usageMonitoringService.generateUsageReport(
        tenantId,
        period as 'daily' | 'weekly' | 'monthly'
      );

      res.json({
        status: 'success',
        data: report
      });
    } catch (error) {
      console.error('Generate usage report error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Kullanım raporu oluşturulurken hata oluştu'
      });
    }
  }

  // Reset usage counters
  async resetUsageCounters(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;

      await usageMonitoringService.resetUsageCounters(tenantId);

      res.json({
        status: 'success',
        message: 'Kullanım sayaçları sıfırlandı'
      });
    } catch (error) {
      console.error('Reset usage counters error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Kullanım sayaçları sıfırlanırken hata oluştu'
      });
    }
  }

  // Track API usage
  async trackApiUsage(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const { endpoint, method, userId, responseTime, statusCode } = req.body;

      await usageMonitoringService.trackApiUsage(
        tenantId,
        endpoint,
        method,
        userId,
        responseTime,
        statusCode
      );

      res.json({
        status: 'success',
        message: 'API kullanımı kaydedildi'
      });
    } catch (error) {
      console.error('Track API usage error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'API kullanımı kaydedilirken hata oluştu'
      });
    }
  }

  // Get usage dashboard data
  async getUsageDashboard(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;

      // Get current usage stats
      const stats = await usageMonitoringService.getUsageStats(tenantId, 'month');
      
      // Get alerts
      const alerts = await usageMonitoringService.checkUsageLimits(tenantId);

      // Get tenant info for limits
      const tenant = await Tenant.findById(tenantId);

      if (!tenant) {
        return res.status(404).json({
          status: 'error',
          message: 'Tenant bulunamadı'
        });
      }

      const dashboard = {
        currentUsage: {
          apiCalls: {
            used: tenant.usage.apiCalls,
            limit: tenant.subscription.limits.apiCalls,
            percentage: tenant.subscription.limits.apiCalls === -1 
              ? 0 
              : (tenant.usage.apiCalls / tenant.subscription.limits.apiCalls) * 100
          },
          workOrders: {
            used: tenant.usage.workOrders,
            limit: tenant.subscription.limits.workOrders,
            percentage: tenant.subscription.limits.workOrders === -1 
              ? 0 
              : (tenant.usage.workOrders / tenant.subscription.limits.workOrders) * 100
          },
          users: {
            used: tenant.usage.users,
            limit: tenant.subscription.limits.users,
            percentage: tenant.subscription.limits.users === -1 
              ? 0 
              : (tenant.usage.users / tenant.subscription.limits.users) * 100
          },
          storage: {
            used: tenant.usage.storage,
            limit: tenant.subscription.limits.storage,
            percentage: tenant.subscription.limits.storage === -1 
              ? 0 
              : (tenant.usage.storage / tenant.subscription.limits.storage) * 100
          }
        },
        stats,
        alerts,
        plan: tenant.subscription.plan,
        status: tenant.subscription.status
      };

      res.json({
        status: 'success',
        data: dashboard
      });
    } catch (error) {
      console.error('Get usage dashboard error:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Kullanım dashboard verileri alınırken hata oluştu'
      });
    }
  }
}

export const usageMonitoringController = new UsageMonitoringController();
