import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';
import Tenant from '../models/Tenant';

// Redis store for rate limiting (optional, falls back to memory)
let redisStore: any = null;

try {
  const RedisStore = require('rate-limit-redis');
  const Redis = require('ioredis');
  
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  });

  redisStore = new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  });
} catch (error) {
  console.warn('Redis not available, using memory store for rate limiting');
}

// Base rate limiting configuration
const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}) => {
  return rateLimit({
    store: redisStore,
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || {
      status: 'error',
      message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.',
      retryAfter: Math.ceil(options.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    skipFailedRequests: options.skipFailedRequests || false,
    keyGenerator: options.keyGenerator || ((req: Request) => {
      // Use tenant ID if available, otherwise use IP with proper IPv6 handling
      const tenantId = (req as any).user?.tenantId;
      if (tenantId) {
        return `tenant:${tenantId}`;
      }
      // Use ipKeyGenerator helper for proper IPv6 handling
      return ipKeyGenerator(req.ip || 'unknown');
    }),
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        status: 'error',
        message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.',
        retryAfter: Math.ceil(options.windowMs / 1000),
        limit: options.max,
        remaining: 0
      });
    }
  });
};

// Slow down configuration
const createSlowDown = (options: {
  windowMs: number;
  delayAfter: number;
  delayMs: number;
  maxDelayMs?: number;
}) => {
  return slowDown({
    windowMs: options.windowMs,
    delayAfter: options.delayAfter,
    delayMs: () => options.delayMs, // Use function form for v2 compatibility
    maxDelayMs: options.maxDelayMs || options.delayMs * 10,
    keyGenerator: (req: Request) => {
      const tenantId = (req as any).user?.tenantId;
      if (tenantId) {
        return `tenant:${tenantId}`;
      }
      // Use ipKeyGenerator helper for proper IPv6 handling
      return ipKeyGenerator(req.ip || 'unknown');
    }
  });
};

// General API rate limiting
export const generalApiLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes
  message: 'Genel API limiti aşıldı. Lütfen daha sonra tekrar deneyin.'
});

// Authentication rate limiting
export const authLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.'
});

// Password reset rate limiting
export const passwordResetLimiter = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: 'Çok fazla şifre sıfırlama denemesi. Lütfen 1 saat sonra tekrar deneyin.'
});

// Registration rate limiting
export const registrationLimiter = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts per hour
  message: 'Çok fazla kayıt denemesi. Lütfen 1 saat sonra tekrar deneyin.'
});

// File upload rate limiting
export const uploadLimiter = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: 'Çok fazla dosya yükleme. Lütfen 1 saat sonra tekrar deneyin.'
});

// Payment rate limiting
export const paymentLimiter = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
  message: 'Çok fazla ödeme denemesi. Lütfen 1 saat sonra tekrar deneyin.'
});

// Webhook rate limiting
export const webhookLimiter = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 webhook calls per minute
  message: 'Webhook limiti aşıldı.'
});

// Tenant-specific rate limiting
export const tenantRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user?.tenantId;
    if (!tenantId) {
      return next();
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return next();
    }

    // Get tenant's subscription limits
    const limits = tenant.subscription.limits;
    const usage = tenant.usage;

    // Check API call limits
    if (limits.apiCalls !== -1 && usage.apiCalls >= limits.apiCalls) {
      return res.status(429).json({
        status: 'error',
        message: 'API çağrı limitiniz doldu. Lütfen planınızı yükseltin.',
        code: 'API_LIMIT_EXCEEDED',
        limit: limits.apiCalls,
        usage: usage.apiCalls
      });
    }

    // Create dynamic rate limiter based on tenant's plan
    const planLimits = {
      starter: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
      professional: { windowMs: 15 * 60 * 1000, max: 500 }, // 500 requests per 15 minutes
      enterprise: { windowMs: 15 * 60 * 1000, max: 2000 } // 2000 requests per 15 minutes
    };

    const planLimit = planLimits[tenant.subscription.plan as keyof typeof planLimits];
    if (!planLimit) {
      return next();
    }

    const dynamicLimiter = createRateLimit({
      windowMs: planLimit.windowMs,
      max: planLimit.max,
      keyGenerator: () => `tenant:${tenantId}`,
      message: `Plan limitiniz aşıldı. Mevcut plan: ${tenant.subscription.plan}`
    });

    dynamicLimiter(req, res, next);
  } catch (error) {
    console.error('Tenant rate limiter error:', error);
    next();
  }
};

// Slow down for repeated requests
export const generalSlowDown = createSlowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Start delaying after 50 requests
  delayMs: 500, // Add 500ms delay per request
  maxDelayMs: 20000 // Max 20 seconds delay
});

// Strict slow down for auth endpoints
export const authSlowDown = createSlowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Start delaying after 2 requests
  delayMs: 1000, // Add 1 second delay per request
  maxDelayMs: 10000 // Max 10 seconds delay
});

// Usage tracking middleware
export const trackApiUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = (req as any).user?.tenantId;
    if (!tenantId) {
      return next();
    }

    // Track API usage
    await Tenant.findByIdAndUpdate(tenantId, {
      $inc: { 'usage.apiCalls': 1 }
    });

    next();
  } catch (error) {
    console.error('API usage tracking error:', error);
    next();
  }
};

// Request size limiting
export const requestSizeLimiter = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSizeBytes = parseSize(maxSize);

    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        status: 'error',
        message: `İstek boyutu çok büyük. Maksimum boyut: ${maxSize}`,
        maxSize,
        actualSize: formatBytes(contentLength)
      });
    }

    next();
  };
};

// Helper function to parse size strings like "10mb"
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) {
    return 10 * 1024 * 1024; // Default 10MB
  }

  const value = parseFloat(match[1]);
  const unit = match[2];
  return value * units[unit];
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// IP-based rate limiting for anonymous users
export const ipRateLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  keyGenerator: (req: Request) => `ip:${ipKeyGenerator(req.ip || 'unknown')}`,
  message: 'IP bazlı limit aşıldı. Lütfen daha sonra tekrar deneyin.'
});

// Export all rate limiters
export const rateLimiters = {
  general: generalApiLimiter,
  auth: authLimiter,
  passwordReset: passwordResetLimiter,
  registration: registrationLimiter,
  upload: uploadLimiter,
  payment: paymentLimiter,
  webhook: webhookLimiter,
  tenant: tenantRateLimiter,
  ip: ipRateLimiter
};

export const slowDowns = {
  general: generalSlowDown,
  auth: authSlowDown
};
