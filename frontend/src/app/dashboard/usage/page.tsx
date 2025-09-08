'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { UsageDashboard } from '@/components/usage/UsageDashboard';
import { UsageAlerts } from '@/components/usage/UsageAlerts';
import { UsageStatistics } from '@/components/usage/UsageStatistics';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

type TabType = 'dashboard' | 'alerts' | 'statistics';

export default function UsagePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bar-chart-3' },
    { id: 'alerts', label: 'Uyarılar', icon: 'alert-triangle' },
    { id: 'statistics', label: 'İstatistikler', icon: 'trending-up' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UsageDashboard />;
      case 'alerts':
        return <UsageAlerts />;
      case 'statistics':
        return <UsageStatistics />;
      default:
        return <UsageDashboard />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kullanım Yönetimi</h1>
            <p className="text-gray-600">API kullanımı, limitler ve performans takibi</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className="flex items-center space-x-2 px-1 py-4 border-b-2 border-transparent hover:border-gray-300"
              >
                <Icon name={tab.icon as any} className="h-4 w-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
