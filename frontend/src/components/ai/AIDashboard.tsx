'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Users, 
  Wrench, 
  BarChart3,
  RefreshCw,
  Zap,
  Target,
  Shield
} from 'lucide-react';
import PremiumCard, { StatsCard } from '../PremiumCard';
import PremiumButton from '../PremiumButton';
import { useAI } from '../../hooks/useAI';
import { AIDashboardMetrics } from '../../services/aiService';

const AIDashboard: React.FC = () => {
  const { dashboardMetrics, loading, fetchDashboardMetrics, refreshAll } = useAI();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardMetrics();
    const interval = setInterval(() => {
      fetchDashboardMetrics();
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [fetchDashboardMetrics]);

  const handleRefresh = async () => {
    await refreshAll();
    setLastUpdated(new Date());
  };

  if (loading.dashboard) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">AI Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!dashboardMetrics) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Dashboard Hazırlanıyor</h3>
        <p className="text-gray-600 mb-4">AI sistemleri başlatılıyor, lütfen bekleyin...</p>
        <PremiumButton onClick={handleRefresh} variant="outline">
          Yenile
        </PremiumButton>
      </div>
    );
  }

  const stats = [
    {
      title: 'Toplam Tahmin',
      value: dashboardMetrics.predictions.total.toString(),
      change: dashboardMetrics.predictions.accuracy,
      changeType: 'increase' as const,
      icon: Brain,
      color: 'blue' as const,
      description: `%${(dashboardMetrics.predictions.accuracy * 100).toFixed(1)} doğruluk oranı`
    },
    {
      title: 'Yüksek Güven',
      value: dashboardMetrics.predictions.highConfidence.toString(),
      change: (dashboardMetrics.predictions.highConfidence / dashboardMetrics.predictions.total * 100),
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'green' as const,
      description: 'Yüksek güvenilirlikli tahminler'
    },
    {
      title: 'Kritik Uyarılar',
      value: dashboardMetrics.predictions.criticalAlerts.toString(),
      change: 0,
      changeType: 'increase' as const,
      icon: AlertTriangle,
      color: 'red' as const,
      description: 'Acil müdahale gereken durumlar'
    },
    {
      title: 'Toplam Tanı',
      value: dashboardMetrics.diagnostics.total.toString(),
      change: dashboardMetrics.diagnostics.averageConfidence,
      changeType: 'increase' as const,
      icon: Wrench,
      color: 'purple' as const,
      description: `%${(dashboardMetrics.diagnostics.averageConfidence * 100).toFixed(1)} ortalama güven`
    },
    {
      title: 'Başarılı Tanı',
      value: dashboardMetrics.diagnostics.successful.toString(),
      change: (dashboardMetrics.diagnostics.successful / dashboardMetrics.diagnostics.total * 100),
      changeType: 'increase' as const,
      icon: Target,
      color: 'green' as const,
      description: 'Doğru tanı konulan vakalar'
    },
    {
      title: 'Maliyet Tasarrufu',
      value: `₺${dashboardMetrics.diagnostics.costSavings.toLocaleString()}`,
      change: 0,
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'green' as const,
      description: 'AI sayesinde tasarruf edilen miktar'
    }
  ];

  const businessStats = [
    {
      title: 'Toplam Tasarruf',
      value: `₺${dashboardMetrics.businessIntelligence.totalSavings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'green' as const,
      description: 'İş zekası önerileri ile tasarruf'
    },
    {
      title: 'Optimizasyon Skoru',
      value: `${dashboardMetrics.businessIntelligence.optimizationScore}/100`,
      icon: BarChart3,
      color: 'blue' as const,
      description: 'Genel optimizasyon performansı'
    },
    {
      title: 'Trend Doğruluğu',
      value: `%${(dashboardMetrics.businessIntelligence.trendAccuracy * 100).toFixed(1)}`,
      icon: Zap,
      color: 'purple' as const,
      description: 'Pazar trendi tahmin doğruluğu'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            AI Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Türkiye'nin ilk AI-destekli oto bakım sistemi
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}
          </div>
          <PremiumButton
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            isLoading={loading.dashboard}
          >
            Yenile
          </PremiumButton>
        </div>
      </div>

      {/* AI Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Sistemleri Aktif</h3>
            <p className="text-gray-600">
              Makine öğrenmesi modelleri çalışıyor ve sürekli öğreniyor
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Çevrimiçi</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
              className="h-full"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Business Intelligence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businessStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 6) * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              className="h-full"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <PremiumCard variant="elevated" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">AI Performans Özeti</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                %{(dashboardMetrics.predictions.accuracy * 100).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Tahmin Doğruluğu</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${dashboardMetrics.predictions.accuracy * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                %{(dashboardMetrics.diagnostics.averageConfidence * 100).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Tanı Güvenilirliği</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${dashboardMetrics.diagnostics.averageConfidence * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                %{(dashboardMetrics.businessIntelligence.optimizationScore).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Optimizasyon Skoru</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${dashboardMetrics.businessIntelligence.optimizationScore}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                %{(dashboardMetrics.businessIntelligence.trendAccuracy * 100).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Trend Doğruluğu</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${dashboardMetrics.businessIntelligence.trendAccuracy * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <PremiumCard variant="elevated" className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PremiumButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => {/* Navigate to predictions */}}
            >
              <Brain className="w-6 h-6" />
              <span className="text-sm">Bakım Tahmini</span>
            </PremiumButton>
            
            <PremiumButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => {/* Navigate to diagnostics */}}
            >
              <Wrench className="w-6 h-6" />
              <span className="text-sm">Akıllı Tanı</span>
            </PremiumButton>
            
            <PremiumButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => {/* Navigate to business intelligence */}}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">İş Zekası</span>
            </PremiumButton>
            
            <PremiumButton
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => {/* Navigate to AI chat */}}
            >
              <Zap className="w-6 h-6" />
              <span className="text-sm">AI Asistan</span>
            </PremiumButton>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default AIDashboard;
