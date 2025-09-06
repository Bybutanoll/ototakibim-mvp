// AI Service for OtoTakibim - Türkiye'nin İlk AI-Destekli Oto Bakım Sistemi
import { api, handleApiError } from './api';

// AI Types
export interface MaintenancePrediction {
  id: string;
  vehicleId: string;
  component: string;
  predictedFailureDate: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  recommendedAction: string;
  symptoms: string[];
  riskFactors: string[];
  createdAt: string;
}

export interface SmartDiagnostic {
  id: string;
  vehicleId: string;
  symptoms: string[];
  userDescription: string;
  diagnosticResult: {
    problem: string;
    confidence: number;
    possibleCauses: Array<{
      cause: string;
      probability: number;
      estimatedCost: number;
      repairTime: string;
    }>;
    recommendedActions: Array<{
      action: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      description: string;
    }>;
    partsNeeded: Array<{
      part: string;
      quantity: number;
      estimatedPrice: number;
      availability: 'in-stock' | 'order-required' | 'rare';
    }>;
  };
  createdAt: string;
}

export interface BusinessIntelligence {
  costOptimization: {
    totalSavings: number;
    recommendations: Array<{
      category: string;
      currentCost: number;
      optimizedCost: number;
      savings: number;
      action: string;
    }>;
  };
  servicePatterns: {
    peakHours: Array<{ hour: number; demand: number }>;
    seasonalTrends: Array<{ month: string; demand: number; cost: number }>;
    popularServices: Array<{ service: string; frequency: number; revenue: number }>;
  };
  profitabilityInsights: {
    totalRevenue: number;
    totalCosts: number;
    profitMargin: number;
    topRevenueServices: Array<{ service: string; revenue: number; margin: number }>;
    costCenters: Array<{ category: string; cost: number; percentage: number }>;
  };
  customerBehavior: {
    averageServiceInterval: number;
    customerRetentionRate: number;
    upsellOpportunities: Array<{ service: string; potentialRevenue: number; probability: number }>;
    churnRisk: Array<{ customerId: string; riskScore: number; reasons: string[] }>;
  };
}

export interface AIDashboardMetrics {
  predictions: {
    total: number;
    highConfidence: number;
    criticalAlerts: number;
    accuracy: number;
  };
  diagnostics: {
    total: number;
    successful: number;
    averageConfidence: number;
    costSavings: number;
  };
  businessIntelligence: {
    totalSavings: number;
    optimizationScore: number;
    trendAccuracy: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    vehicleId?: string;
    diagnosticId?: string;
    maintenanceId?: string;
  };
}

