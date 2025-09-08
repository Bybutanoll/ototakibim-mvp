'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  variant?: 'full' | 'icon' | 'compact' | 'mini';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  animated?: boolean;
  interactive?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
} as const;

const variantMap = {
  full: '/assets/logo/ototakibim-logo.svg',
  icon: '/assets/logo/ototakibim-icon.svg',
  compact: '/assets/logo/ototakibim-compact.svg',
  mini: '/assets/logo/ototakibim-mini.svg',
} as const;

// Fallback logo component
const FallbackLogo = ({ size }: { size: number }) => (
  <div 
    className="bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold"
    style={{ width: size, height: size }}
  >
    <span style={{ fontSize: size * 0.4 }}>OT</span>
  </div>
);

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      variant = 'full',
      size = 'md',
      animated = true,
      interactive = false,
      theme = 'auto',
      className,
      onClick,
      'aria-label': ariaLabel = 'OtoTakibim Logo',
      ...motionProps
    },
    ref
  ) => {
    const logoSize = typeof size === 'number' ? size : sizeMap[size];
    const logoSrc = variantMap[variant];
    
    const baseClasses = cn(
      'relative inline-block select-none',
      interactive && 'cursor-pointer',
      className
    );

    const logoElement = (
      <div
        ref={ref}
        className={baseClasses}
        style={{ width: logoSize, height: logoSize }}
        onClick={interactive ? onClick : undefined}
        role={interactive ? 'button' : 'img'}
        aria-label={ariaLabel}
        tabIndex={interactive ? 0 : undefined}
      >
        <FallbackLogo size={logoSize} />
      </div>
    );

    return logoElement;
  }
);

Logo.displayName = 'Logo';

// Preset variants for common use cases
export const LogoHeader = forwardRef<HTMLDivElement, Omit<LogoProps, 'variant' | 'size'>>(
  (props, ref) => (
    <Logo
      ref={ref}
      variant="compact"
      size="md"
      interactive
      {...props}
    />
  )
);

LogoHeader.displayName = 'LogoHeader';

export const LogoSidebar = forwardRef<HTMLDivElement, Omit<LogoProps, 'variant' | 'size'>>(
  (props, ref) => (
    <Logo
      ref={ref}
      variant="icon"
      size="sm"
      {...props}
    />
  )
);

LogoSidebar.displayName = 'LogoSidebar';

export const LogoLogin = forwardRef<HTMLDivElement, Omit<LogoProps, 'variant' | 'size'>>(
  (props, ref) => (
    <Logo
      ref={ref}
      variant="full"
      size="xl"
      animated
      {...props}
    />
  )
);

LogoLogin.displayName = 'LogoLogin';

export const LogoMobile = forwardRef<HTMLDivElement, Omit<LogoProps, 'variant' | 'size'>>(
  (props, ref) => (
    <Logo
      ref={ref}
      variant="mini"
      size="sm"
      {...props}
    />
  )
);

LogoMobile.displayName = 'LogoMobile';