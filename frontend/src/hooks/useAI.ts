'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  aiService, 
  MaintenancePrediction, 
  SmartDiagnostic, 
  BusinessIntelligence, 
  AIDashboardMetrics,
  ChatMessage 
} from '../services/aiService';
import { useToast } from '../components/Toast';

// AI Context Types
interface AIState {
  predictions: MaintenancePrediction[];
  diagnostics: SmartDiagnostic[];
  businessIntelligence: BusinessIntelligence | null;
  dashboardMetrics: AIDashboardMetrics | null;
  chatHistory: ChatMessage[];
  loading: {
    predictions: boolean;
    diagnostics: boolean;
    businessIntelligence: boolean;
    dashboard: boolean;
    chat: boolean;
  };
  error: string | null;
}

interface AIContextType extends AIState {
  // Predictions
  fetchPredictions: (vehicleId?: string) => Promise<void>;
  createPrediction: (data: any) => Promise<MaintenancePrediction>;
  updatePredictionAccuracy: (predictionId: string, outcome: any) => Promise<void>;
  
  // Diagnostics
  performDiagnostic: (data: any) => Promise<SmartDiagnostic>;
  fetchDiagnostics: (vehicleId?: string) => Promise<void>;
  rateDiagnostic: (diagnosticId: string, rating: any) => Promise<void>;
  
  // Business Intelligence
  fetchBusinessIntelligence: (dateRange?: any) => Promise<void>;
  fetchCostOptimization: () => Promise<void>;
  fetchServicePatterns: () => Promise<void>;
  fetchProfitabilityInsights: () => Promise<void>;
  fetchCustomerBehavior: () => Promise<void>;
  
  // Dashboard
  fetchDashboardMetrics: () => Promise<void>;
  
  // Chat
  sendChatMessage: (message: string, context?: any) => Promise<void>;
  fetchChatHistory: (context?: any) => Promise<void>;
  
  // Utility
  clearError: () => void;
  refreshAll: () => Promise<void>;
}

// Create AI Context
const AIContext = createContext<AIContextType | undefined>(undefined);