export const aiService = {
  // Predictive Maintenance
  getMaintenancePredictions: async (vehicleId?: string): Promise<MaintenancePrediction[]> => {
    try {
      const params = vehicleId ? { vehicleId } : {};
      const response = await api.get<MaintenancePrediction[]>('/ai/predictions', { params });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createMaintenancePrediction: async (data: {
    vehicleId: string;
    component: string;
    symptoms: string[];
    mileage: number;
    lastServiceDate: string;
  }): Promise<MaintenancePrediction> => {
    try {
      const response = await api.post<MaintenancePrediction>('/ai/predictions', data);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updatePredictionAccuracy: async (predictionId: string, actualOutcome: {
    wasAccurate: boolean;
    actualFailureDate?: string;
    actualCost?: number;
  }): Promise<void> => {
    try {
      await api.put(`/ai/predictions/${predictionId}/accuracy`, actualOutcome);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Smart Diagnostics
  performSmartDiagnostic: async (data: {
    vehicleId: string;
    symptoms: string[];
    userDescription: string;
    vehicleData?: {
      mileage: number;
      year: number;
      make: string;
      model: string;
      engineType: string;
    };
  }): Promise<SmartDiagnostic> => {
    try {
      const response = await api.post<SmartDiagnostic>('/ai/diagnostics', data);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getDiagnosticHistory: async (vehicleId?: string): Promise<SmartDiagnostic[]> => {
    try {
      const params = vehicleId ? { vehicleId } : {};
      const response = await api.get<SmartDiagnostic[]>('/ai/diagnostics', { params });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  rateDiagnosticAccuracy: async (diagnosticId: string, rating: {
    wasAccurate: boolean;
    actualProblem?: string;
    actualCost?: number;
    feedback?: string;
  }): Promise<void> => {
    try {
      await api.post(`/ai/diagnostics/${diagnosticId}/rating`, rating);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Business Intelligence
  getBusinessIntelligence: async (dateRange?: {
    startDate: string;
    endDate: string;
  }): Promise<BusinessIntelligence> => {
    try {
      const params = dateRange ? { ...dateRange } : {};
      const response = await api.get<BusinessIntelligence>('/ai/business-intelligence', { params });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getCostOptimizationSuggestions: async (): Promise<BusinessIntelligence['costOptimization']> => {
    try {
      const response = await api.get<BusinessIntelligence['costOptimization']>('/ai/cost-optimization');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getServicePatterns: async (): Promise<BusinessIntelligence['servicePatterns']> => {
    try {
      const response = await api.get<BusinessIntelligence['servicePatterns']>('/ai/service-patterns');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getProfitabilityInsights: async (): Promise<BusinessIntelligence['profitabilityInsights']> => {
    try {
      const response = await api.get<BusinessIntelligence['profitabilityInsights']>('/ai/profitability');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getCustomerBehaviorAnalysis: async (): Promise<BusinessIntelligence['customerBehavior']> => {
    try {
      const response = await api.get<BusinessIntelligence['customerBehavior']>('/ai/customer-behavior');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // AI Dashboard
  getAIDashboardMetrics: async (): Promise<AIDashboardMetrics> => {
    try {
      const response = await api.get<AIDashboardMetrics>('/ai/dashboard-metrics');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // AI Chat Assistant
  sendChatMessage: async (message: {
    content: string;
    context?: {
      vehicleId?: string;
      diagnosticId?: string;
      maintenanceId?: string;
    };
  }): Promise<ChatMessage> => {
    try {
      const response = await api.post<ChatMessage>('/ai/chat', message);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getChatHistory: async (context?: {
    vehicleId?: string;
    diagnosticId?: string;
    maintenanceId?: string;
  }): Promise<ChatMessage[]> => {
    try {
      const params = context ? { ...context } : {};
      const response = await api.get<ChatMessage[]>('/ai/chat', { params });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // AI Model Management
  getModelPerformance: async (): Promise<{
    predictions: {
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
    };
    diagnostics: {
      accuracy: number;
      averageConfidence: number;
      userSatisfaction: number;
    };
    businessIntelligence: {
      predictionAccuracy: number;
      costSavingsAccuracy: number;
      trendAccuracy: number;
    };
  }> => {
    try {
      const response = await api.get('/ai/model-performance');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  retrainModel: async (modelType: 'predictions' | 'diagnostics' | 'business-intelligence'): Promise<{
    success: boolean;
    message: string;
    estimatedTime: string;
  }> => {
    try {
      const response = await api.post(`/ai/retrain/${modelType}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // AI Insights and Recommendations
  getPersonalizedRecommendations: async (userId: string): Promise<Array<{
    type: 'maintenance' | 'service' | 'cost-optimization' | 'upsell';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimatedImpact: number;
    actionRequired: boolean;
    actionUrl?: string;
  }>> => {
    try {
      const response = await api.get(`/ai/recommendations/${userId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getTrendAnalysis: async (timeframe: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    trends: Array<{
      metric: string;
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
      trend: 'up' | 'down' | 'stable';
    }>;
    forecasts: Array<{
      metric: string;
      forecast: number;
      confidence: number;
      timeframe: string;
    }>;
  }> => {
    try {
      const response = await api.get(`/ai/trends/${timeframe}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // AI Alerts and Notifications
  getAIAlerts: async (): Promise<Array<{
    id: string;
    type: 'prediction' | 'diagnostic' | 'cost' | 'maintenance';
    severity: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    vehicleId?: string;
    actionRequired: boolean;
    createdAt: string;
    read: boolean;
  }>> => {
    try {
      const response = await api.get('/ai/alerts');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  markAlertAsRead: async (alertId: string): Promise<void> => {
    try {
      await api.put(`/ai/alerts/${alertId}/read`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // AI Learning and Feedback
  submitFeedback: async (data: {
    type: 'prediction' | 'diagnostic' | 'recommendation';
    itemId: string;
    rating: number;
    feedback: string;
    wasHelpful: boolean;
  }): Promise<void> => {
    try {
      await api.post('/ai/feedback', data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getLearningInsights: async (): Promise<{
    totalFeedback: number;
    averageRating: number;
    improvementAreas: string[];
    strengths: string[];
    recentImprovements: Array<{
      area: string;
      improvement: number;
      date: string;
    }>;
  }> => {
    try {
      const response = await api.get('/ai/learning-insights');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
