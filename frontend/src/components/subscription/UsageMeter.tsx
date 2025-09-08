import React from 'react';
import { SubscriptionInfo } from '../../services/subscriptionService';

interface UsageMeterProps {
  subscription: SubscriptionInfo;
  className?: string;
}

const UsageMeter: React.FC<UsageMeterProps> = ({ subscription, className = '' }) => {
  const formatUsagePercentage = (current: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    return Math.round((current / limit) * 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsageText = (current: number, limit: number): string => {
    if (limit === -1) return `${current.toLocaleString()} / Sınırsız`;
    return `${current.toLocaleString()} / ${limit.toLocaleString()}`;
  };

  const usageItems = [
    {
      label: 'İş Emirleri',
      current: subscription.usage.workOrders,
      limit: subscription.limits.workOrders,
      icon: '📋'
    },
    {
      label: 'Kullanıcılar',
      current: subscription.usage.users,
      limit: subscription.limits.users,
      icon: '👥'
    },
    {
      label: 'Depolama',
      current: subscription.usage.storage,
      limit: subscription.limits.storage,
      icon: '💾',
      format: (value: number) => value < 1024 ? `${value} MB` : `${(value / 1024).toFixed(1)} GB`
    },
    {
      label: 'API Çağrıları',
      current: subscription.usage.apiCalls,
      limit: subscription.limits.apiCalls,
      icon: '🔌'
    }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Kullanım Durumu</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          subscription.isWithinLimits 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {subscription.isWithinLimits ? 'Limitler İçinde' : 'Limit Aşıldı'}
        </div>
      </div>

      <div className="space-y-4">
        {usageItems.map((item, index) => {
          const percentage = formatUsagePercentage(item.current, item.limit);
          const color = getUsageColor(percentage);
          const text = item.format 
            ? `${item.format(item.current)} / ${item.limit === -1 ? 'Sınırsız' : item.format(item.limit)}`
            : getUsageText(item.current, item.limit);

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm text-gray-600">{text}</span>
              </div>
              
              {item.limit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              )}
              
              {item.limit !== -1 && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>%{percentage}</span>
                  {percentage >= 90 && (
                    <span className="text-red-600 font-medium">Limit yaklaşıyor!</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Plan Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Mevcut Plan</p>
            <p className="font-semibold text-gray-900 capitalize">{subscription.plan}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Durum</p>
            <p className={`font-semibold capitalize ${
              subscription.status === 'active' ? 'text-green-600' :
              subscription.status === 'trial' ? 'text-blue-600' :
              subscription.status === 'cancelled' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {subscription.status === 'active' ? 'Aktif' :
               subscription.status === 'trial' ? 'Deneme' :
               subscription.status === 'cancelled' ? 'İptal Edildi' :
               'Askıya Alındı'}
            </p>
          </div>
        </div>
        
        {subscription.status === 'trial' && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Deneme süresi:</strong> {new Date(subscription.expiresAt).toLocaleDateString('tr-TR')} tarihinde sona eriyor
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageMeter;
