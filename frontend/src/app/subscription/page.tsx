'use client';

import React, { useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SubscriptionCard from '../../components/subscription/SubscriptionCard';
import UsageMeter from '../../components/subscription/UsageMeter';
import { toast } from 'react-hot-toast';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { subscription, plans, loading, changePlan, cancelSubscription, extendTrial } = useSubscription();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handlePlanChange = async (planName: string) => {
    try {
      setActionLoading(planName);
      await changePlan(planName as 'starter' | 'professional' | 'enterprise');
      toast.success('Plan başarıyla değiştirildi!');
    } catch (error) {
      toast.error('Plan değiştirilirken hata oluştu');
      console.error('Plan change error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Aboneliğinizi iptal etmek istediğinizden emin misiniz?')) {
      try {
        setActionLoading('cancel');
        await cancelSubscription();
        toast.success('Abonelik iptal edildi');
      } catch (error) {
        toast.error('Abonelik iptal edilirken hata oluştu');
        console.error('Cancel subscription error:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleExtendTrial = async () => {
    try {
      setActionLoading('extend');
      await extendTrial(7);
      toast.success('Deneme süresi 7 gün uzatıldı');
    } catch (error) {
      toast.error('Deneme süresi uzatılırken hata oluştu');
      console.error('Extend trial error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Abonelik bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Abonelik Yönetimi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İşletmenizin ihtiyaçlarına en uygun planı seçin ve kullanım durumunuzu takip edin
          </p>
        </div>

        {/* Current Usage */}
        {subscription && (
          <div className="mb-12">
            <UsageMeter subscription={subscription} />
          </div>
        )}

        {/* Trial Extension */}
        {subscription?.status === 'trial' && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Deneme Süreniz Devam Ediyor
                  </h3>
                  <p className="text-blue-700">
                    {new Date(subscription.expiresAt).toLocaleDateString('tr-TR')} tarihinde sona eriyor
                  </p>
                </div>
              </div>
              <button
                onClick={handleExtendTrial}
                disabled={actionLoading === 'extend'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading === 'extend' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  '7 Gün Uzat'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Mevcut Planlar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <SubscriptionCard
                key={plan.name}
                plan={plan}
                currentPlan={subscription?.plan}
                onSelect={handlePlanChange}
                loading={actionLoading === plan.name.toLowerCase()}
              />
            ))}
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Plan Karşılaştırması
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Özellikler
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">Aylık Fiyat</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-6 py-4 text-center text-sm text-gray-900">
                        ₺{plan.price.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">İş Emirleri</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-6 py-4 text-center text-sm text-gray-900">
                        {plan.limits.workOrders === -1 ? 'Sınırsız' : plan.limits.workOrders.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">Kullanıcılar</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-6 py-4 text-center text-sm text-gray-900">
                        {plan.limits.users === -1 ? 'Sınırsız' : plan.limits.users}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">Depolama</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-6 py-4 text-center text-sm text-gray-900">
                        {plan.limits.storage === -1 ? 'Sınırsız' : `${(plan.limits.storage / 1024).toFixed(1)} GB`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">API Çağrıları</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-6 py-4 text-center text-sm text-gray-900">
                        {plan.limits.apiCalls === -1 ? 'Sınırsız' : plan.limits.apiCalls.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Faturalandırma Bilgileri
              </h3>
              <p className="text-gray-600">
                Ödeme yöntemlerinizi yönetin ve faturalarınızı görüntüleyin
              </p>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Ödeme Yöntemleri
            </button>
          </div>
        </div>

        {/* Cancel Subscription */}
        {subscription?.status === 'active' && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Aboneliği İptal Et
                </h3>
                <p className="text-red-700">
                  Aboneliğinizi iptal ederseniz, mevcut dönem sonuna kadar erişiminiz devam edecektir.
                </p>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading === 'cancel'}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading === 'cancel' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'İptal Et'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
