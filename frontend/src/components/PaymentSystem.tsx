'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Star, 
  Zap, 
  Crown, 
  Users, 
  BarChart3,
  Download,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Settings,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  description: string;
  maxVehicles: number;
  maxUsers: number;
  aiFeatures: boolean;
  priority: boolean;
  customBranding: boolean;
  apiAccess: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  dueDate: string;
}

export default function PaymentSystem() {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  // API entegrasyonu
  useEffect(() => {
    fetchPlans();
    fetchUserSubscription();
    fetchInvoices();
  }, []);

  const fetchPlans = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/payment/plans`);
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Plans fetch error:', error);
      // Fallback to mock data
      setPlans(mockPlans);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/payment/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUserSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Subscription fetch error:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/payment/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Invoices fetch error:', error);
      // Fallback to mock data
      setInvoices(mockInvoices);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Lütfen önce giriş yapın');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/payment/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          interval: billingInterval
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Abonelik başarıyla oluşturuldu!');
        fetchUserSubscription();
        fetchInvoices();
      } else {
        alert(data.message || 'Abonelik oluşturulamadı');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Aboneliğinizi iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/payment/subscription`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Abonelik iptal edildi');
        fetchUserSubscription();
      } else {
        alert(data.message || 'Abonelik iptal edilemedi');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      alert('Bir hata oluştu');
    }
  };

  // Mock data for fallback
  const mockPlans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingInterval === 'month' ? 99 : 990,
      currency: '₺',
      interval: billingInterval,
      description: 'Küçük işletmeler için temel özellikler',
      maxVehicles: 10,
      maxUsers: 2,
      aiFeatures: true,
      priority: false,
      customBranding: false,
      apiAccess: false,
      features: [
        '10 araç takibi',
        '2 kullanıcı',
        'AI destekli analiz',
        'Temel raporlar',
        'E-posta desteği',
        'Mobil uygulama'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: billingInterval === 'month' ? 199 : 1990,
      currency: '₺',
      interval: billingInterval,
      description: 'Orta ölçekli işletmeler için gelişmiş özellikler',
      maxVehicles: 50,
      maxUsers: 5,
      aiFeatures: true,
      priority: true,
      customBranding: false,
      apiAccess: false,
      popular: true,
      features: [
        '50 araç takibi',
        '5 kullanıcı',
        'AI destekli analiz',
        'Gelişmiş raporlar',
        'Öncelikli destek',
        'WhatsApp entegrasyonu',
        'Fatura sistemi',
        'SMS bildirimleri'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingInterval === 'month' ? 399 : 3990,
      currency: '₺',
      interval: billingInterval,
      description: 'Büyük işletmeler için tam özellikli çözüm',
      maxVehicles: 999,
      maxUsers: 20,
      aiFeatures: true,
      priority: true,
      customBranding: true,
      apiAccess: true,
      features: [
        'Sınırsız araç takibi',
        '20 kullanıcı',
        'AI destekli analiz',
        'Özel raporlar',
        '7/24 öncelikli destek',
        'Özel marka entegrasyonu',
        'API erişimi',
        'Özel geliştirme',
        'Dedicated hesap yöneticisi'
      ]
    }
  ];

  const mockInvoices: Invoice[] = [
    {
      id: 'INV-001',
      date: '2024-03-15',
      amount: 199,
      status: 'paid',
      description: 'Professional Plan - Mart 2024',
      dueDate: '2024-03-15'
    },
    {
      id: 'INV-002',
      date: '2024-04-15',
      amount: 199,
      status: 'pending',
      description: 'Professional Plan - Nisan 2024',
      dueDate: '2024-04-15'
    },
    {
      id: 'INV-003',
      date: '2024-05-15',
      amount: 199,
      status: 'overdue',
      description: 'Professional Plan - Mayıs 2024',
      dueDate: '2024-05-15'
    }
  ];

  const analytics = {
    totalRevenue: 15980,
    monthlyGrowth: 12.5,
    activeSubscriptions: 156,
    churnRate: 2.1,
    averageRevenue: 128.5,
    topPlans: [
      { name: 'Professional', revenue: 8950, percentage: 56 },
      { name: 'Enterprise', revenue: 4780, percentage: 30 },
      { name: 'Starter', revenue: 2250, percentage: 14 }
    ]
  };

  // Remove duplicate handleSubscribe function

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice: ${invoiceId}`);
    // Generate and download PDF invoice
  };

  const handleSendInvoice = (invoiceId: string) => {
    console.log(`Sending invoice: ${invoiceId}`);
    // Send invoice via email
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle-container">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">OtoTakibim Business</h1>
                  <p className="text-sm text-blue-200">Gelir Yönetimi ve Ödeme Sistemi</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              İşletmenizi Büyütün 💰
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              OtoTakibim ile gelir modelinizi optimize edin, müşteri memnuniyetini artırın ve 
              işletmenizi dijital dünyada öne çıkarın.
            </p>
          </motion.div>

          {/* Business Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 text-blue-400 mr-2" />
              İş Analitikleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-white">₺{analytics.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{analytics.monthlyGrowth}%</span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Aktif Abonelikler</p>
                    <p className="text-2xl font-bold text-white">{analytics.activeSubscriptions}</p>
                    <div className="flex items-center mt-2">
                      <Users className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-blue-400 text-sm">Aktif müşteri</span>
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Ortalama Gelir</p>
                    <p className="text-2xl font-bold text-white">₺{analytics.averageRevenue}</p>
                    <div className="flex items-center mt-2">
                      <BarChart3 className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="text-purple-400 text-sm">Müşteri başına</span>
                    </div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Churn Rate</p>
                    <p className="text-2xl font-bold text-white">{analytics.churnRate}%</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
                      <span className="text-red-400 text-sm">Düşük oran</span>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Current Subscription */}
          {userSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Mevcut Aboneliğiniz: {userSubscription.planName}
                    </h3>
                    <p className="text-blue-200 mb-2">
                      Durum: <span className="text-green-400 font-semibold">{userSubscription.status}</span>
                    </p>
                    <p className="text-blue-200 text-sm">
                      Sonraki ödeme: {new Date(userSubscription.currentPeriodEnd).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">₺{userSubscription.amount}</p>
                    <p className="text-blue-200 text-sm">/{userSubscription.interval === 'month' ? 'ay' : 'yıl'}</p>
                    <button
                      onClick={handleCancelSubscription}
                      className="mt-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Aboneliği İptal Et
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pricing Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Fiyatlandırma Planları
              </h2>
              <p className="text-blue-200 mb-6">
                İşletmenizin ihtiyaçlarına uygun planı seçin
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4">
                <span className={`text-sm ${billingInterval === 'month' ? 'text-white' : 'text-blue-200'}`}>
                  Aylık
                </span>
                <button
                  onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingInterval === 'year' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingInterval === 'year' ? 'text-white' : 'text-blue-200'}`}>
                  Yıllık
                  <span className="ml-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    %20 İndirim
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(plans.length > 0 ? plans : mockPlans).map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 ${
                    plan.popular 
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/25' 
                      : 'border-white/20 hover:border-blue-500/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Crown className="w-4 h-4 mr-1" />
                        En Popüler
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-blue-200 text-sm mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.currency}{plan.price}</span>
                      <span className="text-blue-200">/{billingInterval === 'month' ? 'ay' : 'yıl'}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-blue-200">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? 'İşleniyor...' : (plan.popular ? 'Hemen Başla' : 'Planı Seç')}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Invoice Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CreditCard className="w-6 h-6 text-blue-400 mr-2" />
              Fatura Yönetimi
            </h2>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-blue-200 font-semibold">Fatura No</th>
                      <th className="text-left py-3 px-4 text-blue-200 font-semibold">Tarih</th>
                      <th className="text-left py-3 px-4 text-blue-200 font-semibold">Açıklama</th>
                      <th className="text-left py-3 px-4 text-blue-200 font-semibold">Tutar</th>
                      <th className="text-left py-3 px-4 text-blue-200 font-semibold">Durum</th>
                      <th className="text-left py-3 px-4 text-blue-200 font-semibold">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoices.length > 0 ? invoices : mockInvoices).map((invoice) => (
                      <tr key={invoice.id} className="border-b border-white/10">
                        <td className="py-3 px-4 text-white font-medium">{invoice.id}</td>
                        <td className="py-3 px-4 text-blue-200">
                          {new Date(invoice.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-3 px-4 text-blue-200">{invoice.description}</td>
                        <td className="py-3 px-4 text-white font-semibold">₺{invoice.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' 
                              ? 'bg-green-500/20 text-green-400' 
                              : invoice.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {invoice.status === 'paid' ? 'Ödendi' : 
                             invoice.status === 'pending' ? 'Beklemede' : 'Gecikmiş'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                              title="İndir"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendInvoice(invoice.id)}
                              className="p-1 text-green-400 hover:text-green-300 transition-colors"
                              title="Gönder"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Revenue Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-blue-400 mr-2" />
              Gelir Dağılımı
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Plan Bazında Gelir</h3>
                <div className="space-y-4">
                  {analytics.topPlans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-purple-500' : 'bg-green-500'
                        }`} />
                        <span className="text-blue-200">{plan.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₺{plan.revenue.toLocaleString()}</p>
                        <p className="text-blue-200 text-sm">{plan.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Ödeme Güvenliği</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium">SSL Şifreleme</p>
                      <p className="text-blue-200 text-sm">256-bit güvenlik</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium">PCI DSS Uyumlu</p>
                      <p className="text-blue-200 text-sm">Kredi kartı güvenliği</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Anında İşlem</p>
                      <p className="text-blue-200 text-sm">Gerçek zamanlı ödeme</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
