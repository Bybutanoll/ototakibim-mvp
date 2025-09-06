'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Button Loading Component
interface ButtonLoadingProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  loadingText = 'Yükleniyor...',
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center
        transition-all duration-200
        ${isLoading ? 'cursor-not-allowed opacity-75' : ''}
        ${className}
      `}
    >
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
};

// Spinner Component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-blue-500',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} ${color}
          border-2 border-current border-t-transparent
          rounded-full animate-spin
        `}
      />
    </div>
  );
};

// Skeleton Components
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 mb-2 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 border rounded-lg ${className}`}>
    <Skeleton className="w-16 h-16 rounded-full mb-4" />
    <SkeletonText lines={2} className="mb-4" />
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

// Vehicle Card Skeleton
export const VehicleCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-lg border shadow-sm ${className}`}>
    <div className="flex items-start space-x-4">
      <Skeleton className="w-20 h-20 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-4 w-16 mb-4" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Table Loading Row
export const TableLoadingRow: React.FC<{ columns: number; className?: string }> = ({
  columns,
  className = '',
}) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Full Page Loading
export const FullPageLoading: React.FC<{ message?: string }> = ({ 
  message = 'Yükleniyor...' 
}) => (
  <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-4"
      >
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 text-lg font-medium"
      >
        {message}
      </motion.p>
    </div>
  </div>
);

// Inline Loading
export const InlineLoading: React.FC<{ message?: string; className?: string }> = ({
  message = 'Yükleniyor...',
  className = '',
}) => (
  <div className={`flex items-center justify-center py-8 ${className}`}>
    <div className="flex items-center space-x-3">
      <Spinner size="md" />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

// Loading Overlay
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}> = ({ isLoading, children, message = 'Yükleniyor...', className = '' }) => (
  <div className={`relative ${className}`}>
    {children}
    {isLoading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
      </motion.div>
    )}
  </div>
);

// Pulse Loading Animation
export const PulseLoading: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className={`bg-gray-200 rounded ${className}`}
  />
);

// Shimmer Loading Effect
export const ShimmerLoading: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
    <div className="bg-gray-200 h-full w-full" />
  </div>
);

// Loading States Hook
export const useLoadingState = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
};

// CSS for shimmer animation (add to your global CSS)
export const shimmerCSS = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;
