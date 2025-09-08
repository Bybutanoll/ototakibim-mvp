import { apiClient } from './apiClient';

export interface UsageStats {
  tenantId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
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
    total: number;
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
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface UsageReport {
  tenantId: string;
  period: 'daily' | 'weekly' | 'monthly';
  generatedAt: string;
  stats: UsageStats;
  alerts: UsageAlert[];
  recommendations: string[];
}

export interface UsageDashboard {
  currentUsage: {
    apiCalls: {
      used: number;
      limit: number;
      percentage: number;
    };
    workOrders: {
      used: number;
      limit: number;
      percentage: number;
    };
    users: {
      used: number;
      limit: number;
      percentage: number;
    };
    storage: {
      used: number;
      limit: number;
      percentage: number;
    };
  };
  stats: UsageStats;
  alerts: UsageAlert[];
  plan: string;
  status: string;
}

class UsageMonitoringService {
  private baseUrl = '/api/usage';

  // Get usage statistics
  async getUsageStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<UsageStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats?period=${period}`);
    return response.data;
  }

  // Get usage alerts
  async getUsageAlerts(): Promise<UsageAlert[]> {
    const response = await apiClient.get(`${this.baseUrl}/alerts`);
    return response.data;
  }

  // Generate usage report
  async generateUsageReport(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<UsageReport> {
    const response = await apiClient.get(`${this.baseUrl}/report?period=${period}`);
    return response.data;
  }

  // Get usage dashboard
  async getUsageDashboard(): Promise<UsageDashboard> {
    const response = await apiClient.get(`${this.baseUrl}/dashboard`);
    return response.data;
  }

  // Reset usage counters
  async resetUsageCounters(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/reset`);
  }

  // Track API usage
  async trackApiUsage(data: {
    endpoint: string;
    method: string;
    userId?: string;
    responseTime?: number;
    statusCode?: number;
  }): Promise<void> {
    await apiClient.post(`${this.baseUrl}/track`, data);
  }

  // Utility methods
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('tr-TR').format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('tr-TR');
  }

  getSeverityColor(severity: string): string {
    const colors = {
      low: 'text-blue-600 bg-blue-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  }

  getSeverityText(severity: string): string {
    const texts = {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
      critical: 'Kritik'
    };
    return texts[severity as keyof typeof texts] || severity;
  }

  getAlertTypeText(type: string): string {
    const texts = {
      limit_warning: 'Limit Uyarısı',
      limit_exceeded: 'Limit Aşıldı',
      unusual_activity: 'Olağandışı Aktivite',
      performance_issue: 'Performans Sorunu'
    };
    return texts[type as keyof typeof texts] || type;
  }

  getUsageColor(percentage: number): string {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  }

  getUsageBarColor(percentage: number): string {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getPlanDisplayName(plan: string): string {
    const names = {
      starter: 'Başlangıç',
      professional: 'Profesyonel',
      enterprise: 'Kurumsal'
    };
    return names[plan as keyof typeof names] || plan;
  }

  getStatusDisplayName(status: string): string {
    const names = {
      active: 'Aktif',
      trial: 'Deneme',
      cancelled: 'İptal Edildi',
      suspended: 'Askıda'
    };
    return names[status as keyof typeof names] || status;
  }

  getStatusColor(status: string): string {
    const colors = {
      active: 'text-green-600 bg-green-100',
      trial: 'text-blue-600 bg-blue-100',
      cancelled: 'text-red-600 bg-red-100',
      suspended: 'text-yellow-600 bg-yellow-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  }

  // Calculate usage efficiency
  calculateEfficiency(stats: UsageStats): {
    apiEfficiency: number;
    workOrderEfficiency: number;
    overallEfficiency: number;
  } {
    // API efficiency based on response time and error rate
    const apiEfficiency = Math.max(0, 100 - (stats.performance.avgResponseTime / 10) - (stats.performance.errorRate * 100));
    
    // Work order efficiency based on completion rate and processing time
    const completionRate = stats.workOrders.total > 0 ? (stats.workOrders.completed / stats.workOrders.total) * 100 : 0;
    const processingEfficiency = Math.max(0, 100 - (stats.workOrders.avgProcessingTime * 10));
    const workOrderEfficiency = (completionRate + processingEfficiency) / 2;
    
    // Overall efficiency
    const overallEfficiency = (apiEfficiency + workOrderEfficiency) / 2;
    
    return {
      apiEfficiency: Math.round(apiEfficiency),
      workOrderEfficiency: Math.round(workOrderEfficiency),
      overallEfficiency: Math.round(overallEfficiency)
    };
  }

  // Generate usage insights
  generateInsights(stats: UsageStats, dashboard: UsageDashboard): string[] {
    const insights: string[] = [];
    
    // API usage insights
    if (stats.apiCalls.total > 1000) {
      insights.push('API kullanımınız yüksek. Plan yükseltmeyi düşünün.');
    }
    
    // Work order insights
    if (stats.workOrders.avgProcessingTime > 3) {
      insights.push('İş emri işleme süreniz uzun. Süreç optimizasyonu yapın.');
    }
    
    // Performance insights
    if (stats.performance.avgResponseTime > 200) {
      insights.push('API yanıt süreniz yavaş. Performans optimizasyonu yapın.');
    }
    
    // Storage insights
    if (stats.storage.total > 200) {
      insights.push('Depolama kullanımınız yüksek. Eski dosyaları temizleyin.');
    }
    
    // Usage limit insights
    Object.entries(dashboard.currentUsage).forEach(([key, usage]) => {
      if (usage.percentage >= 80) {
        insights.push(`${key} limitinizin %80'ine ulaştınız.`);
      }
    });
    
    return insights;
  }
}

export const usageMonitoringService = new UsageMonitoringService();
