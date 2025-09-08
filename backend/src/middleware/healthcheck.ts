import { Request, Response } from 'express';

export const healthcheck = (req: Request, res: Response) => {
  const health = {
    status: 'OK',
    uptime: process.uptime(),
    message: 'OtoTakibim Backend is running',
    timestamp: Date.now(),
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      external: Math.round(process.memoryUsage().external / 1024 / 1024) + ' MB'
    },
    version: process.env.npm_package_version || '1.0.0'
  };
  
  res.status(200).json(health);
};

export const detailedHealthcheck = (req: Request, res: Response) => {
  const health = {
    status: 'OK',
    uptime: process.uptime(),
    message: 'OtoTakibim Backend detailed health check',
    timestamp: Date.now(),
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    version: process.env.npm_package_version || '1.0.0',
    pid: process.pid,
    uptimeFormatted: {
      days: Math.floor(process.uptime() / 86400),
      hours: Math.floor((process.uptime() % 86400) / 3600),
      minutes: Math.floor((process.uptime() % 3600) / 60),
      seconds: Math.floor(process.uptime() % 60)
    }
  };
  
  res.status(200).json(health);
};
