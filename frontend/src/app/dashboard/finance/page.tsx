'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Car,
  User,
  CreditCard,
  Receipt,
  BarChart3,
  PieChart,
  ArrowLeft,
  Download,
  FileText,
  AlertCircle
} from 'lucide-react';

interface FinancialRecord {
  _id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  relatedWorkOrder?: string;
  relatedCustomer?: string;
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'check';
  status: 'completed' | 'pending' | 'cancelled';
  invoiceNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  profit: number;
  workOrders: number;
  customers: number;
}

const incomeCategories = [
  'Servis Geliri',
  'Parça Satışı',
  'Muayene Ücreti',
  'Ekspertiz',
  'Diğer'
];

const expenseCategories = [
  'Personel Maaşı',
  'Parça Alımı',
  'Ekipman',
  'Kira',
  'Elektrik/Su',
  'Sigorta',
  'Vergi',
  'Diğer'
];

const paymentMethods = [
  { value: 'cash', label: 'Nakit', icon: DollarSign },
  { value: 'credit_card', label: 'Kredi Kartı', icon: CreditCard },
  { value: 'bank_transfer', label: 'Banka Transferi', icon: Receipt },
  { value: 'check', label: 'Çek', icon: FileText }
];

export default function FinancePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  useEffect(() => {
    if (user) {
      loadFinancialData();
    }
  }, [user]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Load financial records
      const response = await fetch('https://ototakibim-mvp.onrender.com/api/financial-records', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFinancialRecords(data.data || []);
        
        // Calculate monthly stats from records
        const monthlyStats = calculateMonthlyStats(data.data || []);
        setMonthlyStats(monthlyStats);
      } else {
        // Fallback to empty data
        setFinancialRecords([]);
        setMonthlyStats([]);
      }
    } catch (error) {
      console.error('Financial data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyStats = (records: FinancialRecord[]): MonthlyStats[] => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    records.forEach(record => {
      const monthKey = new Date(record.date).toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (record.type === 'income') {
        monthlyData[monthKey].income += record.amount;
      } else {
        monthlyData[monthKey].expenses += record.amount;
      }
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      profit: data.income - data.expenses
    })).sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
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
      year: 'numeric'
    }).format(new Date(date));
  };

  const getPaymentMethodIcon = (method: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.value === method);
    return paymentMethod ? paymentMethod.icon : DollarSign;
  };

  const getPaymentMethodLabel = (method: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.value === method);
    return paymentMethod ? paymentMethod.label : method;
  };

  const filteredRecords = financialRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter === 'this-month') {
      const thisMonth = new Date();
      matchesDate = record.date.getMonth() === thisMonth.getMonth() && 
                   record.date.getFullYear() === thisMonth.getFullYear();
    } else if (dateFilter === 'last-month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      matchesDate = record.date.getMonth() === lastMonth.getMonth() && 
                   record.date.getFullYear() === lastMonth.getFullYear();
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const getTotalIncome = () => financialRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const getTotalExpenses = () => financialRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const getTotalProfit = () => getTotalIncome() - getTotalExpenses();
  const getPendingAmount = () => financialRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giriş Gerekli</h2>
          <p className="text-gray-600 mb-4">Bu sayfayı görüntülemek için giriş yapmalısınız</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finansal veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Finans Yönetimi</h1>
                <p className="text-gray-600">Gelir, gider ve kâr analizlerini takip edin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalIncome())}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getTotalProfit() >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`w-6 h-6 ${getTotalProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Kâr/Zarar</p>
                <p className={`text-2xl font-bold ${getTotalProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(getTotalProfit())}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen Ödeme</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(getPendingAmount())}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Aylık Genel Bakış</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="current-month">Bu Ay</option>
              <option value="last-month">Geçen Ay</option>
              <option value="last-3-months">Son 3 Ay</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{stat.month}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gelir:</span>
                    <span className="font-medium text-green-600">{formatCurrency(stat.income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gider:</span>
                    <span className="font-medium text-red-600">{formatCurrency(stat.expenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kâr/Zarar:</span>
                    <span className={`font-medium ${stat.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stat.profit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">İş Emirleri:</span>
                    <span className="font-medium text-blue-600">{stat.workOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Müşteriler:</span>
                    <span className="font-medium text-purple-600">{stat.customers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Açıklama, kategori veya fatura no ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg transition-colors flex items-center space-x-2 ${
                  showFilters 
                    ? 'border-green-500 text-green-600 bg-green-50' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtreler</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/finance/add')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Kayıt</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Rapor İndir</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tür</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tümü</option>
                    <option value="income">Gelir</option>
                    <option value="expense">Gider</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tümü</option>
                    {typeFilter === 'income' || typeFilter === 'all' ? 
                      incomeCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      )) : null
                    }
                    {typeFilter === 'expense' || typeFilter === 'all' ? 
                      expenseCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      )) : null
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tüm Tarihler</option>
                    <option value="this-month">Bu Ay</option>
                    <option value="last-month">Geçen Ay</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Records List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Finansal Kayıtlar ({filteredRecords.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredRecords.length > 0 ? (
              <div className="space-y-4">
                {filteredRecords.map((record) => {
                  const PaymentMethodIcon = getPaymentMethodIcon(record.paymentMethod);
                  
                  return (
                    <div key={record._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            record.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {record.type === 'income' ? (
                              <TrendingUp className="w-6 h-6 text-green-600" />
                            ) : (
                              <TrendingDown className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900">{record.description}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {record.category}
                              </span>
                              <span>{formatDate(record.date)}</span>
                              {record.invoiceNumber && (
                                <span>Fatura: {record.invoiceNumber}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              record.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <PaymentMethodIcon className="w-4 h-4" />
                              <span>{getPaymentMethodLabel(record.paymentMethod)}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {record.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Finansal Kayıt Bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all'
                    ? 'Arama kriterlerinize uygun kayıt bulunamadı.' 
                    : 'Henüz finansal kayıt eklenmemiş.'}
                </p>
                <button
                  onClick={() => router.push('/dashboard/finance/add')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  İlk Kaydı Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
