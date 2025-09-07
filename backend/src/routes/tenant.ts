import express from 'express';
import { tenantMiddleware, requirePermission, checkUsageLimit } from '../middleware/tenant';
import { authenticateToken } from '../middleware/auth';
import Tenant from '../models/Tenant';
import User from '../models/User';

const router = express.Router();

/**
 * Test endpoint to verify multi-tenant system is working
 */
router.get('/test', tenantMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Multi-tenant system is working!',
    tenantId: req.tenantId,
    tenant: {
      companyName: req.tenant?.companyName,
      plan: req.tenant?.subscription?.plan,
      status: req.tenant?.subscription?.status
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Get tenant information
 */
router.get('/info', tenantMiddleware, authenticateToken, (req, res) => {
  res.json({
    success: true,
    tenant: {
      tenantId: req.tenant?.tenantId,
      companyName: req.tenant?.companyName,
      contactEmail: req.tenant?.contactEmail,
      subscription: {
        plan: req.tenant?.subscription?.plan,
        status: req.tenant?.subscription?.status,
        expiresAt: req.tenant?.subscription?.expiresAt,
        limits: req.tenant?.subscription?.limits,
        features: req.tenant?.subscription?.features
      },
      usage: req.tenant?.usage,
      settings: req.tenant?.settings
    }
  });
});

/**
 * Get tenant users
 */
router.get('/users', tenantMiddleware, authenticateToken, requirePermission('manage_users'), async (req, res) => {
  try {
    const users = await User.find({ tenantId: req.tenantId })
      .select('-password -refreshTokens -passwordResetToken -emailVerificationToken')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        tenantRole: user.tenantRole,
        globalRole: user.globalRole,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching tenant users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

/**
 * Create new tenant (for super admin)
 */
router.post('/create', authenticateToken, requirePermission('manage_global_settings'), async (req, res) => {
  try {
    const {
      tenantId,
      companyName,
      contactEmail,
      contactPhone,
      plan = 'starter'
    } = req.body;

    // Validate required fields
    if (!tenantId || !companyName || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID, company name, and contact email are required'
      });
    }

    // Check if tenant already exists
    const existingTenant = await Tenant.findOne({ tenantId });
    if (existingTenant) {
      return res.status(409).json({
        success: false,
        message: 'Tenant with this ID already exists'
      });
    }

    // Create new tenant
    const tenant = new Tenant({
      tenantId,
      companyName,
      contactEmail,
      contactPhone,
      subscription: {
        plan,
        status: 'trial',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
        limits: {
          workOrders: plan === 'starter' ? 50 : plan === 'professional' ? 500 : -1,
          users: plan === 'starter' ? 2 : plan === 'professional' ? 10 : -1,
          storage: plan === 'starter' ? 1000 : plan === 'professional' ? 5000 : -1,
          apiCalls: plan === 'starter' ? 1000 : plan === 'professional' ? 10000 : -1
        },
        features: [] // Will be set by pre-save middleware
      },
      settings: {
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF'
        },
        notifications: {
          sms: false,
          email: true,
          push: true
        },
        business: {
          timezone: 'Europe/Istanbul',
          currency: 'TRY',
          language: 'tr',
          workingHours: {
            start: '09:00',
            end: '18:00',
            days: [1, 2, 3, 4, 5]
          }
        }
      },
      usage: {
        workOrders: 0,
        users: 0,
        storage: 0,
        apiCalls: 0,
        lastReset: new Date()
      },
      isActive: true,
      isVerified: false
    });

    await tenant.save();

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      tenant: {
        tenantId: tenant.tenantId,
        companyName: tenant.companyName,
        contactEmail: tenant.contactEmail,
        subscription: {
          plan: tenant.subscription.plan,
          status: tenant.subscription.status,
          expiresAt: tenant.subscription.expiresAt
        }
      }
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating tenant'
    });
  }
});

/**
 * Update tenant subscription
 */
router.put('/subscription', tenantMiddleware, authenticateToken, requirePermission('manage_billing'), async (req, res) => {
  try {
    const { plan, status } = req.body;

    if (!plan && !status) {
      return res.status(400).json({
        success: false,
        message: 'Plan or status is required'
      });
    }

    const updateData: any = {};
    if (plan) {
      updateData['subscription.plan'] = plan;
    }
    if (status) {
      updateData['subscription.status'] = status;
    }

    const tenant = await Tenant.findOneAndUpdate(
      { tenantId: req.tenantId },
      { $set: updateData },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        plan: tenant.subscription.plan,
        status: tenant.subscription.status,
        expiresAt: tenant.subscription.expiresAt,
        limits: tenant.subscription.limits,
        features: tenant.subscription.features
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription'
    });
  }
});

/**
 * Get usage statistics
 */
router.get('/usage', tenantMiddleware, authenticateToken, requirePermission('view_analytics'), async (req, res) => {
  try {
    const tenant = req.tenant;
    
    res.json({
      success: true,
      usage: {
        workOrders: {
          current: tenant.usage.workOrders,
          limit: tenant.subscription.limits.workOrders,
          percentage: tenant.subscription.limits.workOrders === -1 ? 0 : 
            Math.round((tenant.usage.workOrders / tenant.subscription.limits.workOrders) * 100)
        },
        users: {
          current: tenant.usage.users,
          limit: tenant.subscription.limits.users,
          percentage: tenant.subscription.limits.users === -1 ? 0 : 
            Math.round((tenant.usage.users / tenant.subscription.limits.users) * 100)
        },
        storage: {
          current: tenant.usage.storage,
          limit: tenant.subscription.limits.storage,
          percentage: tenant.subscription.limits.storage === -1 ? 0 : 
            Math.round((tenant.usage.storage / tenant.subscription.limits.storage) * 100)
        },
        apiCalls: {
          current: tenant.usage.apiCalls,
          limit: tenant.subscription.limits.apiCalls,
          percentage: tenant.subscription.limits.apiCalls === -1 ? 0 : 
            Math.round((tenant.usage.apiCalls / tenant.subscription.limits.apiCalls) * 100)
        }
      },
      lastReset: tenant.usage.lastReset
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching usage statistics'
    });
  }
});

/**
 * Test usage limit middleware
 */
router.post('/test-usage', tenantMiddleware, authenticateToken, checkUsageLimit('workOrders'), (req, res) => {
  res.json({
    success: true,
    message: 'Usage limit check passed',
    tenantId: req.tenantId
  });
});

export default router;
