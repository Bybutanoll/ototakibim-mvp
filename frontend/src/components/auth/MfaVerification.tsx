'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';
import PremiumButton from '../PremiumButton';
import PremiumCard from '../PremiumCard';
import { useEnhancedAuth } from '../../hooks/useEnhancedAuth';

interface MfaVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MfaVerification: React.FC<MfaVerificationProps> = ({ onSuccess, onCancel }) => {
  const { verifyMfa } = useEnhancedAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('Lütfen 6 haneli doğrulama kodunu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyMfa(code);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimeLeft(30);
    setCanResend(false);
    setError('');
    // Resend logic would be implemented here
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <PremiumCard variant="elevated" className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              İki Faktörlü Doğrulama
            </h2>
            <p className="text-gray-600">
              Authenticator uygulamanızdan 6 haneli kodu girin
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doğrulama Kodu
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </motion.div>
            )}

            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-gray-500">
                  Yeni kod gönderebilmek için {timeLeft} saniye bekleyin
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Yeni kod gönder
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <PremiumButton
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                İptal
              </PremiumButton>
              <PremiumButton
                variant="primary"
                onClick={handleVerify}
                isLoading={loading}
                disabled={code.length !== 6}
                className="flex-1"
              >
                Doğrula
              </PremiumButton>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Kod bulamıyor musunuz?
              </h4>
              <p className="text-xs text-blue-800">
                Authenticator uygulamanızı açın ve OtoTakibim için oluşturulan 
                hesabınızdan 6 haneli kodu alın. Kod her 30 saniyede bir yenilenir.
              </p>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default MfaVerification;
