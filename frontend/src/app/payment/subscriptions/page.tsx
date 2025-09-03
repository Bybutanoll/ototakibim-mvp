'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { useProtectedRoute } from '@/contexts/AuthContext';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Eye,
  Clock,
  Zap,
  Building,
  Users,
  Shield,
  BarChart3,
  Globe,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const { state: authState } = useAuth();
  const { 
    state: paymentState, 
    createSubscription, 
    cancelSubscription, 
    updateSubscription,
    getSubscriptions,
    clearError 
  } = usePayment();
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Protected route hook
  useProtectedRoute();

  useEffect(() => {
    if (authState.isAuthenticated) {
      getSubscriptions();
    }
  }, [authState.isAuthenticated, getSubscriptions]);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Küçük işletmeler için temel özellikler',
      price: 99,
      features: [
        '5 araç takibi',
        'Temel raporlama',
        'Email bildirimleri',
        'Mobil uygulama',
        '7/24 destek',
        'Temel AI asistan'
      ],
      icon: Zap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Büyüyen işletmeler için gelişmiş özellikler',
      price: 199,
      features: [
        '25 araç takibi',
        'Gelişmiş raporlama',
        'SMS + Email bildirimleri',
        'Mobil uygulama',
        '7/24 öncelikli destek',
        'AI asistan + tahminler',
        'API erişimi',
        'Özel entegrasyonlar'
      ],
      icon: Building,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Büyük işletmeler için kurumsal çözümler',
      price: 399,
      features: [
        'Sınırsız araç takibi',
        'Özel raporlama',
        'Tüm bildirim kanalları',
        'Mobil uygulama',
        '7/24 VIP destek',
        'AI asistan + ML',
        'Tam API erişimi',
        'Özel entegrasyonlar',
        'White-label çözümler',
        'Özel eğitimler'
      ],
      icon: Users,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const currentSubscription = paymentState.subscriptions[0]; // Assuming single subscription for now

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true);
    try {
      await updateSubscription(currentSubscription?.id || '', { planId });
      setShowUpgradeModal(false);
      getSubscriptions();
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Aboneliğinizi iptal etmek istediğinizden emin misiniz? Dönem sonuna kadar hizmet almaya devam edeceksiniz.')) {
      try {
        await cancelSubscription(currentSubscription?.id || '');
        getSubscriptions();
      } catch (error) {
        console.error('Cancel error:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'canceled':
        return 'İptal Edildi';
      case 'past_due':
        return 'Gecikmiş Ödeme';
      case 'trialing':
        return 'Deneme Süresi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getNextBillingDate = (currentPeriodEnd: string) => {
    const date = new Date(currentPeriodEnd);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Abonelikler</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Dashboard'a Dön
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Abonelik Yönetimi
          </h1>
          <p className="text-gray-600">
            Mevcut aboneliğinizi görüntüleyin, planınızı değiştirin ve faturalarınızı yönetin
          </p>
        </motion.div>

        {/* Current Subscription */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          {currentSubscription ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Mevcut Abonelik
                  </h2>
                  <p className="text-gray-600">
                    Abonelik detaylarınız ve sonraki fatura bilgileri
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentSubscription.status)}`}>
                  {getStatusText(currentSubscription.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Sonraki Fatura</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {getNextBillingDate(currentSubscription.currentPeriodEnd)}
                  </p>
                  <p className="text-blue-700 text-sm">
                    {currentSubscription.amount} ₺
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold text-green-900">Plan</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {currentSubscription.planName}
                  </p>
                  <p className="text-green-700 text-sm">
                    {currentSubscription.interval}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Ödeme Yöntemi</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {currentSubscription.paymentMethod?.cardNumber || 'N/A'}
                  </p>
                  <p className="text-purple-700 text-sm">
                    {currentSubscription.paymentMethod?.cardholderName || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <ArrowUp className="h-5 w-5" />
                  <span>Planı Değiştir</span>
                </button>

                {currentSubscription.status === 'active' && (
                  <button
                    onClick={handleCancel}
                    className="border-2 border-red-300 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span>Aboneliği İptal Et</span>
                  </button>
                )}

                <Link
                  href="/payment/invoices"
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Faturaları Görüntüle</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Henüz aboneliğiniz bulunmuyor
              </h3>
              <p className="text-gray-600 mb-6">
                Bir plan seçerek OtoTakibim'in tüm özelliklerinden yararlanmaya başlayın
              </p>
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Plan Seç
              </Link>
            </div>
          )}
        </motion.div>

        {/* Plan Comparison */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Plan Karşılaştırması
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                    currentSubscription?.planId === plan.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {currentSubscription?.planId === plan.id && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                        Mevcut Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <div className="text-3xl font-bold text-slate-900">
                      ₺{plan.price}
                      <span className="text-lg text-gray-500 font-normal">/ay</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {currentSubscription?.planId === plan.id ? (
                    <button
                      disabled
                      className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      Mevcut Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setShowUpgradeModal(true);
                      }}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        currentSubscription?.planId === 'starter' && plan.id === 'professional'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                          : currentSubscription?.planId === 'professional' && plan.id === 'starter'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      }`}
                    >
                      {currentSubscription?.planId === 'starter' && plan.id === 'professional' && (
                        <div className="flex items-center justify-center space-x-2">
                          <ArrowUp className="h-4 w-4" />
                          <span>Yükselt</span>
                        </div>
                      )}
                      {currentSubscription?.planId === 'professional' && plan.id === 'starter' && (
                        <div className="flex items-center justify-center space-x-2">
                          <ArrowDown className="h-4 w-4" />
                          <span>Düşür</span>
                        </div>
                      )}
                      {!currentSubscription?.planId || (currentSubscription?.planId !== 'starter' && plan.id !== 'starter') && (
                        <span>Planı Seç</span>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Billing History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Fatura Geçmişi
              </h2>
              <Link
                href="/payment/invoices"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Tümünü Görüntüle →
              </Link>
            </div>
            
            {paymentState.invoices.length === 0 ? (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Henüz fatura bulunmuyor</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentState.invoices.slice(0, 5).map((invoice, index) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Download className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {invoice.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(invoice.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {invoice.amount} ₺
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Ödendi' : 'Beklemede'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Plan Değişikliği
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedPlan === 'professional' && currentSubscription?.planId === 'starter' 
                  ? 'Starter planından Professional plana yükseltmek istediğinizden emin misiniz?'
                  : selectedPlan === 'starter' && currentSubscription?.planId === 'professional'
                  ? 'Professional planından Starter plana düşürmek istediğinizden emin misiniz?'
                  : 'Plan değişikliği yapmak istediğinizden emin misiniz?'
                }
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleUpgrade(selectedPlan)}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'İşleniyor...' : 'Onayla'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
