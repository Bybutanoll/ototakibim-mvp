'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Copy, Download, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import PremiumButton from '../PremiumButton';
import PremiumCard from '../PremiumCard';
import { useEnhancedAuth } from '../../hooks/useEnhancedAuth';
import { MfaSetup as MfaSetupType } from '../../services/enhancedAuthService';

interface MfaSetupProps {
  onComplete: (backupCodes: string[]) => void;
  onCancel: () => void;
}

const MfaSetup: React.FC<MfaSetupProps> = ({ onComplete, onCancel }) => {
  const { setupMfa, verifyMfaSetup, enableMfa } = useEnhancedAuth();
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [mfaData, setMfaData] = useState<MfaSetupType | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetupMfa = async () => {
    setLoading(true);
    setError('');
    
    try {
      const setup = await setupMfa();
      setMfaData(setup);
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Lütfen 6 haneli doğrulama kodunu girin');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const codes = await verifyMfaSetup(verificationCode);
      setBackupCodes(codes);
      await enableMfa();
      setStep('complete');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = `OtoTakibim MFA Yedek Kodları\n\n${backupCodes.join('\n')}\n\nBu kodları güvenli bir yerde saklayın.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ototakibim-mfa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
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
              {step === 'setup' && 'İki Faktörlü Kimlik Doğrulama'}
              {step === 'verify' && 'Doğrulama Kodu'}
              {step === 'complete' && 'Kurulum Tamamlandı'}
            </h2>
            <p className="text-gray-600">
              {step === 'setup' && 'Hesabınızı daha güvenli hale getirin'}
              {step === 'verify' && 'Authenticator uygulamanızdan kodu girin'}
              {step === 'complete' && 'MFA başarıyla etkinleştirildi'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">MFA Nedir?</h3>
                  <p className="text-sm text-blue-800">
                    İki faktörlü kimlik doğrulama, hesabınıza ekstra güvenlik katmanı ekler. 
                    Giriş yaparken şifrenizin yanında telefonunuzdaki uygulamadan aldığınız 
                    kodu da girmeniz gerekir.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">1</span>
                    </div>
                    <span className="text-sm text-gray-700">Google Authenticator veya benzeri uygulama indirin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">2</span>
                    </div>
                    <span className="text-sm text-gray-700">QR kodu tarayın veya manuel kodu girin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">3</span>
                    </div>
                    <span className="text-sm text-gray-700">Doğrulama kodunu girin</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                )}

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
                    onClick={handleSetupMfa}
                    isLoading={loading}
                    className="flex-1"
                  >
                    Başla
                  </PremiumButton>
                </div>
              </motion.div>
            )}

            {step === 'verify' && mfaData && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                    <img
                      src={mfaData.qrCode}
                      alt="MFA QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    QR kodu tarayın veya aşağıdaki kodu manuel olarak girin
                  </p>
                  
                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-gray-800">{mfaData.secret}</code>
                      <button
                        onClick={() => copyToClipboard(mfaData.secret)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <PremiumButton
                    variant="outline"
                    onClick={() => setStep('setup')}
                    className="flex-1"
                  >
                    Geri
                  </PremiumButton>
                  <PremiumButton
                    variant="primary"
                    onClick={handleVerifyCode}
                    isLoading={loading}
                    disabled={verificationCode.length !== 6}
                    className="flex-1"
                  >
                    Doğrula
                  </PremiumButton>
                </div>
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    MFA Başarıyla Etkinleştirildi!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Yedek kodlarınızı güvenli bir yerde saklayın. Bu kodlar telefonunuzu 
                    kaybettiğinizde hesabınıza erişim için kullanılabilir.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-yellow-900">Yedek Kodlar</h4>
                    <button
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="flex items-center gap-1 text-sm text-yellow-700 hover:text-yellow-800"
                    >
                      {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showBackupCodes ? 'Gizle' : 'Göster'}
                    </button>
                  </div>
                  
                  {showBackupCodes && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 rounded border text-sm font-mono text-center"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <PremiumButton
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(backupCodes.join('\n'))}
                      leftIcon={<Copy className="w-4 h-4" />}
                    >
                      Kopyala
                    </PremiumButton>
                    <PremiumButton
                      variant="outline"
                      size="sm"
                      onClick={downloadBackupCodes}
                      leftIcon={<Download className="w-4 h-4" />}
                    >
                      İndir
                    </PremiumButton>
                  </div>
                </div>

                <PremiumButton
                  variant="primary"
                  onClick={() => onComplete(backupCodes)}
                  className="w-full"
                >
                  Tamam
                </PremiumButton>
              </motion.div>
            )}
          </AnimatePresence>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default MfaSetup;
