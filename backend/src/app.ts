import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import workOrderRoutes from './routes/workOrder';
import obdRoutes from './routes/obd';
import blockchainRoutes from './routes/blockchain';
import arvrRoutes from './routes/arvr';
import paymentRoutes from './routes/payment';
import aiRoutes from './routes/ai';
import customerRoutes from './routes/customers';
import maintenanceRoutes from './routes/maintenance';
import inventoryRoutes from './routes/inventory';
import biRoutes from './routes/bi';
import serviceRoutes from './routes/services';
import appointmentRoutes from './routes/appointments';
import paymentRoutes from './routes/payments';
import reportRoutes from './routes/reports';
import {
  securityHeaders,
  corsOptions,
  sanitizeInput,
  sqlInjectionProtection,
  xssProtection,
  requestLogger,
  errorHandler,
  fileUploadSecurity,
  requestSizeLimit,
  apiRateLimit,
  authRateLimit,
  uploadRateLimit
} from './middleware/security';
import { 
  globalErrorHandler, 
  notFound, 
  handleUnhandledRejection, 
  handleUncaughtException 
} from './middleware/errorHandler';

dotenv.config();

const app = express();

// Trust proxy for Render.com
app.set('trust proxy', 1);

// Security Middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('combined'));
app.use(requestLogger);
app.use(requestSizeLimit);
app.use(sanitizeInput);
app.use(sqlInjectionProtection);
app.use(xssProtection);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
app.use('/api', apiRateLimit);
app.use('/api/auth', authRateLimit);
app.use('/api/upload', uploadRateLimit);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'OtoTakibim Backend API çalışıyor',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      workOrders: '/api/work-orders',
      obd: '/api/obd',
      blockchain: '/api/blockchain',
      arvr: '/api/arvr',
      payment: '/api/payment'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'OtoTakibim API çalışıyor',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global OPTIONS handler for CORS preflight
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.status(200).end();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/obd', obdRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/arvr', arvrRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', maintenanceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/bi', biRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use('*', notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
