import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | 'white';
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  color = 'gray',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    gray: 'text-gray-500',
    white: 'text-white'
  };

  const baseClasses = 'flex-shrink-0';
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  return (
    <IconComponent
      className={`${baseClasses} ${sizeClass} ${colorClass} ${clickableClass} ${className}`}
      onClick={onClick}
    />
  );
};

export { Icon };
export default Icon;
