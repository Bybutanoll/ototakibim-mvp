import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = 'flex items-center justify-center font-medium text-white bg-gray-500';
  const sizeClass = sizeClasses[size];
  const shapeClass = shapeClasses[shape];
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${baseClasses} ${sizeClass} ${shapeClass} ${clickableClass}`}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={`${sizeClass} ${shapeClass} object-cover`}
          />
        ) : (
          <span>{name ? getInitials(name) : '?'}</span>
        )}
      </div>
      
      {status && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusClasses[status]} rounded-full border-2 border-white`}
        />
      )}
    </div>
  );
};

export default Avatar;
