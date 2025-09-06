'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Wrench, 
  TrendingUp,
  Calendar,
  Filter,
  Plus,
  Eye,
  RefreshCw
} from 'lucide-react';
import PremiumCard from '../PremiumCard';
import PremiumButton from '../PremiumButton';
import { usePredictions } from '../../hooks/useAI';
import { MaintenancePrediction } from '../../services/aiService';

interface PredictiveMaintenanceProps {
  vehicleId?: string;
}

const PredictiveMaintenance: React.FC<PredictiveMaintenanceProps> = ({ vehicleId }) => {
  const { predictions, loading, fetchPredictions, createPrediction } = usePredictions();
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<MaintenancePrediction | null>(null);

  useEffect(() => {
    fetchPredictions(vehicleId);
  }, [fetchPredictions, vehicleId]);

  const filteredPredictions = predictions.filter(prediction => {
    if (filter === 'all') return true;
    return prediction.severity === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Clock;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilFailure = (dateString: string) => {
    const failureDate = new Date(dateString);
    const today = new Date();
    const diffTime = failureDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            Tahmine Dayalı Bakım
          </h1>
          <p className="text-gray-600 mt-1">
            AI destekli bakım tahminleri ve önerileri
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton
            onClick={() => fetchPredictions(vehicleId)}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            isLoading={loading}
          >
            Yenile
          </PremiumButton>
          <PremiumButton
            onClick={() => setShowCreateForm(true)}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Yeni Tahmin
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
              <div className="text-2xl font-bold text-gray-900">{predictions.length}</div>
              <div className="text-sm text-gray-600">Toplam Tahmin</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="elevated" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {predictions.filter(p => p.severity === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Kritik Uyarı</div>
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
                {predictions.length > 0 ? Math.round(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Ortalama Güven</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard variant="elevated" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ₺{predictions.reduce((acc, p) => acc + p.estimatedCost, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Toplam Maliyet</div>
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrele:</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === severity
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {severity === 'all' ? 'Tümü' : 
               severity === 'critical' ? 'Kritik' :
               severity === 'high' ? 'Yüksek' :
               severity === 'medium' ? 'Orta' : 'Düşük'}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPredictions.map((prediction, index) => {
            const SeverityIcon = getSeverityIcon(prediction.severity);
            const daysUntilFailure = getDaysUntilFailure(prediction.predictedFailureDate);
            
            return (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumCard 
                  variant="elevated" 
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSeverityColor(prediction.severity)}`}>
                        <SeverityIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {prediction.component}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(prediction.severity)}`}>
                            {prediction.severity === 'critical' ? 'Kritik' :
                             prediction.severity === 'high' ? 'Yüksek' :
                             prediction.severity === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{prediction.recommendedAction}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(prediction.predictedFailureDate)}</span>
                            <span className="ml-1 font-medium">
                              ({daysUntilFailure > 0 ? `${daysUntilFailure} gün sonra` : 'Geçmiş'})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>₺{prediction.estimatedCost.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                              %{Math.round(prediction.confidence * 100)} güven
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  {/* Symptoms */}
                  {prediction.symptoms.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Belirtiler:</h4>
                      <div className="flex flex-wrap gap-2">
                        {prediction.symptoms.map((symptom, idx) => (
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
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPredictions.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'Henüz tahmin bulunmuyor' : 'Bu kategoride tahmin yok'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Yeni bir bakım tahmini oluşturmak için "Yeni Tahmin" butonuna tıklayın.'
              : 'Farklı bir kategori seçin veya yeni tahmin oluşturun.'
            }
          </p>
          {filter === 'all' && (
            <PremiumButton
              onClick={() => setShowCreateForm(true)}
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Yeni Tahmin Oluştur
            </PremiumButton>
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Tahminler yükleniyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveMaintenance;
