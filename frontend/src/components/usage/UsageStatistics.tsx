'use client';

import React, { useState } from 'react';
import { useUsageMonitoring } from '@/contexts/UsageMonitoringContext';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Icon } from '@/components/atoms/Icon';
import { UsageStats } from '@/services/usageMonitoringService';

export const UsageStatistics: React.FC = () => {
  const { stats, isLoading, error, getUsageStats } = useUsageMonitoring();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  const handlePeriodChange = async (period: 'day' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
    await getUsageStats(period);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

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
          <Icon name="alert-circle" className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
        <Button 
          onClick={() => getUsageStats(selectedPeriod)}
          className="mt-2"
          variant="outline"
          size="sm"
        >
          Tekrar Dene
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <Icon name="bar-chart-3" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">İstatistik verileri bulunamadı</p>
      </div>
    );
  }

  const periods = [
    { value: 'day', label: 'Günlük' },
    { value: 'week', label: 'Haftalık' },
    { value: 'month', label: 'Aylık' },
    { value: 'year', label: 'Yıllık' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kullanım İstatistikleri</h2>
          <p className="text-gray-600">Detaylı kullanım analizi ve trendler</p>
        </div>
        <div className="flex space-x-2">
          {periods.map((period) => (
            <Button
              key={period.value}
              onClick={() => handlePeriodChange(period.value as any)}
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              size="sm"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Period Info */}
      <Card className="p-4 bg-blue-50">
        <div className="flex items-center">
          <Icon name="calendar" className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm text-blue-700">
            Dönem: {new Date(stats.startDate).toLocaleDateString('tr-TR')} - {new Date(stats.endDate).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </Card>

      {/* API Calls Statistics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">API Çağrıları</h3>
          <Icon name="activity" className="h-5 w-5 text-blue-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatNumber(stats.apiCalls.total)}
            </div>
            <div className="text-sm text-gray-500">Toplam Çağrı</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.apiCalls.byEndpoint.length}
            </div>
            <div className="text-sm text-gray-500">Farklı Endpoint</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.apiCalls.byUser.length}
            </div>
            <div className="text-sm text-gray-500">Aktif Kullanıcı</div>
          </div>
        </div>

        {/* Top Endpoints */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">En Çok Kullanılan Endpoint'ler</h4>
          <div className="space-y-2">
            {stats.apiCalls.byEndpoint.slice(0, 5).map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {endpoint.method} {endpoint.endpoint}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {endpoint.avgResponseTime}ms
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(endpoint.count)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Work Orders Statistics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">İş Emirleri</h3>
          <Icon name="wrench" className="h-5 w-5 text-green-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(stats.workOrders.total)}
            </div>
            <div className="text-sm text-gray-500">Toplam</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatNumber(stats.workOrders.created)}
            </div>
            <div className="text-sm text-gray-500">Oluşturulan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatNumber(stats.workOrders.completed)}
            </div>
            <div className="text-sm text-gray-500">Tamamlanan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.workOrders.avgProcessingTime}h
            </div>
            <div className="text-sm text-gray-500">Ort. Süre</div>
          </div>
        </div>
      </Card>

      {/* Users & Vehicles Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Kullanıcılar</h3>
            <Icon name="users" className="h-5 w-5 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Toplam</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatNumber(stats.users.total)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Aktif</span>
              <span className="text-lg font-semibold text-green-600">
                {formatNumber(stats.users.active)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Yeni</span>
              <span className="text-lg font-semibold text-blue-600">
                {formatNumber(stats.users.new)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Araçlar</h3>
            <Icon name="car" className="h-5 w-5 text-orange-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Toplam</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatNumber(stats.vehicles.total)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Aktif</span>
              <span className="text-lg font-semibold text-green-600">
                {formatNumber(stats.vehicles.active)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Bakımda</span>
              <span className="text-lg font-semibold text-yellow-600">
                {formatNumber(stats.vehicles.maintenance)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Statistics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performans</h3>
          <Icon name="zap" className="h-5 w-5 text-yellow-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.performance.avgResponseTime}ms
            </div>
            <div className="text-sm text-gray-500">Ort. Yanıt Süresi</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatPercentage(stats.performance.uptime)}
            </div>
            <div className="text-sm text-gray-500">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {formatPercentage(stats.performance.errorRate * 100)}
            </div>
            <div className="text-sm text-gray-500">Hata Oranı</div>
          </div>
        </div>
      </Card>

      {/* Storage Statistics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Depolama</h3>
          <Icon name="hard-drive" className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatBytes(stats.storage.total * 1024 * 1024)}
          </div>
          <div className="text-sm text-gray-500">Toplam Kullanım</div>
        </div>

        <div className="space-y-2">
          {stats.storage.byType.map((type, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-900 capitalize">
                {type.type}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {formatBytes(type.size * 1024 * 1024)}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumber(type.count)} dosya
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
