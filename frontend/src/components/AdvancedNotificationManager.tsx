'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Settings,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Edit,
  Trash2,
  Send,
  Clock
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'appointment' | 'maintenance' | 'payment' | 'general';
  title: string;
  body: string;
  icon?: string;
  actions?: NotificationAction[];
  enabled: boolean;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  sound: boolean;
  vibration: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function AdvancedNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    push: true,
    email: true,
    sms: false,
    sound: true,
    vibration: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  useEffect(() => {
    checkPermission();
    loadTemplates();
    loadSettings();
  }, []);

  const checkPermission = async () => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);

      if (currentPermission === 'granted') {
        await setupPushSubscription();
      }
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await setupPushSubscription();
      }
    }
  };

  const setupPushSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });

        setSubscription(subscription);

        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        });
      } catch (error) {
        console.error('Push subscription failed:', error);
      }
    }
  };

  const loadTemplates = () => {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Randevu Hatırlatması',
        type: 'appointment',
        title: 'Randevu Hatırlatması',
        body: '{{customerName}} için {{appointmentTime}} randevusu yaklaşıyor.',
        icon: '📅',
        actions: [
          { action: 'view', title: 'Görüntüle' },
          { action: 'reschedule', title: 'Ertele' }
        ],
        enabled: true
      },
      {
        id: '2',
        name: 'Bakım Zamanı',
        type: 'maintenance',
        title: 'Bakım Zamanı',
        body: '{{vehiclePlate}} aracı için {{maintenanceType}} bakımı yapılması gerekiyor.',
        icon: '🔧',
        actions: [
          { action: 'schedule', title: 'Planla' },
          { action: 'view', title: 'Detaylar' }
        ],
        enabled: true
      },
      {
        id: '3',
        name: 'Ödeme Hatırlatması',
        type: 'payment',
        title: 'Ödeme Hatırlatması',
        body: '{{customerName}} için {{amount}} TL ödeme bekleniyor.',
        icon: '💳',
        actions: [
          { action: 'pay', title: 'Öde' },
          { action: 'view', title: 'Fatura' }
        ],
        enabled: true
      }
    ];

    setTemplates(defaultTemplates);
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('ototakibim_notification_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ototakibim_notification_settings', JSON.stringify(newSettings));
  };

  const sendTestNotification = async () => {
    if (permission === 'granted') {
      const notification = new Notification('OtoTakibim Test', {
        body: 'Bu bir test bildirimidir.',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'test-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Görüntüle'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const getTypeIcon = (type: NotificationTemplate['type']) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'maintenance': return <Settings className="w-5 h-5 text-orange-600" />;
      case 'payment': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'general': return <Bell className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTypeLabel = (type: NotificationTemplate['type']) => {
    switch (type) {
      case 'appointment': return 'Randevu';
      case 'maintenance': return 'Bakım';
      case 'payment': return 'Ödeme';
      case 'general': return 'Genel';
    }
  };

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bildirim İzinleri</h3>
          {permission === 'granted' ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Aktif</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {permission === 'denied' ? 'Reddedildi' : 'İzin Gerekli'}
              </span>
            </div>
          )}
        </div>

        {permission !== 'granted' && (
          <div className="mb-4">
            <button
              onClick={requestPermission}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Bildirim İzni Ver</span>
            </button>
          </div>
        )}

        {permission === 'granted' && (
          <div className="flex space-x-3">
            <button
              onClick={sendTestNotification}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Test Bildirimi Gönder</span>
            </button>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Ayarları</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Push Bildirimleri</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.push}
                onChange={(e) => saveSettings({ ...settings, push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">E-posta Bildirimleri</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email}
                onChange={(e) => saveSettings({ ...settings, email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-700">SMS Bildirimleri</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sms}
                onChange={(e) => saveSettings({ ...settings, sms: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-700">Ses</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => saveSettings({ ...settings, sound: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-700">Titreşim</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.vibration}
                onChange={(e) => saveSettings({ ...settings, vibration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Sessiz Saatler</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.quietHours.enabled}
                onChange={(e) => saveSettings({ 
                  ...settings, 
                  quietHours: { ...settings.quietHours, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç
                </label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => saveSettings({ 
                    ...settings, 
                    quietHours: { ...settings.quietHours, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş
                </label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => saveSettings({ 
                    ...settings, 
                    quietHours: { ...settings.quietHours, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Templates */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bildirim Şablonları</h3>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Şablon</span>
          </button>
        </div>

        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getTypeIcon(template.type)}
                <div>
                  <p className="font-medium text-gray-900">{template.name}</p>
                  <p className="text-sm text-gray-600">
                    {getTypeLabel(template.type)} • {template.body}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={template.enabled}
                    onChange={(e) => {
                      const updated = templates.map(t => 
                        t.id === template.id ? { ...t, enabled: e.target.checked } : t
                      );
                      setTemplates(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}