'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface BrandButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function BrandButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}: BrandButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Variant styles
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #3b82f6, #ec4899)',
      hoverGlow: '0 0 30px rgba(59, 130, 246, 0.4)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #1a365d, #3b82f6)',
      hoverGlow: '0 0 30px rgba(26, 54, 93, 0.4)'
    },
    accent: {
      background: 'linear-gradient(135deg, #06b6d4, #ec4899)',
      hoverGlow: '0 0 30px rgba(6, 182, 212, 0.4)'
    }
  };

  // Size styles
  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    // Hover animation
    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClick = () => {
    if (disabled || loading) return;

    // Click animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }

    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-lg font-semibold text-white
        transition-all duration-300 ease-out
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background: variantStyles[variant].background,
        boxShadow: isHovered ? variantStyles[variant].hoverGlow : 'none',
        transform: 'translateZ(0)' // GPU acceleration
      }}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
        style={{
          animation: isHovered ? 'shimmer 0.6s ease-out' : 'none'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-200 hover:opacity-10" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
}

// Specialized button variants
export function CTAButton({ children, ...props }: Omit<BrandButtonProps, 'variant'>) {
  return (
    <BrandButton variant="primary" size="large" {...props}>
      {children}
    </BrandButton>
  );
}

export function SecondaryButton({ children, ...props }: Omit<BrandButtonProps, 'variant'>) {
  return (
    <BrandButton variant="secondary" {...props}>
      {children}
    </BrandButton>
  );
}

export function AccentButton({ children, ...props }: Omit<BrandButtonProps, 'variant'>) {
  return (
    <BrandButton variant="accent" {...props}>
      {children}
    </BrandButton>
  );
}
