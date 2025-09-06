'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DevicePhoneMobileIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  WifiIcon,
  BellIcon,
  BellSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { usePWA } from '@/hooks/usePWA';
import toast from 'react-hot-toast';

const PWAInstaller = () => {
  const {
    isInstalled,
    isInstallable,
    isOnline,
    isUpdateAvailable,
    installPWA,
    updateServiceWorker,
    requestNotificationPermission,
    subscribeToPush
  } = usePWA();

  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(!isOnline);
  const [showUpdateBanner, setShowUpdateBanner] = useState(isUpdateAvailable);

  const handleInstall = async () => {
    await installPWA();
    setShowInstallBanner(false);
  };

  const handleUpdate = async () => {
    await updateServiceWorker();
    setShowUpdateBanner(false);
  };

  const handleNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await subscribeToPush();
    }
  };

  return (
    <>
      {/* Install Banner */}
      <AnimatePresence>
        {isInstallable && showInstallBanner && !isInstalled && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DevicePhoneMobileIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">OtoTakibim'i Kur</p>
                    <p className="text-sm opacity-90">
                      Hızlı erişim için ana ekrana ekleyin
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleInstall}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Kur</span>
                  </button>
                  <button
                    onClick={() => setShowInstallBanner(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Banner */}
      <AnimatePresence>
        {isUpdateAvailable && showUpdateBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ArrowPathIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Yeni Güncelleme Mevcut</p>
                    <p className="text-sm opacity-90">
                      En son özellikler için uygulamayı güncelleyin
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>Güncelle</span>
                  </button>
                  <button
                    onClick={() => setShowUpdateBanner(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && showOfflineBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <WifiIcon className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Çevrimdışı Mod</p>
                    <p className="text-sm opacity-90">
                      İnternet bağlantısı yok - Sınırlı özellikler mevcut
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOfflineBanner(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`p-3 rounded-full shadow-lg ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {isOnline ? (
            <WifiIcon className="h-5 w-5" />
          ) : (
            <WifiIcon className="h-5 w-5" />
          )}
        </motion.div>
      </div>

      {/* Notification Permission Request */}
      {!isInstalled && (
        <div className="fixed bottom-4 left-4 z-40">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <BellIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Bildirimler</p>
                <p className="text-sm text-gray-600">
                  Önemli güncellemeler için bildirim alın
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleNotificationPermission}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Etkinleştir
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Daha Sonra
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PWAInstaller;