import Tenant from '../models/Tenant';
import User from '../models/User';
import WorkOrder from '../models/WorkOrder';
import Vehicle from '../models/Vehicle';
import Customer from '../models/Customer';

export interface UsageStats {
  tenantId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  apiCalls: {
    total: number;
    byEndpoint: Array<{
      endpoint: string;
      method: string;
      count: number;
      avgResponseTime: number;
    }>;
    byUser: Array<{
      userId: string;
      userName: string;
      count: number;
    }>;
    byHour: Array<{
      hour: number;
      count: number;
    }>;
  };
  workOrders: {
    total: number;
    created: number;
    completed: number;
    cancelled: number;
    avgProcessingTime: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
  };
  vehicles: {
    total: number;
    active: number;
    maintenance: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
  };
  storage: {
    total: number; // in MB
    byType: Array<{
      type: string;
      size: number;
      count: number;
    }>;
  };
  performance: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

export interface UsageAlert {
  id: string;
  tenantId: string;
  type: 'limit_warning' | 'limit_exceeded' | 'unusual_activity' | 'performance_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  data: any;
  createdAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface UsageReport {
  tenantId: string;
  period: 'daily' | 'weekly' | 'monthly';
  generatedAt: Date;
  stats: UsageStats;
  alerts: UsageAlert[];
  recommendations: string[];
}

export class UsageMonitoringService {
  // Get usage statistics for a tenant
  async getUsageStats(
    tenantId: string, 
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<UsageStats> {
    const now = new Date();
    const startDate = this.getPeriodStartDate(now, period);
    const endDate = now;

    // Get tenant info
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      throw new Error('Tenant bulunamadı');
    }

    // Get API call statistics (mock data for now)
    const apiCalls = await this.getApiCallStats(tenantId, startDate, endDate);

    // Get work order statistics
    const workOrders = await this.getWorkOrderStats(tenantId, startDate, endDate);

    // Get user statistics
    const users = await this.getUserStats(tenantId, startDate, endDate);

    // Get vehicle statistics
    const vehicles = await this.getVehicleStats(tenantId, startDate, endDate);

    // Get customer statistics
    const customers = await this.getCustomerStats(tenantId, startDate, endDate);

    // Get storage statistics
    const storage = await this.getStorageStats(tenantId);

    // Get performance statistics
    const performance = await this.getPerformanceStats(tenantId, startDate, endDate);

    return {
      tenantId,
      period,
      startDate,
      endDate,
      apiCalls,
      workOrders,
      users,
      vehicles,
      customers,
      storage,
      performance
    };
  }

  // Track API usage
  async trackApiUsage(
    tenantId: string,
    endpoint: string,
    method: string,
    userId?: string,
    responseTime?: number,
    statusCode?: number
  ): Promise<void> {
    try {
      // Update tenant usage
      await Tenant.findByIdAndUpdate(tenantId, {
        $inc: { 'usage.apiCalls': 1 },
        $set: { 'usage.lastApiCall': new Date() }
      });

      // In a real implementation, you would store detailed API call logs
      // For now, we'll just update the tenant's usage counter
      console.log(`API Usage tracked: ${method} ${endpoint} for tenant ${tenantId}`);
    } catch (error) {
      console.error('API usage tracking error:', error);
    }
  }

  // Check usage limits and generate alerts
  async checkUsageLimits(tenantId: string): Promise<UsageAlert[]> {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return [];
    }

    const alerts: UsageAlert[] = [];
    const limits = tenant.subscription.limits;
    const usage = tenant.usage;

    // Check API call limits
    if (limits.apiCalls !== -1) {
      const usagePercentage = (usage.apiCalls / limits.apiCalls) * 100;
      
      if (usagePercentage >= 100) {
        alerts.push({
          id: `api_limit_exceeded_${tenantId}_${Date.now()}`,
          tenantId,
          type: 'limit_exceeded',
          severity: 'critical',
          message: 'API çağrı limitiniz aşıldı',
          data: { limit: limits.apiCalls, usage: usage.apiCalls },
          createdAt: new Date(),
          resolved: false
        });
      } else if (usagePercentage >= 80) {
        alerts.push({
          id: `api_limit_warning_${tenantId}_${Date.now()}`,
          tenantId,
          type: 'limit_warning',
          severity: 'high',
          message: 'API çağrı limitinizin %80\'ine ulaştınız',
          data: { limit: limits.apiCalls, usage: usage.apiCalls, percentage: usagePercentage },
          createdAt: new Date(),
          resolved: false
        });
      }
    }

