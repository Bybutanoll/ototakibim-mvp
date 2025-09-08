import { Request, Response, NextFunction } from 'express';
import SubscriptionService from '../services/subscriptionService';

// Middleware to check if tenant has specific feature
export const requireFeature = (feature: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;
      
      if (!tenantId) {
        return res.status(401).json({
          success: false,
          message: 'Tenant bilgisi bulunamadı'
        });
      }

      const hasFeature = await SubscriptionService.hasFeature(tenantId, feature);
      
      if (!hasFeature) {
        return res.status(403).json({
          success: false,
          message: `Bu özellik ${feature} planınızda mevcut değil`,
          code: 'FEATURE_NOT_AVAILABLE',
          requiredPlan: getRequiredPlan(feature)
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Özellik kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};

// Middleware to check usage limits before creating resources
export const checkUsageLimit = (type: 'workOrders' | 'users' | 'storage' | 'apiCalls') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;
      
      if (!tenantId) {
        return res.status(401).json({
          success: false,
          message: 'Tenant bilgisi bulunamadı'
        });
      }

      const canPerform = await SubscriptionService.checkLimit(tenantId, type);
      
      if (!canPerform) {
        const usage = await SubscriptionService.getUsage(tenantId);
        const limit = usage.limits[type];
        
        return res.status(403).json({
          success: false,
          message: `${type} limitiniz doldu`,
          code: 'USAGE_LIMIT_EXCEEDED',
          data: {
            type,
            current: usage.usage[type],
            limit: limit === -1 ? 'Sınırsız' : limit,
            plan: usage.plan
          }
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Limit kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};

// Middleware to check if subscription is active
export const requireActiveSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId;
    
    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const usage = await SubscriptionService.getUsage(tenantId);
    
    if (usage.status === 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'Aboneliğiniz iptal edilmiş. Lütfen yeni bir abonelik başlatın.',
        code: 'SUBSCRIPTION_CANCELLED'
      });
    }

    if (usage.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Aboneliğiniz askıya alınmış. Lütfen destek ekibi ile iletişime geçin.',
        code: 'SUBSCRIPTION_SUSPENDED'
      });
    }

    if (usage.status === 'trial' && usage.expiresAt < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Deneme süreniz dolmuş. Lütfen bir plan seçin.',
        code: 'TRIAL_EXPIRED'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Abonelik kontrolü yapılırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Helper function to determine required plan for features
function getRequiredPlan(feature: string): string {
  const featurePlanMap: Record<string, string> = {
    'basic_dashboard': 'Starter',
    'vehicle_management': 'Starter',
    'basic_reports': 'Starter',
    'ai_features': 'Professional',
    'advanced_reports': 'Professional',
    'integrations': 'Professional',
    'sms_notifications': 'Professional',
    'api_access': 'Enterprise',
    'white_label': 'Enterprise',
    'priority_support': 'Enterprise',
    'bulk_import': 'Enterprise',
    'custom_branding': 'Enterprise',
    'advanced_analytics': 'Enterprise',
    'backup_restore': 'Enterprise'
  };

  return featurePlanMap[feature] || 'Professional';
}

// Middleware to track API usage
export const trackApiUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId;
    
    if (tenantId) {
      // Track API call
      await SubscriptionService.updateUsage(tenantId, 'apiCalls', 1);
    }

    next();
  } catch (error) {
    // Don't block the request if usage tracking fails
    console.error('API usage tracking failed:', error);
    next();
  }
};

// Middleware to check storage limits before file upload
export const checkStorageLimit = (fileSizeInMB: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;
      
      if (!tenantId) {
        return res.status(401).json({
          success: false,
          message: 'Tenant bilgisi bulunamadı'
        });
      }

      const usage = await SubscriptionService.getUsage(tenantId);
      const currentStorage = usage.usage.storage;
      const limit = usage.limits.storage;
      
      // Check if adding this file would exceed the limit
      if (limit !== -1 && (currentStorage + fileSizeInMB) > limit) {
        return res.status(403).json({
          success: false,
          message: 'Depolama limitiniz doldu',
          code: 'STORAGE_LIMIT_EXCEEDED',
          data: {
            current: currentStorage,
            limit: limit,
            requested: fileSizeInMB,
            plan: usage.plan
          }
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Depolama limiti kontrolü yapılırken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  };
};
