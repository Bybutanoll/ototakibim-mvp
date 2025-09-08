import express, { Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken, requireTenantRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import SubscriptionService from '../services/subscriptionService';
import { SubscriptionPlan } from '../types/subscription';

const router = express.Router();

// Get all available subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = SubscriptionService.getPlans();
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Planlar alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Get specific plan details
router.get('/plans/:plan', [
  param('plan').isIn(['starter', 'professional', 'enterprise']).withMessage('Geçersiz plan')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { plan } = req.params;
    const planInfo = SubscriptionService.getPlan(plan as SubscriptionPlan);
    
    res.json({
      success: true,
      data: planInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Plan bilgileri alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Get current subscription usage and limits
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const usage = await SubscriptionService.getUsage(tenantId);
    
    res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanım bilgileri alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Check if tenant can perform specific action
router.post('/check-limit', [
  authenticateToken,
  body('type').isIn(['workOrders', 'users', 'storage', 'apiCalls']).withMessage('Geçersiz limit tipi'),
  body('amount').optional().isInt({ min: 1 }).withMessage('Miktar pozitif sayı olmalıdır')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { type, amount = 1 } = req.body;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const canPerform = await SubscriptionService.checkLimit(tenantId, type);
    
    res.json({
      success: true,
      data: {
        canPerform,
        type,
        amount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Limit kontrolü yapılırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Update usage (internal use)
router.post('/update-usage', [
  authenticateToken,
  body('type').isIn(['workOrders', 'users', 'storage', 'apiCalls']).withMessage('Geçersiz limit tipi'),
  body('amount').isInt().withMessage('Miktar sayı olmalıdır')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { type, amount } = req.body;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    await SubscriptionService.updateUsage(tenantId, type, amount);
    
    res.json({
      success: true,
      message: 'Kullanım başarıyla güncellendi'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Kullanım güncellenirken hata oluştu'
    });
  }
});

// Change subscription plan (owner only)
router.post('/change-plan', [
  authenticateToken,
  requireTenantRole('owner'),
  body('plan').isIn(['starter', 'professional', 'enterprise']).withMessage('Geçersiz plan'),
  body('stripeSubscriptionId').optional().isString().withMessage('Stripe subscription ID string olmalıdır')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { plan, stripeSubscriptionId } = req.body;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const updatedTenant = await SubscriptionService.changePlan(
      tenantId, 
      plan as SubscriptionPlan, 
      stripeSubscriptionId
    );
    
    res.json({
      success: true,
      message: 'Plan başarıyla değiştirildi',
      data: {
        plan: updatedTenant.subscription.plan,
        status: updatedTenant.subscription.status,
        expiresAt: updatedTenant.subscription.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Plan değiştirilirken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Cancel subscription (owner only)
router.post('/cancel', [
  authenticateToken,
  requireTenantRole('owner')
], async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    await SubscriptionService.cancelSubscription(tenantId);
    
    res.json({
      success: true,
      message: 'Abonelik başarıyla iptal edildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Abonelik iptal edilirken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Extend trial period (owner only)
router.post('/extend-trial', [
  authenticateToken,
  requireTenantRole('owner'),
  body('days').optional().isInt({ min: 1, max: 30 }).withMessage('Gün sayısı 1-30 arasında olmalıdır')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { days = 7 } = req.body;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const updatedTenant = await SubscriptionService.extendTrial(tenantId, days);
    
    res.json({
      success: true,
      message: `Deneme süresi ${days} gün uzatıldı`,
      data: {
        expiresAt: updatedTenant.subscription.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Deneme süresi uzatılırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Check if tenant has specific feature
router.get('/features/:feature', [
  authenticateToken,
  param('feature').isString().withMessage('Özellik adı gereklidir')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { feature } = req.params;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const hasFeature = await SubscriptionService.hasFeature(tenantId, feature);
    
    res.json({
      success: true,
      data: {
        feature,
        hasFeature
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Özellik kontrolü yapılırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Get all available features for tenant
router.get('/features', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Tenant bilgisi bulunamadı'
      });
    }

    const features = await SubscriptionService.getFeatures(tenantId);
    
    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Özellikler alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Admin routes (super_admin only)
router.get('/admin/analytics', [
  authenticateToken,
  requireTenantRole('super_admin')
], async (req: Request, res: Response) => {
  try {
    const analytics = await SubscriptionService.getAnalytics();
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Analitik veriler alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Get expiring subscriptions (admin only)
router.get('/admin/expiring', [
  authenticateToken,
  requireTenantRole('super_admin'),
  query('days').optional().isInt({ min: 1, max: 30 }).withMessage('Gün sayısı 1-30 arasında olmalıdır')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { days = 7 } = req.query;
    const expiringTenants = await SubscriptionService.getExpiringSubscriptions(Number(days));
    
    res.json({
      success: true,
      data: expiringTenants.map(tenant => ({
        tenantId: tenant.tenantId,
        companyName: tenant.companyName,
        contactEmail: tenant.contactEmail,
        plan: tenant.subscription.plan,
        status: tenant.subscription.status,
        expiresAt: tenant.subscription.expiresAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Süresi dolacak abonelikler alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Suspend subscription (admin only)
router.post('/admin/suspend/:tenantId', [
  authenticateToken,
  requireTenantRole('super_admin'),
  param('tenantId').isString().withMessage('Tenant ID gereklidir'),
  body('reason').optional().isString().withMessage('Sebep string olmalıdır')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { reason } = req.body;

    await SubscriptionService.suspendSubscription(tenantId, reason);
    
    res.json({
      success: true,
      message: 'Abonelik başarıyla askıya alındı'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Abonelik askıya alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Reactivate subscription (admin only)
router.post('/admin/reactivate/:tenantId', [
  authenticateToken,
  requireTenantRole('super_admin'),
  param('tenantId').isString().withMessage('Tenant ID gereklidir')
], validateRequest, async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    await SubscriptionService.reactivateSubscription(tenantId);
    
    res.json({
      success: true,
      message: 'Abonelik başarıyla yeniden aktifleştirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Abonelik yeniden aktifleştirilirken hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

export default router;
