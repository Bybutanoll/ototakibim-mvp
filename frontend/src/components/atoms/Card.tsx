import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const baseClasses = 'bg-white rounded-lg';
  const paddingClass = paddingClasses[padding];
  const shadowClass = shadowClasses[shadow];
  const borderClass = border ? 'border border-gray-200' : '';
  const hoverClass = hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClass} ${shadowClass} ${borderClass} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
