'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  CreditCard,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Send,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Car,
  Receipt,
  Banknote,
  Smartphone,
  Globe
} from 'lucide-react';

interface Payment {
  _id: string;
  invoiceNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    _id: string;
    plate: string;
    brand: string;
    model: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'mobile_payment' | 'online';
  paymentDate?: Date;
  dueDate: Date;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentStats {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  averagePayment: number;
  monthlyGrowth: number;
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  useEffect(() => {
    if (user) {
      loadPaymentsData();
    }
  }, [user]);

  const loadPaymentsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockPayments: Payment[] = [
        {
          _id: '1',
          invoiceNumber: 'INV-2024-001',
          customer: {
            _id: 'c1',
            name: 'Ahmet Yılmaz',
            email: 'ahmet@example.com',
            phone: '0532 123 45 67'
          },
          vehicle: {
            _id: 'v1',
            plate: '34 ABC 123',
            brand: 'Toyota',
            model: 'Corolla'
          },
          amount: 1250,
          currency: 'TRY',
          status: 'completed',
          paymentMethod: 'credit_card',
          paymentDate: new Date('2024-09-03T14:30:00'),
          dueDate: new Date('2024-09-10'),
          description: 'Motor yağı değişimi ve genel bakım',
          items: [
            { name: 'Motor Yağı 5W-30', quantity: 1, price: 200, total: 200 },
            { name: 'Yağ Filtresi', quantity: 1, price: 80, total: 80 },
            { name: 'İşçilik', quantity: 2, price: 300, total: 600 },
            { name: 'Genel Kontrol', quantity: 1, price: 150, total: 150 }
          ],
          tax: 200,
          total: 1250,
          createdAt: new Date('2024-09-03T10:00:00'),
          updatedAt: new Date('2024-09-03T14:30:00')
        },
        {
          _id: '2',
          invoiceNumber: 'INV-2024-002',
          customer: {
            _id: 'c2',
            name: 'Fatma Demir',
            email: 'fatma@example.com',
            phone: '0533 987 65 43'
          },
          vehicle: {
            _id: 'v2',
            plate: '06 XYZ 789',
            brand: 'Volkswagen',
            model: 'Golf'
          },
          amount: 800,
          currency: 'TRY',
          status: 'pending',
          paymentMethod: 'bank_transfer',
          dueDate: new Date('2024-09-15'),
          description: 'Fren balata değişimi',
          items: [
            { name: 'Fren Balatası Seti', quantity: 1, price: 400, total: 400 },
            { name: 'İşçilik', quantity: 1, price: 300, total: 300 }
          ],
          tax: 100,
          total: 800,
          createdAt: new Date('2024-09-02T16:00:00'),
          updatedAt: new Date('2024-09-02T16:00:00')
        },
        {
          _id: '3',
          invoiceNumber: 'INV-2024-003',
          customer: {
            _id: 'c3',
            name: 'Mehmet Kaya',
            email: 'mehmet@example.com',
            phone: '0534 555 12 34'
          },
          vehicle: {
            _id: 'v3',
            plate: '35 DEF 456',
            brand: 'Ford',
            model: 'Focus'
          },
          amount: 450,
          currency: 'TRY',
          status: 'failed',
          paymentMethod: 'credit_card',
          dueDate: new Date('2024-09-05'),
          description: 'Klima bakımı',
          items: [
            { name: 'Klima Gazı', quantity: 1, price: 150, total: 150 },
            { name: 'İşçilik', quantity: 1, price: 200, total: 200 }
          ],
          tax: 100,
          total: 450,
          createdAt: new Date('2024-09-01T11:00:00'),
          updatedAt: new Date('2024-09-01T11:30:00')
        }
      ];

      const mockStats: PaymentStats = {
        totalRevenue: 2500,
        pendingPayments: 1,
        completedPayments: 1,
        failedPayments: 1,
        averagePayment: 833,
        monthlyGrowth: 15.2,
        paymentMethods: [
          { method: 'credit_card', count: 2, amount: 1700, percentage: 68 },
          { method: 'bank_transfer', count: 1, amount: 800, percentage: 32 }
        ]
      };

      setPayments(mockPayments);
      setStats(mockStats);
    } catch (error) {
      console.error('Payments loading error:', error);
      setPayments([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Bekliyor';
      case 'failed': return 'Başarısız';
      case 'refunded': return 'İade Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <RefreshCw className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer': return <Banknote className="w-4 h-4" />;
      case 'cash': return <DollarSign className="w-4 h-4" />;
      case 'mobile_payment': return <Smartphone className="w-4 h-4" />;
      case 'online': return <Globe className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Kredi Kartı';
      case 'bank_transfer': return 'Banka Havalesi';
      case 'cash': return 'Nakit';
      case 'mobile_payment': return 'Mobil Ödeme';
      case 'online': return 'Online Ödeme';
      default: return method;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleCreateInvoice = () => {
    setShowCreateInvoice(true);
  };

  const handleSendReminder = (paymentId: string) => {
    console.log('Sending reminder for payment:', paymentId);
  };

  const handleRefund = (paymentId: string) => {
    console.log('Processing refund for payment:', paymentId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ödeme verileri yükleniyor...</p>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ödeme Yönetimi</h1>
                <p className="text-gray-600">Fatura oluşturma, ödeme takibi ve finansal raporlama</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateInvoice(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Fatura Oluştur</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="ml-1 text-sm font-medium text-green-600">
                  +{stats.monthlyGrowth}%
                </span>
                <span className="ml-2 text-sm text-gray-500">bu ay</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen Ödemeler</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedPayments}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ortalama Ödeme</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averagePayment)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {stats && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Ödeme Yöntemleri</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.paymentMethods.map((method, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(method.method)}
                        <span className="font-medium text-gray-900">
                          {getPaymentMethodLabel(method.method)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {method.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{method.count} işlem</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(method.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Fatura ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtreler</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="pending">Bekliyor</option>
                    <option value="failed">Başarısız</option>
                    <option value="refunded">İade Edildi</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Yöntemi</label>
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="credit_card">Kredi Kartı</option>
                    <option value="bank_transfer">Banka Havalesi</option>
                    <option value="cash">Nakit</option>
                    <option value="mobile_payment">Mobil Ödeme</option>
                    <option value="online">Online Ödeme</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Ödemeler ({filteredPayments.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredPayments.length > 0 ? (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{payment.invoiceNumber}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              <span>{getStatusLabel(payment.status)}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div>
                            <span className="font-medium">Müşteri:</span> {payment.customer.name}
                          </div>
                          <div>
                            <span className="font-medium">Araç:</span> {payment.vehicle.plate}
                          </div>
                          <div>
                            <span className="font-medium">Ödeme Yöntemi:</span> {getPaymentMethodLabel(payment.paymentMethod)}
                          </div>
                          <div>
                            <span className="font-medium">Tutar:</span> {formatCurrency(payment.total)}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <span>Oluşturulma: {formatDate(payment.createdAt)}</span>
                          {payment.paymentDate && (
                            <span className="ml-4">Ödeme: {formatDate(payment.paymentDate)}</span>
                          )}
                          <span className="ml-4">Vade: {formatDate(payment.dueDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => handleSendReminder(payment._id)}
                            className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {payment.status === 'completed' && (
                          <button 
                            onClick={() => handleRefund(payment._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Ödeme bulunamadı</p>
                <button
                  onClick={handleCreateInvoice}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  İlk Faturayı Oluştur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
