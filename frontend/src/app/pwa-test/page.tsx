'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DevicePhoneMobileIcon,
  WifiIcon,
  BellIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { usePWA } from '@/hooks/usePWA';

const PWATestPage = () => {
  const {
    isInstalled,
    isInstallable,
    isOnline,
    isUpdateAvailable,
    installPWA,
    updateServiceWorker,
    requestNotificationPermission,
    sendNotification
  } = usePWA();

  const [testResults, setTestResults] = useState<{
    serviceWorker: boolean;
    manifest: boolean;
    offline: boolean;
    notifications: boolean;
    installable: boolean;
  }>({
    serviceWorker: false,
    manifest: false,
    offline: false,
    notifications: false,
    installable: false
  });

  useEffect(() => {
    // Test PWA features
    const testPWAFeatures = async () => {
      const results = {
        serviceWorker: 'serviceWorker' in navigator,
        manifest: false,
        offline: false,
        notifications: 'Notification' in window,
        installable: isInstallable
      };

      // Test manifest
      try {
        const response = await fetch('/manifest.json');
        results.manifest = response.ok;
      } catch (error) {
        console.error('Manifest test failed:', error);
      }

      // Test offline capability
      try {
        const response = await fetch('/sw.js');
        results.offline = response.ok;
      } catch (error) {
        console.error('Service Worker test failed:', error);
      }

      setTestResults(results);
    };

    testPWAFeatures();
  }, [isInstallable]);

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      sendNotification('Test Bildirimi', {
        body: 'PWA bildirim sistemi çalışıyor!',
        icon: '/icon-192x192.png'
      });
    }
  };

  const TestCard = ({ 
    title, 
    description, 
    status, 
    icon: Icon, 
    action 
  }: {
    title: string;
    description: string;
    status: boolean;
    icon: React.ComponentType<any>;
    action?: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${
          status ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Icon className={`h-6 w-6 ${
            status ? 'text-green-600' : 'text-red-600'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
          <div className="mt-3 flex items-center space-x-2">
            {status ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              status ? 'text-green-600' : 'text-red-600'
            }`}>
              {status ? 'Çalışıyor' : 'Çalışmıyor'}
            </span>
          </div>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            PWA Test Sayfası
          </h1>
          <p className="text-gray-600">
            OtoTakibim PWA özelliklerini test edin
          </p>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className={`inline-flex p-3 rounded-full ${
              isOnline ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isOnline ? (
                <WifiIcon className="h-8 w-8 text-green-600" />
              ) : (
                <WifiSlashIcon className="h-8 w-8 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              Bağlantı Durumu
            </h3>
            <p className={`text-sm font-medium ${
              isOnline ? 'text-green-600' : 'text-red-600'
            }`}>
              {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className={`inline-flex p-3 rounded-full ${
              isInstalled ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <DevicePhoneMobileIcon className={`h-8 w-8 ${
                isInstalled ? 'text-green-600' : 'text-blue-600'
              }`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              Kurulum Durumu
            </h3>
            <p className={`text-sm font-medium ${
              isInstalled ? 'text-green-600' : 'text-blue-600'
            }`}>
              {isInstalled ? 'Kurulu' : 'Kurulabilir'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className={`inline-flex p-3 rounded-full ${
              isUpdateAvailable ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              <InformationCircleIcon className={`h-8 w-8 ${
                isUpdateAvailable ? 'text-orange-600' : 'text-gray-600'
              }`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              Güncelleme
            </h3>
            <p className={`text-sm font-medium ${
              isUpdateAvailable ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {isUpdateAvailable ? 'Mevcut' : 'Güncel'}
            </p>
          </div>
        </motion.div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestCard
            title="Service Worker"
            description="Çevrimdışı çalışma ve cache yönetimi"
            status={testResults.serviceWorker}
            icon={WifiIcon}
          />

          <TestCard
            title="Web App Manifest"
            description="PWA kurulum ve görünüm ayarları"
            status={testResults.manifest}
            icon={DevicePhoneMobileIcon}
          />

          <TestCard
            title="Çevrimdışı Desteği"
            description="İnternet olmadan çalışabilme"
            status={testResults.offline}
            icon={WifiSlashIcon}
          />

          <TestCard
            title="Bildirimler"
            description="Push notification desteği"
            status={testResults.notifications}
            icon={BellIcon}
            action={
              <button
                onClick={handleTestNotification}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Bildirimi Gönder
              </button>
            }
          />

          <TestCard
            title="Kurulum Özelliği"
            description="Ana ekrana ekleme desteği"
            status={testResults.installable}
            icon={ArrowDownTrayIcon}
            action={
              isInstallable && !isInstalled && (
                <button
                  onClick={installPWA}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  PWA'yı Kur
                </button>
              )
            }
          />

          {isUpdateAvailable && (
            <TestCard
              title="Güncelleme"
              description="Yeni sürüm mevcut"
              status={false}
              icon={InformationCircleIcon}
              action={
                <button
                  onClick={updateServiceWorker}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Güncelle
                </button>
              }
            />
          )}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-blue-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            PWA Kurulum Talimatları
          </h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
              <p>Tarayıcınızda PWA kurulum bildirimi görünecek</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
              <p>"Kur" butonuna tıklayın</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
              <p>Uygulama ana ekranınıza eklenecek</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
              <p>Artık uygulama gibi kullanabilirsiniz</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PWATestPage;