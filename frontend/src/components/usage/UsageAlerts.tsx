'use client';

import React from 'react';
import { useUsageMonitoring } from '@/contexts/UsageMonitoringContext';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Icon } from '@/components/atoms/Icon';
import { UsageAlert } from '@/services/usageMonitoringService';

export const UsageAlerts: React.FC = () => {
  const { alerts, isLoading, error, getUsageAlerts } = useUsageMonitoring();

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-blue-600 bg-blue-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getSeverityText = (severity: string) => {
    const texts = {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
      critical: 'Kritik'
    };
    return texts[severity as keyof typeof texts] || severity;
  };

  const getAlertTypeText = (type: string) => {
    const texts = {
      limit_warning: 'Limit Uyarısı',
      limit_exceeded: 'Limit Aşıldı',
      unusual_activity: 'Olağandışı Aktivite',
      performance_issue: 'Performans Sorunu'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getAlertIcon = (type: string) => {
    const icons = {
      limit_warning: 'alert-triangle',
      limit_exceeded: 'x-circle',
      unusual_activity: 'eye',
      performance_issue: 'zap'
    };
    return icons[type as keyof typeof icons] || 'alert-circle';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner size="md" />
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
          onClick={getUsageAlerts}
          className="mt-2"
          variant="outline"
          size="sm"
        >
          Tekrar Dene
        </Button>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Icon name="check-circle" className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tüm Sistemler Normal</h3>
          <p className="text-gray-500">Şu anda herhangi bir uyarı bulunmuyor</p>
        </div>
      </Card>
    );
  }

  // Group alerts by severity
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium');
  const lowAlerts = alerts.filter(alert => alert.severity === 'low');

  const groupedAlerts = [
    { severity: 'critical', alerts: criticalAlerts, title: 'Kritik Uyarılar' },
    { severity: 'high', alerts: highAlerts, title: 'Yüksek Öncelikli Uyarılar' },
    { severity: 'medium', alerts: mediumAlerts, title: 'Orta Öncelikli Uyarılar' },
    { severity: 'low', alerts: lowAlerts, title: 'Düşük Öncelikli Uyarılar' }
  ].filter(group => group.alerts.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kullanım Uyarıları</h2>
          <p className="text-gray-600">Sistem durumu ve limit uyarıları</p>
        </div>
        <Button 
          onClick={getUsageAlerts}
          variant="outline"
          size="sm"
        >
          <Icon name="refresh-cw" className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      {groupedAlerts.map((group) => (
        <div key={group.severity} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
          <div className="space-y-3">
            {group.alerts.map((alert: UsageAlert) => (
              <Card key={alert.id} className="p-4 border-l-4 border-l-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={getAlertIcon(alert.type)} 
                      className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-500' :
                        alert.severity === 'high' ? 'text-orange-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {getAlertTypeText(alert.type)}
                        </h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {getSeverityText(alert.severity)}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Çözüldü
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="text-xs text-gray-500">
                        {formatDate(alert.createdAt)}
                      </div>
                      {alert.data && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <pre className="text-gray-600">
                            {JSON.stringify(alert.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.resolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Çöz
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Toplam {alerts.length} uyarı - 
            {criticalAlerts.length} kritik, 
            {highAlerts.length} yüksek, 
            {mediumAlerts.length} orta, 
            {lowAlerts.length} düşük
          </div>
          <div className="text-sm text-gray-500">
            Son güncelleme: {new Date().toLocaleString('tr-TR')}
          </div>
        </div>
      </Card>
    </div>
  );
};
