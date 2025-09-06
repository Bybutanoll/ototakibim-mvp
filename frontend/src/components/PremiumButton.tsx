'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
  gradient?: boolean;
  glow?: boolean;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  fullWidth = false,
  gradient = false,
  glow = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    font-semibold transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-3 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };

  const variantClasses = {
    primary: gradient
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500'
      : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:ring-blue-500',
    secondary: gradient
      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500'
      : 'bg-green-600 text-white shadow-md hover:bg-green-700 focus:ring-green-500',
    outline: 'bg-transparent text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: gradient
      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500'
      : 'bg-red-600 text-white shadow-md hover:bg-red-700 focus:ring-red-500',
  };

  const glowClasses = glow ? 'shadow-glow hover:shadow-glow-lg' : '';

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${glowClasses}
    ${className}
  `;

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      y: -1,
    },
    tap: { 
      scale: 0.98,
    },
  };

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || isLoading}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'linear',
        }}
      />

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </motion.div>
      )}

      {/* Normal State */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2"
        >
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </motion.div>
      )}
    </motion.button>
  );
};

// Button Group Component
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  className = '',
}) => {
  const orientationClasses = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
    md: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    lg: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
  };

  return (
    <div className={`inline-flex ${orientationClasses} ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

// Icon Button Component
export interface IconButtonProps extends Omit<PremiumButtonProps, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5',
  };

  return (
    <PremiumButton
      size={size}
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
    </PremiumButton>
  );
};

// Floating Action Button
export interface FABProps extends Omit<PremiumButtonProps, 'children'> {
  icon: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  'aria-label': string;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  position = 'bottom-right',
  className = '',
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <motion.div
      className={positionClasses[position]}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <PremiumButton
        variant="primary"
        size="lg"
        gradient
        glow
        className={`rounded-full shadow-2xl ${className}`}
        {...props}
      >
        {icon}
      </PremiumButton>
    </motion.div>
  );
};

export default PremiumButton;