    // Check work order limits
    if (limits.workOrders !== -1) {
      const usagePercentage = (usage.workOrders / limits.workOrders) * 100;
      
      if (usagePercentage >= 100) {
        alerts.push({
          id: `workorder_limit_exceeded_${tenantId}_${Date.now()}`,
          tenantId,
          type: 'limit_exceeded',
          severity: 'critical',
          message: 'İş emri limitiniz aşıldı',
          data: { limit: limits.workOrders, usage: usage.workOrders },
          createdAt: new Date(),
          resolved: false
        });
      } else if (usagePercentage >= 80) {
        alerts.push({
          id: `workorder_limit_warning_${tenantId}_${Date.now()}`,
          tenantId,
          type: 'limit_warning',
          severity: 'medium',
          message: 'İş emri limitinizin %80\'ine ulaştınız',
          data: { limit: limits.workOrders, usage: usage.workOrders, percentage: usagePercentage },
          createdAt: new Date(),
          resolved: false
        });
      }
    }

    // Check user limits
    if (limits.users !== -1) {
      const usagePercentage = (usage.users / limits.users) * 100;
      
      if (usagePercentage >= 100) {
        alerts.push({
          id: `user_limit_exceeded_${tenantId}_${Date.now()}`,
          tenantId,
          type: 'limit_exceeded',
          severity: 'high',
          message: 'Kullanıcı limitiniz aşıldı',
          data: { limit: limits.users, usage: usage.users },
          createdAt: new Date(),
          resolved: false
        });
      }
    }

    // Check storage limits
    if (limits.storage !== -1) {
      const usagePercentage = (usage.storage / limits.storage) * 100;
      
      if (usagePercentage >= 100) {
        alerts.push({
          id: `storage_limit_exceeded_${tenantId}_${Date.now()}`,
          tenantId,
          type: 'limit_exceeded',
          severity: 'critical',
          message: 'Depolama limitiniz aşıldı',
          data: { limit: limits.storage, usage: usage.storage },
          createdAt: new Date(),
          resolved: false
        });
      } else if (usagePercentage >= 80) {
        alerts.push({
          id: `storage_limit_warning_${tenantId}_${tenantId}_${Date.now()}`,
          tenantId,
          type: 'limit_warning',
          severity: 'medium',
          message: 'Depolama limitinizin %80\'ine ulaştınız',
          data: { limit: limits.storage, usage: usage.storage, percentage: usagePercentage },
          createdAt: new Date(),
          resolved: false
        });
      }
    }

    return alerts;
  }

  // Generate usage report
  async generateUsageReport(
    tenantId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<UsageReport> {
    const stats = await this.getUsageStats(tenantId, period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month');
    const alerts = await this.checkUsageLimits(tenantId);
    const recommendations = await this.generateRecommendations(tenantId, stats);

    return {
      tenantId,
      period,
      generatedAt: new Date(),
      stats,
      alerts,
      recommendations
    };
  }

  // Reset usage counters (monthly)
  async resetUsageCounters(tenantId: string): Promise<void> {
    await Tenant.findByIdAndUpdate(tenantId, {
      $set: {
        'usage.apiCalls': 0,
        'usage.workOrders': 0,
        'usage.users': 0,
        'usage.storage': 0,
        'usage.lastReset': new Date()
      }
    });
  }

  // Private helper methods
  private getPeriodStartDate(date: Date, period: string): Date {
    const start = new Date(date);
    
    switch (period) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    
    return start;
  }

  private async getApiCallStats(tenantId: string, startDate: Date, endDate: Date) {
    // Mock data - in real implementation, query API call logs
    return {
      total: 1250,
      byEndpoint: [
        { endpoint: '/api/work-orders', method: 'GET', count: 450, avgResponseTime: 120 },
        { endpoint: '/api/vehicles', method: 'GET', count: 300, avgResponseTime: 95 },
        { endpoint: '/api/customers', method: 'POST', count: 200, avgResponseTime: 180 },
        { endpoint: '/api/auth/login', method: 'POST', count: 150, avgResponseTime: 250 },
        { endpoint: '/api/reports', method: 'GET', count: 150, avgResponseTime: 800 }
      ],
      byUser: [
        { userId: 'user1', userName: 'Ahmet Yılmaz', count: 400 },
        { userId: 'user2', userName: 'Ayşe Demir', count: 350 },
        { userId: 'user3', userName: 'Mehmet Kaya', count: 300 },
        { userId: 'user4', userName: 'Fatma Özkan', count: 200 }
      ],
      byHour: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: Math.floor(Math.random() * 100) + 20
      }))
    };
  }

