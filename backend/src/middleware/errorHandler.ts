import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle different types of errors
const handleCastErrorDB = (err: mongoose.Error.CastError): CustomError => {
  const message = `Geçersiz ${err.path}: ${err.value}`;
  return new CustomError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError): CustomError => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Bu ${value} zaten kullanılıyor. Lütfen farklı bir değer deneyin.`;
  return new CustomError(message, 400);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError): CustomError => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Geçersiz veri girişi: ${errors.join('. ')}`;
  return new CustomError(message, 400);
};

const handleJWTError = (): CustomError => {
  return new CustomError('Geçersiz token. Lütfen tekrar giriş yapın.', 401);
};

const handleJWTExpiredError = (): CustomError => {
  return new CustomError('Token süresi dolmuş. Lütfen tekrar giriş yapın.', 401);
};

// Send error response in development
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error response in production
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Bir şeyler yanlış gitti!'
    });
  }
};

// Global error handling middleware
export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err as mongoose.Error.CastError);
    }
    
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err as MongoError);
    }
    
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err as mongoose.Error.ValidationError);
    }
    
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err: Error) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err: Error) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};

// Async error wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(`Bu route bulunamadı: ${req.originalUrl}`, 404);
  next(err);
};
