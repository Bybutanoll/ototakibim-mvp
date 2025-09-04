'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings, CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface NotificationSettings {
  maintenanceReminders: boolean;
  appointmentAlerts: boolean;
  systemUpdates: boolean;
  promotionalOffers: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [settings, setSettings] = useState<NotificationSettings>({
    maintenanceReminders: true,
    appointmentAlerts: true,
    systemUpdates: true,
    promotionalOffers: false,
    soundEnabled: true,
    vibrationEnabled: true
  });
  const [isSupported, setIsSupported] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true);
      updatePermissionStatus();
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const updatePermissionStatus = () => {
    if ('Notification' in window) {
      setPermission({
        granted: Notification.permission === 'granted',
        denied: Notification.permission === 'denied',
        default: Notification.permission === 'default'
      });
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      updatePermissionStatus();
      
      if (result === 'granted') {
        // Subscribe to push notifications
        await subscribeToPush();
      }
    }
  };

  const subscribeToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });
        
        // Send subscription to server
        await fetch('/api/push-subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        });
        
        console.log('Push subscription successful');
      } catch (error) {
        console.error('Push subscription failed:', error);
      }
    }
  };

  const sendTestNotification = () => {
    if (permission.granted) {
      new Notification('OtoTakibim Test Bildirimi', {
        body: 'Push bildirimleri başarıyla çalışıyor! 🎉',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'test-notification'
      });
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
  };

  const getPermissionStatus = () => {
    if (permission.granted) return 'granted';
    if (permission.denied) return 'denied';
    return 'default';
  };

  const getStatusColor = () => {
    const status = getPermissionStatus();
    switch (status) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    const status = getPermissionStatus();
    switch (status) {
      case 'granted': return <CheckCircle className="w-5 h-5" />;
      case 'denied': return <AlertCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    const status = getPermissionStatus();
    switch (status) {
      case 'granted': return 'Etkin';
      case 'denied': return 'Engellenmiş';
      default: return 'İzin Bekleniyor';
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">
            Bu tarayıcı push bildirimleri desteklemiyor.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Push Bildirimleri</h3>
            <p className="text-sm text-gray-600">Mobil bildirim ayarlarını yönetin</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Permission Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={getStatusColor()}>
              {getStatusIcon()}
            </div>
            <div>
              <p className="font-medium text-gray-900">Bildirim Durumu</p>
              <p className="text-sm text-gray-600">{getStatusText()}</p>
            </div>
          </div>
          {!permission.granted && !permission.denied && (
            <button
              onClick={requestPermission}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              İzin Ver
            </button>
          )}
        </div>
      </div>

      {/* Test Notification */}
      {permission.granted && (
        <div className="mb-6">
          <button
            onClick={sendTestNotification}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Test Bildirimi Gönder</span>
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Bildirim Ayarları</h4>
          
          <div className="space-y-4">
            {/* Notification Types */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Bildirim Türleri</h5>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bakım Hatırlatmaları</span>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceReminders}
                    onChange={(e) => updateSettings({ maintenanceReminders: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Randevu Uyarıları</span>
                  <input
                    type="checkbox"
                    checked={settings.appointmentAlerts}
                    onChange={(e) => updateSettings({ appointmentAlerts: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sistem Güncellemeleri</span>
                  <input
                    type="checkbox"
                    checked={settings.systemUpdates}
                    onChange={(e) => updateSettings({ systemUpdates: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Promosyon Teklifleri</span>
                  <input
                    type="checkbox"
                    checked={settings.promotionalOffers}
                    onChange={(e) => updateSettings({ promotionalOffers: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Bildirim Tercihleri</h5>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ses</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Titreşim</span>
                  <input
                    type="checkbox"
                    checked={settings.vibrationEnabled}
                    onChange={(e) => updateSettings({ vibrationEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Push Bildirimleri Hakkında</p>
            <p className="text-sm text-blue-700 mt-1">
              Push bildirimleri ile bakım hatırlatmaları, randevu uyarıları ve önemli güncellemeleri 
              anında alabilirsiniz. Bildirimler cihazınızda görüntülenecek ve uygulamayı açmadan 
              bilgi alabileceksiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
