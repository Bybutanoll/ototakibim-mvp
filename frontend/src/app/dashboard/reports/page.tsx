'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Car,
  DollarSign,
  Clock,
  Target,
  Award,
  RefreshCw,
  Eye,
  Share2,
  Mail,
  Printer,
  FileSpreadsheet
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  type: 'financial' | 'customer' | 'vehicle' | 'performance' | 'custom';
  dateRange: string;
  generatedAt: string;
  data: any;
  summary: {
    totalRevenue?: number;
    totalCustomers?: number;
    totalVehicles?: number;
    efficiency?: number;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  parameters: string[];
}

export default function ReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState('30days');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'financial-summary',
      name: 'Finansal Özet Raporu',
      description: 'Gelir, gider, kâr analizi ve trend raporu',
      icon: DollarSign,
      category: 'Finansal',
      parameters: ['dateRange', 'categories', 'comparison']
    },
    {
      id: 'customer-analysis',
      name: 'Müşteri Analiz Raporu',
      description: 'Müşteri segmentasyonu, sadakat ve değer analizi',
      icon: Users,
      category: 'Müşteri',
      parameters: ['dateRange', 'segments', 'lifetimeValue']
    },
    {
      id: 'vehicle-maintenance',
      name: 'Araç Bakım Raporu',
      description: 'Bakım geçmişi, maliyet analizi ve öneriler',
      icon: Car,
      category: 'Araç',
      parameters: ['dateRange', 'maintenanceTypes', 'costs']
    },
    {
      id: 'performance-metrics',
      name: 'Performans Metrikleri',
      description: 'İş gücü verimliliği, tamamlanma süreleri ve memnuniyet',
      icon: Target,
      category: 'Performans',
      parameters: ['dateRange', 'metrics', 'benchmarks']
    },
    {
      id: 'monthly-summary',
      name: 'Aylık Özet Raporu',
      description: 'Kapsamlı aylık performans ve KPI raporu',
      icon: BarChart3,
      category: 'Özet',
      parameters: ['month', 'year', 'allMetrics']
    },
    {
      id: 'custom-report',
      name: 'Özel Rapor',
      description: 'İhtiyaçlarınıza göre özelleştirilmiş rapor',
      icon: FileText,
      category: 'Özel',
      parameters: ['customFields', 'filters', 'format']
    }
  ];

  useEffect(() => {
    if (user) {
      loadReports();
      setTemplates(reportTemplates);
    }
  }, [user]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        // Mock data for demo
        const mockReports: ReportData[] = [
          {
            id: '1',
            title: 'Aralık 2024 Finansal Raporu',
            type: 'financial',
            dateRange: '30days',
            generatedAt: '2024-12-15T10:30:00Z',
            data: { totalRevenue: 125000, totalExpenses: 85000, netProfit: 40000 },
            summary: { totalRevenue: 125000 }
          },
          {
            id: '2',
            title: 'Müşteri Analiz Raporu',
            type: 'customer',
            dateRange: '90days',
            generatedAt: '2024-12-10T14:20:00Z',
            data: { totalCustomers: 156, newCustomers: 23, retentionRate: 85.3 },
            summary: { totalCustomers: 156 }
          },
          {
            id: '3',
            title: 'Araç Bakım Özeti',
            type: 'vehicle',
            dateRange: '30days',
            generatedAt: '2024-12-05T09:15:00Z',
            data: { totalVehicles: 89, maintenanceCompleted: 234, averageCost: 534 },
            summary: { totalVehicles: 89 }
          }
        ];
        setReports(mockReports);
      }
    } catch (error) {
      console.error('Reports loading error:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (templateId: string) => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/reports/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          dateRange,
          customDateRange,
          parameters: {}
        })
      });

      if (response.ok) {
        const newReport = await response.json();
        setReports(prev => [newReport, ...prev]);
        alert('Rapor başarıyla oluşturuldu!');
      } else {
        // Mock report generation
        const mockReport: ReportData = {
          id: Date.now().toString(),
          title: `${reportTemplates.find(t => t.id === templateId)?.name} - ${new Date().toLocaleDateString('tr-TR')}`,
          type: templateId.split('-')[0] as any,
          dateRange,
          generatedAt: new Date().toISOString(),
          data: { mock: true },
          summary: {}
        };
        setReports(prev => [mockReport, ...prev]);
        alert('Demo rapor oluşturuldu!');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Rapor oluşturulurken bir hata oluştu.');
    }
  };

  const exportReport = (report: ReportData, format: 'pdf' | 'excel' | 'csv') => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title}-${format}.${format === 'excel' ? 'xlsx' : format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareReport = (report: ReportData) => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: `${report.title} raporunu görüntüle`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Rapor linki panoya kopyalandı!');
    }
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

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'financial': return DollarSign;
      case 'customer': return Users;
      case 'vehicle': return Car;
      case 'performance': return Target;
      default: return FileText;
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-600';
      case 'customer': return 'bg-blue-100 text-blue-600';
      case 'vehicle': return 'bg-purple-100 text-purple-600';
      case 'performance': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Raporlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gelişmiş Raporlar</h1>
                <p className="text-gray-600">Detaylı analiz ve rapor oluşturma</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadReports}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yenile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Generation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Yeni Rapor Oluştur</h2>
            <p className="text-gray-600 mt-1">İhtiyacınıza uygun rapor şablonunu seçin</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{template.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                      {template.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedTemplate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih Aralığı
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="7days">Son 7 Gün</option>
                      <option value="30days">Son 30 Gün</option>
                      <option value="90days">Son 90 Gün</option>
                      <option value="1year">Son 1 Yıl</option>
                      <option value="custom">Özel Tarih</option>
                    </select>
                  </div>

                  {dateRange === 'custom' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlangıç Tarihi
                        </label>
                        <input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bitiş Tarihi
                        </label>
                        <input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => generateReport(selectedTemplate)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Rapor Oluştur</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Existing Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mevcut Raporlar</h2>
            <p className="text-gray-600 mt-1">Oluşturulan raporları görüntüleyin ve yönetin</p>
          </div>

          <div className="p-6">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz rapor yok</h3>
                <p className="text-gray-600">İlk raporunuzu oluşturmak için yukarıdaki şablonları kullanın</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => {
                  const Icon = getReportIcon(report.type);
                  return (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${getReportColor(report.type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{report.title}</h3>
                            <p className="text-sm text-gray-500">
                              Oluşturulma: {formatDate(report.generatedAt)} • {report.dateRange}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <div className="relative group">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => exportReport(report, 'pdf')}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                              >
                                <FileText className="w-4 h-4" />
                                <span>PDF</span>
                              </button>
                              <button
                                onClick={() => exportReport(report, 'excel')}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                              >
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>Excel</span>
                              </button>
                              <button
                                onClick={() => exportReport(report, 'csv')}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                              >
                                <FileText className="w-4 h-4" />
                                <span>CSV</span>
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => shareReport(report)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Paylaş"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}