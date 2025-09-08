import React from 'react';
import { Check, X } from 'lucide-react';
import { SubscriptionPlan } from '../../services/subscriptionService';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  currentPlan?: string;
  onSelect?: (plan: string) => void;
  loading?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  currentPlan,
  onSelect,
  loading = false
}) => {
  const isCurrentPlan = currentPlan === plan.name.toLowerCase();
  const isPopular = plan.popular;

  return (
    <div className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isCurrentPlan 
        ? 'border-blue-500 ring-2 ring-blue-200' 
        : isPopular 
          ? 'border-purple-500 ring-2 ring-purple-200' 
          : 'border-gray-200 hover:border-gray-300'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            En Popüler
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Mevcut Plan
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">
            {plan.name === 'Starter' && '🚀'}
            {plan.name === 'Professional' && '⭐'}
            {plan.name === 'Enterprise' && '👑'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
          
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">
              ₺{plan.price.toLocaleString()}
            </span>
            <span className="text-gray-600 ml-1">/ay</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Limits */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Plan Limitleri</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">İş Emirleri:</span>
              <span className="font-medium">
                {plan.limits.workOrders === -1 ? 'Sınırsız' : plan.limits.workOrders.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kullanıcılar:</span>
              <span className="font-medium">
                {plan.limits.users === -1 ? 'Sınırsız' : plan.limits.users}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Depolama:</span>
              <span className="font-medium">
                {plan.limits.storage === -1 ? 'Sınırsız' : `${(plan.limits.storage / 1024).toFixed(1)} GB`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Çağrıları:</span>
              <span className="font-medium">
                {plan.limits.apiCalls === -1 ? 'Sınırsız' : plan.limits.apiCalls.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelect?.(plan.name.toLowerCase())}
          disabled={loading || isCurrentPlan}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isCurrentPlan
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isPopular
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Yükleniyor...
            </div>
          ) : isCurrentPlan ? (
            'Mevcut Plan'
          ) : (
            'Planı Seç'
          )}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
