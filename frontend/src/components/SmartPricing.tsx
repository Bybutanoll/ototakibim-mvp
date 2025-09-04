'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  Calculator,
  BarChart3,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  Star,
  Users,
  Clock,
  Zap
} from 'lucide-react';

interface PricingData {
  service: string;
  currentPrice: number;
  marketAverage: number;
  competitorLow: number;
  competitorHigh: number;
  recommendedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'high' | 'medium' | 'low';
  seasonality: number;
}

interface PricingInsight {
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impact: string;
  action: string;
  icon: React.ReactNode;
}

export default function SmartPricing() {
  const [pricingData, setPricingData] = useState<PricingData[]>([]);
  const [insights, setInsights] = useState<PricingInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockData: PricingData[] = [
        {
          service: 'Motor Yağı Değişimi',
          currentPrice: 450,
          marketAverage: 520,
          competitorLow: 380,
          competitorHigh: 650,
          recommendedPrice: 480,
          confidence: 85,
          trend: 'up',
          demand: 'high',
          seasonality: 1.2
        },
        {
          service: 'Fren Balata Değişimi',
          currentPrice: 800,
          marketAverage: 850,
          competitorLow: 720,
          competitorHigh: 950,
          recommendedPrice: 820,
          confidence: 78,
          trend: 'stable',
          demand: 'medium',
          seasonality: 1.0
        },
        {
          service: 'Klima Bakımı',
          currentPrice: 300,
          marketAverage: 350,
          competitorLow: 250,
          competitorHigh: 450,
          recommendedPrice: 320,
          confidence: 92,
          trend: 'up',
          demand: 'high',
          seasonality: 1.5
        },
        {
          service: 'Genel Bakım',
          currentPrice: 1200,
          marketAverage: 1350,
          competitorLow: 1100,
          competitorHigh: 1600,
          recommendedPrice: 1250,
          confidence: 88,
          trend: 'up',
          demand: 'medium',
          seasonality: 1.1
        },
        {
          service: 'Lastik Değişimi',
          currentPrice: 600,
          marketAverage: 580,
          competitorLow: 500,
          competitorHigh: 700,
          recommendedPrice: 620,
          confidence: 75,
          trend: 'down',
          demand: 'low',
          seasonality: 0.8
        }
      ];

      setPricingData(mockData);
      generateInsights(mockData);
    } catch (error) {
      console.error('Pricing data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data: PricingData[]) => {
    const newInsights: PricingInsight[] = [];

    // Analyze pricing opportunities
    data.forEach(item => {
      if (item.currentPrice < item.marketAverage * 0.9) {
        newInsights.push({
          type: 'opportunity',
          title: 'Fiyat Artırma Fırsatı',
          description: `${item.service} için fiyatınızı artırabilirsiniz`,
          impact: `%${Math.round(((item.recommendedPrice - item.currentPrice) / item.currentPrice) * 100)} daha yüksek fiyat öneriliyor`,
          action: 'Fiyatı optimize et',
          icon: <TrendingUp className="w-5 h-5" />
        });
      }

      if (item.currentPrice > item.marketAverage * 1.1) {
        newInsights.push({
          type: 'warning',
          title: 'Fiyat Rekabetçi Değil',
          description: `${item.service} fiyatınız pazar ortalamasının üzerinde`,
          impact: 'Müşteri kaybı riski var',
          action: 'Fiyatı düşür',
          icon: <TrendingDown className="w-5 h-5" />
        });
      }

      if (item.demand === 'high' && item.seasonality > 1.2) {
        newInsights.push({
          type: 'info',
          title: 'Sezonluk Fırsat',
          description: `${item.service} için yüksek talep dönemi`,
          impact: 'Fiyat artırma fırsatı',
          action: 'Sezonluk fiyat uygula',
          icon: <Zap className="w-5 h-5" />
        });
      }
    });

    // Overall insights
    const avgConfidence = data.reduce((sum, item) => sum + item.confidence, 0) / data.length;
    if (avgConfidence > 80) {
      newInsights.push({
        type: 'success',
        title: 'Fiyat Stratejiniz Başarılı',
        description: 'Genel olarak rekabetçi fiyatlarınız var',
        impact: 'Müşteri memnuniyeti yüksek',
        action: 'Mevcut stratejiyi sürdür',
        icon: <CheckCircle className="w-5 h-5" />
      });
    }

    setInsights(newInsights);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-red-50 border-red-200 text-red-800';
      case 'success': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const filteredData = selectedService === 'all' 
    ? pricingData 
    : pricingData.filter(item => item.service === selectedService);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Fiyat analizi yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Akıllı Fiyatlandırma</h2>
              <p className="text-gray-600">AI destekli fiyat optimizasyonu ve pazar analizi</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Gelişmiş</span>
            </button>
            <button
              onClick={loadPricingData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Yenile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Önerileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm mb-2">{insight.description}</p>
                    <p className="text-xs font-medium mb-2">{insight.impact}</p>
                    <button className="text-xs font-medium underline hover:no-underline">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Fiyat Analizi</h3>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Servisler</option>
              {pricingData.map((item) => (
                <option key={item.service} value={item.service}>{item.service}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mevcut Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pazar Ortalaması
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Önerilen Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Talep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Güven
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(item.currentPrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(item.marketAverage)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">{formatCurrency(item.recommendedPrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span className="text-sm capitalize">{item.trend}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDemandColor(item.demand)}`}>
                      {item.demand === 'high' ? 'Yüksek' : item.demand === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{item.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelişmiş Ayarlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hedef Kâr Marjı (%)
              </label>
              <input
                type="number"
                defaultValue="25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rekabet Ağırlığı
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sezonluk Faktör
              </label>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Sezonluk fiyatlandırma aktif</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri Segmentasyonu
              </label>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Segment bazlı fiyatlandırma</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
