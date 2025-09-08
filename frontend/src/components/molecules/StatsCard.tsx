import React from 'react';
import { LucideIcon } from 'lucide-react';
import Card from '../atoms/Card';
import Icon from '../atoms/Icon';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo' | 'pink' | 'gray';
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  className?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  change,
  className = '',
  onClick
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    red: 'bg-red-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    pink: 'bg-pink-500 text-white',
    gray: 'bg-gray-500 text-white'
  };

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const iconColorClass = colorClasses[color];
  const changeColorClass = change ? changeColorClasses[change.type] : '';

  return (
    <Card 
      className={`${className}`} 
      hover={!!onClick}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p className={`text-sm ${changeColorClass}`}>
              {change.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColorClass}`}>
          <Icon icon={icon} size="lg" color="white" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
