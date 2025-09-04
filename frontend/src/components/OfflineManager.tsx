'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudOff, 
  Sync, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';

interface OfflineData {
  id: string;
  type: 'vehicle' | 'appointment' | 'workorder' | 'customer';
  data: any;
  timestamp: number;
  synced: boolean;
}

interface OfflineManagerProps {
  onSync?: (data: OfflineData[]) => Promise<void>;
  onRetry?: () => void;
}

export default function OfflineManager({ onSync, onRetry }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data from localStorage
    loadOfflineData();

    // Check for background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('background-sync');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const stored = localStorage.getItem('ototakibim_offline_data');
      if (stored) {
        const data = JSON.parse(stored);
        setOfflineData(data);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const saveOfflineData = (data: OfflineData[]) => {
    try {
      localStorage.setItem('ototakibim_offline_data', JSON.stringify(data));
      setOfflineData(data);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const addOfflineData = (type: OfflineData['type'], data: any) => {
    const newItem: OfflineData = {
      id: `${type}_${Date.now()}`,
      type,
      data,
      timestamp: Date.now(),
      synced: false
    };

    const updatedData = [...offlineData, newItem];
    saveOfflineData(updatedData);
  };

  const syncOfflineData = async () => {
    if (!isOnline || offlineData.length === 0) return;

    setIsSyncing(true);
    try {
      const unsyncedData = offlineData.filter(item => !item.synced);
      
      if (onSync) {
        await onSync(unsyncedData);
      }

      // Mark as synced
      const updatedData = offlineData.map(item => ({
        ...item,
        synced: true
      }));

      saveOfflineData(updatedData);
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearSyncedData = () => {
    const unsyncedData = offlineData.filter(item => !item.synced);
    saveOfflineData(unsyncedData);
  };

  const getTypeLabel = (type: OfflineData['type']) => {
    switch (type) {
      case 'vehicle': return 'Araç';
      case 'appointment': return 'Randevu';
      case 'workorder': return 'İş Emri';
      case 'customer': return 'Müşteri';
      default: return 'Veri';
    }
  };

  const getTypeIcon = (type: OfflineData['type']) => {
    switch (type) {
      case 'vehicle': return '🚗';
      case 'appointment': return '📅';
      case 'workorder': return '🔧';
      case 'customer': return '👤';
      default: return '📄';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <Wifi className="w-6 h-6 text-green-600" />
          ) : (
            <WifiOff className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            </h3>
            <p className="text-sm text-gray-600">
              {isOnline ? 'Bağlantı aktif' : 'İnternet bağlantısı yok'}
            </p>
          </div>
        </div>
        
        {isOnline && offlineData.some(item => !item.synced) && (
          <button
            onClick={syncOfflineData}
            disabled={isSyncing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSyncing ? (
              <Sync className="w-4 h-4 animate-spin" />
            ) : (
              <Cloud className="w-4 h-4" />
            )}
            <span>{isSyncing ? 'Senkronize Ediliyor...' : 'Senkronize Et'}</span>
          </button>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Veri</p>
              <p className="text-xl font-bold text-gray-900">{offlineData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-xl font-bold text-gray-900">
                {offlineData.filter(item => !item.synced).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Senkronize</p>
              <p className="text-xl font-bold text-gray-900">
                {offlineData.filter(item => item.synced).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Sync Info */}
      {lastSync && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-800">
              Son senkronizasyon: {lastSync.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>
      )}

      {/* Offline Data List */}
      {offlineData.length > 0 ? (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Çevrimdışı Veriler</h4>
          <div className="space-y-3">
            {offlineData.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  item.synced ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getTypeLabel(item.type)} Verisi
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTimestamp(item.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.synced ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Senkronize</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Bekliyor</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {offlineData.some(item => item.synced) && (
            <div className="mt-4 text-center">
              <button
                onClick={clearSyncedData}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Senkronize edilmiş verileri temizle
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <CloudOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Çevrimdışı veri yok</h4>
          <p className="text-gray-600">
            Tüm verileriniz senkronize edilmiş durumda
          </p>
        </div>
      )}

      {/* Offline Tips */}
      {!isOnline && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Çevrimdışı Mod</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Yeni veriler otomatik olarak çevrimdışı kaydedilir</li>
                <li>• İnternet bağlantısı geri geldiğinde otomatik senkronize edilir</li>
                <li>• Mevcut verilerinizi görüntülemeye devam edebilirsiniz</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}