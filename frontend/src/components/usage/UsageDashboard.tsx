'use client';

import React from 'react';
import { useUsageMonitoring } from '@/contexts/UsageMonitoringContext';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Icon } from '@/components/atoms/Icon';
import { AlertCircle, BarChart3, Activity, RefreshCw, Wrench, Users, HardDrive, RotateCcw } from 'lucide-react';

export const UsageDashboard: React.FC = () => {
  const { dashboard, isLoading, error, getUsageDashboard, resetUsageCounters } = useUsageMonitoring();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon icon={AlertCircle} className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
        <Button 
          onClick={getUsageDashboard}
          className="mt-2"
          variant="outline"
          size="sm"
        >
          Tekrar Dene
        </Button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-8">
        <Icon icon={BarChart3} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Kullanım verileri bulunamadı</p>
      </div>
    );
  }

  const { currentUsage, plan, status } = dashboard;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      trial: 'text-blue-600 bg-blue-100',
      cancelled: 'text-red-600 bg-red-100',
      suspended: 'text-yellow-600 bg-yellow-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Aktif',
      trial: 'Deneme',
      cancelled: 'İptal Edildi',
      suspended: 'Askıda'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPlanText = (plan: string) => {
    const texts = {
      starter: 'Başlangıç',
      professional: 'Profesyonel',
      enterprise: 'Kurumsal'
    };
    return texts[plan as keyof typeof texts] || plan;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanım Dashboard</h1>
          <p className="text-gray-600">Mevcut kullanım durumunuz ve limitleriniz</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
          <Badge variant="outline">
            {getPlanText(plan)}
          </Badge>
        </div>
      </div>

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* API Calls */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icon icon={Activity} className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">API Çağrıları</h3>
            </div>
            <Icon icon={RefreshCw} className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {currentUsage.apiCalls.used.toLocaleString('tr-TR')}
              </span>
              <span className={`text-sm font-medium ${getUsageColor(currentUsage.apiCalls.percentage)}`}>
                {currentUsage.apiCalls.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Limit: {currentUsage.apiCalls.limit === -1 ? 'Sınırsız' : currentUsage.apiCalls.limit.toLocaleString('tr-TR')}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUsageBarColor(currentUsage.apiCalls.percentage)}`}
                style={{ width: `${Math.min(currentUsage.apiCalls.percentage, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Work Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icon icon={Wrench} className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">İş Emirleri</h3>
            </div>
            <Icon icon={RefreshCw} className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {currentUsage.workOrders.used.toLocaleString('tr-TR')}
              </span>
              <span className={`text-sm font-medium ${getUsageColor(currentUsage.workOrders.percentage)}`}>
                {currentUsage.workOrders.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Limit: {currentUsage.workOrders.limit === -1 ? 'Sınırsız' : currentUsage.workOrders.limit.toLocaleString('tr-TR')}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUsageBarColor(currentUsage.workOrders.percentage)}`}
                style={{ width: `${Math.min(currentUsage.workOrders.percentage, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icon icon={Users} className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Kullanıcılar</h3>
            </div>
            <Icon icon={RefreshCw} className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {currentUsage.users.used.toLocaleString('tr-TR')}
              </span>
              <span className={`text-sm font-medium ${getUsageColor(currentUsage.users.percentage)}`}>
                {currentUsage.users.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Limit: {currentUsage.users.limit === -1 ? 'Sınırsız' : currentUsage.users.limit.toLocaleString('tr-TR')}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUsageBarColor(currentUsage.users.percentage)}`}
                style={{ width: `${Math.min(currentUsage.users.percentage, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Storage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icon icon={HardDrive} className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Depolama</h3>
            </div>
            <Icon icon={RefreshCw} className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {currentUsage.storage.used.toLocaleString('tr-TR')} MB
              </span>
              <span className={`text-sm font-medium ${getUsageColor(currentUsage.storage.percentage)}`}>
                {currentUsage.storage.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Limit: {currentUsage.storage.limit === -1 ? 'Sınırsız' : `${currentUsage.storage.limit.toLocaleString('tr-TR')} MB`}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUsageBarColor(currentUsage.storage.percentage)}`}
                style={{ width: `${Math.min(currentUsage.storage.percentage, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={getUsageDashboard}
            variant="outline"
            size="sm"
          >
            <Icon icon={RefreshCw} className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          <Button 
            onClick={resetUsageCounters}
            variant="outline"
            size="sm"
            className="text-orange-600 hover:text-orange-700"
          >
            <Icon icon={RotateCcw} className="h-4 w-4 mr-2" />
            Sayaçları Sıfırla
          </Button>
        </div>
      </div>
    </div>
  );
};
