'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface BrandCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'neon';
  size?: 'small' | 'medium' | 'large';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function BrandCard({
  children,
  variant = 'default',
  size = 'medium',
  hover = true,
  className = '',
  onClick
}: BrandCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Variant styles
  const variantStyles = {
    default: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    gradient: {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1))',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      backdropFilter: 'blur(10px)'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)'
    },
    neon: {
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
    }
  };

  // Size styles
  const sizeStyles = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  useEffect(() => {
    if (!cardRef.current || !hover) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hover]);

  const handleClick = () => {
    if (onClick) {
      // Click animation
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 0.98,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }
      onClick();
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`
        relative rounded-2xl transition-all duration-300 ease-out
        ${sizeStyles[size]}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        ...variantStyles[variant],
        transform: 'translateZ(0)', // GPU acceleration
        boxShadow: isHovered 
          ? '0 20px 40px rgba(59, 130, 246, 0.15)' 
          : '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{
          background: 'linear-gradient(90deg, #3b82f6, #ec4899)',
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease'
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 opacity-60" />
      <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-40" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover glow effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
      )}
    </div>
  );
}

// Specialized card variants
export function FeatureCard({ 
  title, 
  description, 
  icon, 
  ...props 
}: BrandCardProps & {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <BrandCard variant="gradient" {...props}>
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </BrandCard>
  );
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  ...props 
}: BrandCardProps & {
  title: string;
  value: string | number;
  change?: string;
}) {
  return (
    <BrandCard variant="glass" {...props}>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
        {change && (
          <p className="text-sm text-green-600 font-medium">{change}</p>
        )}
      </div>
    </BrandCard>
  );
}

export function TestimonialCard({ 
  quote, 
  author, 
  role, 
  ...props 
}: BrandCardProps & {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <BrandCard variant="neon" {...props}>
      <div className="text-center">
        <div className="mb-4">
          <svg className="w-8 h-8 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <blockquote className="text-gray-300 mb-4 italic">"{quote}"</blockquote>
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </BrandCard>
  );
}
