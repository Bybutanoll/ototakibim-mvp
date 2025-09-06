'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Wrench,
  Plus,
  Eye,
  Star,
  RefreshCw,
  MessageSquare,
  Zap
} from 'lucide-react';
import PremiumCard from '../PremiumCard';
import PremiumButton from '../PremiumButton';
import { useDiagnostics } from '../../hooks/useAI';
import { SmartDiagnostic } from '../../services/aiService';

interface SmartDiagnosticsProps {
  vehicleId?: string;
}

const SmartDiagnostics: React.FC<SmartDiagnosticsProps> = ({ vehicleId }) => {
  const { diagnostics, loading, performDiagnostic, fetchDiagnostics, rateDiagnostic } = useDiagnostics();
  const [showDiagnosticForm, setShowDiagnosticForm] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<SmartDiagnostic | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [userDescription, setUserDescription] = useState('');
  const [isPerformingDiagnostic, setIsPerformingDiagnostic] = useState(false);

  useEffect(() => {
    fetchDiagnostics(vehicleId);
  }, [fetchDiagnostics, vehicleId]);

  const commonSymptoms = [
    'Motor çalışmıyor',
    'Araç titriyor',
    'Garip sesler geliyor',
    'Yakıt tüketimi arttı',
    'Frenler yumuşak',
    'Direksiyon ağır',
    'Klima çalışmıyor',
    'Elektrik sorunları',
    'Egzoz dumanı',
    'Performans düşüklüğü'
  ];

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handlePerformDiagnostic = async () => {
    if (symptoms.length === 0 && !userDescription.trim()) {
      alert('Lütfen en az bir belirti seçin veya açıklama yazın');
      return;
    }

    setIsPerformingDiagnostic(true);
    try {
      const diagnostic = await performDiagnostic({
        vehicleId: vehicleId || 'default',
        symptoms,
        userDescription,
      });
      setSelectedDiagnostic(diagnostic);
      setShowDiagnosticForm(false);
      setSymptoms([]);
      setUserDescription('');
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setIsPerformingDiagnostic(false);
    }
  };

  const handleRateDiagnostic = async (diagnosticId: string, rating: number) => {
    try {
      await rateDiagnostic(diagnosticId, {
        wasAccurate: rating >= 4,
        rating,
        feedback: rating >= 4 ? 'Doğru tanı' : 'Yanlış tanı',
        wasHelpful: rating >= 3
      });
    } catch (error) {
      console.error('Rating failed:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            Akıllı Tanı
          </h1>
          <p className="text-gray-600 mt-1">
            AI destekli araç arıza tespiti ve çözüm önerileri
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton
            onClick={() => fetchDiagnostics(vehicleId)}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            isLoading={loading}
          >
            Yenile
          </PremiumButton>
          <PremiumButton
            onClick={() => setShowDiagnosticForm(true)}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Yeni Tanı
          </PremiumButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PremiumCard variant="elevated" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{diagnostics.length}</div>
              <div className="text-sm text-gray-600">Toplam Tanı</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="elevated" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {diagnostics.length > 0 ? Math.round(diagnostics.reduce((acc, d) => acc + d.diagnosticResult.confidence, 0) / diagnostics.length * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Ortalama Güven</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="elevated" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {diagnostics.filter(d => d.diagnosticResult.confidence >= 0.8).length}
              </div>
              <div className="text-sm text-gray-600">Yüksek Güven</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="elevated" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ₺{diagnostics.reduce((acc, d) => acc + d.diagnosticResult.possibleCauses.reduce((sum, cause) => sum + cause.estimatedCost, 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Toplam Maliyet</div>
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Diagnostic Form Modal */}
      <AnimatePresence>
        {showDiagnosticForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDiagnosticForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl bg-white rounded-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Yeni Akıllı Tanı</h2>
              </div>

              <div className="space-y-6">
                {/* Symptoms Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Belirtiler (Birden fazla seçebilirsiniz)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          symptoms.includes(symptom)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detaylı Açıklama
                  </label>
                  <textarea
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="Aracınızda yaşadığınız sorunu detaylı olarak açıklayın..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                {/* Selected Symptoms */}
                {symptoms.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seçilen Belirtiler
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <PremiumButton
                    onClick={() => setShowDiagnosticForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    İptal
                  </PremiumButton>
                  <PremiumButton
                    onClick={handlePerformDiagnostic}
                    variant="primary"
                    className="flex-1"
                    isLoading={isPerformingDiagnostic}
                    disabled={symptoms.length === 0 && !userDescription.trim()}
                  >
                    Tanı Başlat
                  </PremiumButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostics List */}
      <div className="space-y-4">
        <AnimatePresence>
          {diagnostics.map((diagnostic, index) => (
            <motion.div
              key={diagnostic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumCard 
                variant="elevated" 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedDiagnostic(diagnostic)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getConfidenceColor(diagnostic.diagnosticResult.confidence)}`}>
                      <Brain className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {diagnostic.diagnosticResult.problem}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(diagnostic.diagnosticResult.confidence)}`}>
                          %{Math.round(diagnostic.diagnosticResult.confidence * 100)} güven
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{diagnostic.userDescription}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(diagnostic.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            ₺{diagnostic.diagnosticResult.possibleCauses.reduce((sum, cause) => sum + cause.estimatedCost, 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wrench className="w-4 h-4" />
                          <span>{diagnostic.diagnosticResult.possibleCauses.length} olası neden</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateDiagnostic(diagnostic.id, star);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Star className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Symptoms */}
                {diagnostic.symptoms.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Belirtiler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {diagnostic.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </PremiumCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {diagnostics.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz tanı bulunmuyor
          </h3>
          <p className="text-gray-600 mb-4">
            Aracınızda yaşadığınız sorunları AI ile analiz etmek için yeni bir tanı başlatın.
          </p>
          <PremiumButton
            onClick={() => setShowDiagnosticForm(true)}
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Yeni Tanı Başlat
          </PremiumButton>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Tanılar yükleniyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartDiagnostics;