// AI Provider Component
export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiState, setAIState] = useState<AIState>({
    predictions: [],
    diagnostics: [],
    businessIntelligence: null,
    dashboardMetrics: null,
    chatHistory: [],
    loading: {
      predictions: false,
      diagnostics: false,
      businessIntelligence: false,
      dashboard: false,
      chat: false,
    },
    error: null,
  });

  const { showToast } = useToast();

  // Predictions
  const fetchPredictions = useCallback(async (vehicleId?: string) => {
    setAIState(prev => ({ ...prev, loading: { ...prev.loading, predictions: true }, error: null }));
    
    try {
      const predictions = await aiService.getMaintenancePredictions(vehicleId);
      setAIState(prev => ({ 
        ...prev, 
        predictions, 
        loading: { ...prev.loading, predictions: false } 
      }));
    } catch (error: any) {
      setAIState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: { ...prev.loading, predictions: false } 
      }));
      showToast('Tahminler yüklenirken hata oluştu', 'error');
    }
  }, [showToast]);

  const createPrediction = useCallback(async (data: any): Promise<MaintenancePrediction> => {
    try {
      const prediction = await aiService.createMaintenancePrediction(data);
      setAIState(prev => ({ 
        ...prev, 
        predictions: [prediction, ...prev.predictions] 
      }));
      showToast('Yeni bakım tahmini oluşturuldu', 'success');
      return prediction;
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const updatePredictionAccuracy = useCallback(async (predictionId: string, outcome: any) => {
    try {
      await aiService.updatePredictionAccuracy(predictionId, outcome);
      showToast('Tahmin doğruluğu güncellendi', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  // Diagnostics
  const performDiagnostic = useCallback(async (data: any): Promise<SmartDiagnostic> => {
    setAIState(prev => ({ ...prev, loading: { ...prev.loading, diagnostics: true }, error: null }));
    
    try {
      const diagnostic = await aiService.performSmartDiagnostic(data);
      setAIState(prev => ({ 
        ...prev, 
        diagnostics: [diagnostic, ...prev.diagnostics],
        loading: { ...prev.loading, diagnostics: false }
      }));
      showToast('Akıllı tanı tamamlandı', 'success');
      return diagnostic;
    } catch (error: any) {
      setAIState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: { ...prev.loading, diagnostics: false } 
      }));
      showToast(error.message, 'error');
      throw error;
    }
  }, [showToast]);

  const fetchDiagnostics = useCallback(async (vehicleId?: string) => {
    setAIState(prev => ({ ...prev, loading: { ...prev.loading, diagnostics: true }, error: null }));
    
    try {
      const diagnostics = await aiService.getDiagnosticHistory(vehicleId);
      setAIState(prev => ({ 
        ...prev, 
        diagnostics, 
        loading: { ...prev.loading, diagnostics: false } 
      }));
    } catch (error: any) {
      setAIState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: { ...prev.loading, diagnostics: false } 
      }));
      showToast('Tanı geçmişi yüklenirken hata oluştu', 'error');
    }
  }, [showToast]);

  const rateDiagnostic = useCallback(async (diagnosticId: string, rating: any) => {
    try {
      await aiService.rateDiagnosticAccuracy(diagnosticId, rating);
      showToast('Tanı değerlendirmesi kaydedildi', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  // Business Intelligence
  const fetchBusinessIntelligence = useCallback(async (dateRange?: any) => {
    setAIState(prev => ({ ...prev, loading: { ...prev.loading, businessIntelligence: true }, error: null }));
    
    try {
      const bi = await aiService.getBusinessIntelligence(dateRange);
      setAIState(prev => ({ 
        ...prev, 
        businessIntelligence: bi, 
        loading: { ...prev.loading, businessIntelligence: false } 
      }));
    } catch (error: any) {
      setAIState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: { ...prev.loading, businessIntelligence: false } 
      }));
      showToast('İş zekası verileri yüklenirken hata oluştu', 'error');
    }
  }, [showToast]);

  const fetchCostOptimization = useCallback(async () => {
    try {
      const costOpt = await aiService.getCostOptimizationSuggestions();
      setAIState(prev => ({ 
        ...prev, 
        businessIntelligence: prev.businessIntelligence ? {
          ...prev.businessIntelligence,
          costOptimization: costOpt
        } : null
      }));
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  const fetchServicePatterns = useCallback(async () => {
    try {
      const patterns = await aiService.getServicePatterns();
      setAIState(prev => ({ 
        ...prev, 
        businessIntelligence: prev.businessIntelligence ? {
          ...prev.businessIntelligence,
          servicePatterns: patterns
        } : null
      }));
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  const fetchProfitabilityInsights = useCallback(async () => {
    try {
      const insights = await aiService.getProfitabilityInsights();
      setAIState(prev => ({ 
        ...prev, 
        businessIntelligence: prev.businessIntelligence ? {
          ...prev.businessIntelligence,
          profitabilityInsights: insights
        } : null
      }));
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  const fetchCustomerBehavior = useCallback(async () => {
    try {
      const behavior = await aiService.getCustomerBehaviorAnalysis();
      setAIState(prev => ({ 
        ...prev, 
        businessIntelligence: prev.businessIntelligence ? {
          ...prev.businessIntelligence,
          customerBehavior: behavior
        } : null
      }));
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  // Dashboard
  const fetchDashboardMetrics = useCallback(async () => {
    setAIState(prev => ({ ...prev, loading: { ...prev.loading, dashboard: true }, error: null }));
    
    try {
      const metrics = await aiService.getAIDashboardMetrics();
      setAIState(prev => ({ 
        ...prev, 
        dashboardMetrics: metrics, 
        loading: { ...prev.loading, dashboard: false } 
      }));
    } catch (error: any) {
      setAIState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: { ...prev.loading, dashboard: false } 
      }));
      showToast('Dashboard metrikleri yüklenirken hata oluştu', 'error');
    }
  }, [showToast]);

  // Chat
  const sendChatMessage = useCallback(async (message: string, context?: any) => {
    setAIState(prev => ({ ...prev, loading: { ...prev.loading, chat: true }, error: null }));
    
    try {
      const response = await aiService.sendChatMessage({ content: message, context });
      setAIState(prev => ({ 
        ...prev, 
        chatHistory: [...prev.chatHistory, response],
        loading: { ...prev.loading, chat: false }
      }));
    } catch (error: any) {
      setAIState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: { ...prev.loading, chat: false } 
      }));
      showToast('Mesaj gönderilirken hata oluştu', 'error');
    }
  }, [showToast]);

  const fetchChatHistory = useCallback(async (context?: any) => {
    setAIState(prev => ({ ...prev, loading: { ...prev.loading, chat: true }, error: null }));
    
    try {
      const history = await aiService.getChatHistory(context);
      setAIState(prev => ({ 
        ...prev, 
        chatHistory: history, 
        loading: { ...prev.loading, chat: false } 
      }));
    } catch (error: any) {
      setAIState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: { ...prev.loading, chat: false } 
      }));
      showToast('Sohbet geçmişi yüklenirken hata oluştu', 'error');
    }
  }, [showToast]);

  // Utility
  const clearError = useCallback(() => {
    setAIState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchPredictions(),
      fetchDiagnostics(),
      fetchBusinessIntelligence(),
      fetchDashboardMetrics(),
    ]);
  }, [fetchPredictions, fetchDiagnostics, fetchBusinessIntelligence, fetchDashboardMetrics]);

  // Initialize data on mount
  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  const contextValue: AIContextType = {
    ...aiState,
    fetchPredictions,
    createPrediction,
    updatePredictionAccuracy,
    performDiagnostic,
    fetchDiagnostics,
    rateDiagnostic,
    fetchBusinessIntelligence,
    fetchCostOptimization,
    fetchServicePatterns,
    fetchProfitabilityInsights,
    fetchCustomerBehavior,
    fetchDashboardMetrics,
    sendChatMessage,
    fetchChatHistory,
    clearError,
    refreshAll,
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};

// Custom hook to use AI context
export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

// Specialized hooks for specific AI features
export const usePredictions = () => {
  const { predictions, loading, fetchPredictions, createPrediction, updatePredictionAccuracy } = useAI();
  return { predictions, loading: loading.predictions, fetchPredictions, createPrediction, updatePredictionAccuracy };
};

export const useDiagnostics = () => {
  const { diagnostics, loading, performDiagnostic, fetchDiagnostics, rateDiagnostic } = useAI();
  return { diagnostics, loading: loading.diagnostics, performDiagnostic, fetchDiagnostics, rateDiagnostic };
};

export const useBusinessIntelligence = () => {
  const { businessIntelligence, loading, fetchBusinessIntelligence, fetchCostOptimization, fetchServicePatterns, fetchProfitabilityInsights, fetchCustomerBehavior } = useAI();
  return { 
    businessIntelligence, 
    loading: loading.businessIntelligence, 
    fetchBusinessIntelligence, 
    fetchCostOptimization, 
    fetchServicePatterns, 
    fetchProfitabilityInsights, 
    fetchCustomerBehavior 
  };
};

export const useAIChat = () => {
  const { chatHistory, loading, sendChatMessage, fetchChatHistory } = useAI();
  return { chatHistory, loading: loading.chat, sendChatMessage, fetchChatHistory };
};