  private async getWorkOrderStats(tenantId: string, startDate: Date, endDate: Date) {
    const total = await WorkOrder.countDocuments({ tenantId });
    const created = await WorkOrder.countDocuments({ 
      tenantId, 
      createdAt: { $gte: startDate, $lte: endDate } 
    });
    const completed = await WorkOrder.countDocuments({ 
      tenantId, 
      status: 'completed',
      updatedAt: { $gte: startDate, $lte: endDate }
    });
    const cancelled = await WorkOrder.countDocuments({ 
      tenantId, 
      status: 'cancelled',
      updatedAt: { $gte: startDate, $lte: endDate }
    });

    return {
      total,
      created,
      completed,
      cancelled,
      avgProcessingTime: 2.5 // hours
    };
  }

  private async getUserStats(tenantId: string, startDate: Date, endDate: Date) {
    const total = await User.countDocuments({ tenantId });
    const active = await User.countDocuments({ 
      tenantId, 
      isActive: true 
    });
    const newUsers = await User.countDocuments({ 
      tenantId, 
      createdAt: { $gte: startDate, $lte: endDate } 
    });

    return { total, active, new: newUsers };
  }

  private async getVehicleStats(tenantId: string, startDate: Date, endDate: Date) {
    const total = await Vehicle.countDocuments({ tenantId });
    const active = await Vehicle.countDocuments({ 
      tenantId, 
      status: 'active' 
    });
    const maintenance = await Vehicle.countDocuments({ 
      tenantId, 
      status: 'maintenance' 
    });

    return { total, active, maintenance };
  }

  private async getCustomerStats(tenantId: string, startDate: Date, endDate: Date) {
    const total = await Customer.countDocuments({ tenantId });
    const newCustomers = await Customer.countDocuments({ 
      tenantId, 
      createdAt: { $gte: startDate, $lte: endDate } 
    });
    const active = await Customer.countDocuments({ 
      tenantId, 
      lastVisit: { $gte: startDate, $lte: endDate } 
    });

    return { total, new: newCustomers, active };
  }

  private async getStorageStats(tenantId: string) {
    // Mock data - in real implementation, calculate actual storage usage
    return {
      total: 250, // MB
      byType: [
        { type: 'images', size: 150, count: 45 },
        { type: 'documents', size: 80, count: 12 },
        { type: 'videos', size: 20, count: 3 }
      ]
    };
  }

  private async getPerformanceStats(tenantId: string, startDate: Date, endDate: Date) {
    // Mock data - in real implementation, calculate from actual metrics
    return {
      avgResponseTime: 150, // ms
      errorRate: 0.02, // 2%
      uptime: 99.9 // percentage
    };
  }

  private async generateRecommendations(tenantId: string, stats: UsageStats): Promise<string[]> {
    const recommendations: string[] = [];
    const tenant = await Tenant.findById(tenantId);
    
    if (!tenant) return recommendations;

    // API usage recommendations
    if (stats.apiCalls.total > 1000) {
      recommendations.push('API kullanımınız yüksek. Plan yükseltmeyi düşünün.');
    }

    // Work order recommendations
    if (stats.workOrders.avgProcessingTime > 3) {
      recommendations.push('İş emri işleme süreniz uzun. Süreç optimizasyonu yapın.');
    }

    // Storage recommendations
    if (stats.storage.total > 200) {
      recommendations.push('Depolama kullanımınız yüksek. Eski dosyaları temizleyin.');
    }

    // Performance recommendations
    if (stats.performance.avgResponseTime > 200) {
      recommendations.push('API yanıt süreniz yavaş. Performans optimizasyonu yapın.');
    }

    if (stats.performance.errorRate > 0.05) {
      recommendations.push('Hata oranınız yüksek. Sistem kontrolü yapın.');
    }

    return recommendations;
  }
}

export const usageMonitoringService = new UsageMonitoringService();
