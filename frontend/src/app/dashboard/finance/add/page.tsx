'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  FileText,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  TrendingUp,
  TrendingDown,
  User
} from 'lucide-react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface WorkOrder {
  _id: string;
  title: string;
  customer: Customer;
  estimatedCost: number;
  actualCost?: number;
}

export default function AddFinancialRecordPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    title: '',
    description: '',
    amount: '',
    currency: 'TRY',
    date: '',
    paymentMethod: '',
    status: 'completed',
    customerId: '',
    workOrderId: '',
    invoiceNumber: '',
    taxRate: '18',
    taxAmount: '',
    totalAmount: '',
    dueDate: '',
    paymentTerms: 'immediate',
    recurring: false,
    recurringPattern: 'none',
    recurringEndDate: '',
    notes: '',
    attachments: []
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    if (user) {
      loadCustomers();
      loadWorkOrders();
    }
  }, [user]);

  useEffect(() => {
    calculateTaxAndTotal();
  }, [formData.amount, formData.taxRate]);

  const loadCustomers = async () => {
    // Mock data - will be replaced with real API call
    const mockCustomers: Customer[] = [
      { _id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', phone: '0532 123 45 67', email: 'ahmet@email.com' },
      { _id: '2', firstName: 'Fatma', lastName: 'Demir', phone: '0533 987 65 43', email: 'fatma@email.com' },
      { _id: '3', firstName: 'Mehmet', lastName: 'Kaya', phone: '0534 555 44 33', email: 'mehmet@email.com' }
    ];
    setCustomers(mockCustomers);
  };

  const loadWorkOrders = async () => {
    // Mock data - will be replaced with real API call
    const mockWorkOrders: WorkOrder[] = [
      {
        _id: '1',
        title: 'Motor Yağı Değişimi',
        customer: { _id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', phone: '0532 123 45 67', email: 'ahmet@email.com' },
        estimatedCost: 800,
        actualCost: 750
      },
      {
        _id: '2',
        title: 'Fren Sistemi Kontrolü',
        customer: { _id: '2', firstName: 'Fatma', lastName: 'Demir', phone: '0533 987 65 43', email: 'fatma@email.com' },
        estimatedCost: 1200
      }
    ];
    setWorkOrders(mockWorkOrders);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTaxAndTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const taxRate = parseFloat(formData.taxRate) || 0;
    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;

    setFormData(prev => ({
      ...prev,
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    }));
  };

  const getIncomeCategories = () => [
    'İş Emri Geliri',
    'Parça Satışı',
    'Danışmanlık',
    'Eğitim',
    'Kiralama',
    'Diğer Gelir'
  ];

  const getExpenseCategories = () => [
    'Personel Maaşları',
    'Kira',
    'Elektrik/Su/Doğalgaz',
    'İnternet/Telefon',
    'Sigorta',
    'Vergiler',
    'Parça Alımı',
    'Ekipman Alımı',
    'Bakım/Onarım',
    'Pazarlama',
    'Diğer Gider'
  ];

  const getPaymentMethods = () => [
    'Nakit',
    'Kredi Kartı',
    'Banka Kartı',
    'Banka Transferi',
    'Çek',
    'Senet',
    'Diğer'
  ];

  const getPaymentTerms = () => [
    { value: 'immediate', label: 'Peşin' },
    { value: '7days', label: '7 Gün' },
    { value: '15days', label: '15 Gün' },
    { value: '30days', label: '30 Gün' },
    { value: '60days', label: '60 Gün' },
    { value: '90days', label: '90 Gün' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/financial-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create financial record');
      }

      // Redirect to finance list
      router.push('/dashboard/finance');
    } catch (error) {
      console.error('Error creating financial record:', error);
      alert('Mali kayıt oluşturulurken hata oluştu: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Yeni Finansal Kayıt</h1>
                <p className="text-gray-600">Gelir veya gider kaydı oluşturun</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Record Type and Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Kayıt Türü ve Temel Bilgiler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kayıt Türü *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      Gelir
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      Gider
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Kategori seçin</option>
                  {formData.type === 'income' 
                    ? getIncomeCategories().map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    : getExpenseCategories().map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                  }
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Finansal kayıt için açıklayıcı başlık..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Detaylı açıklama..."
                />
              </div>
            </div>
          </div>

          {/* Amount and Financial Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Tutar ve Finansal Detaylar
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tutar (₺) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para Birimi
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KDV Oranı (%)
                </label>
                <select
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="0">0%</option>
                  <option value="1">1%</option>
                  <option value="8">8%</option>
                  <option value="18">18%</option>
                </select>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Net Tutar</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₺{parseFloat(formData.amount) || 0}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">KDV Tutarı</p>
                  <p className="text-xl font-bold text-gray-600">
                    ₺{parseFloat(formData.taxAmount) || 0}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Toplam Tutar</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₺{parseFloat(formData.totalAmount) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer and Work Order */}
          {formData.type === 'income' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Müşteri ve İş Emri Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Müşteri
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleInputChange('customerId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="">Müşteri seçin</option>
                    {customers.map(customer => (
                      <option key={customer._id} value={customer._id}>
                        {customer.firstName} {customer.lastName} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İş Emri
                  </label>
                  <select
                    value={formData.workOrderId}
                    onChange={(e) => handleInputChange('workOrderId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="">İş emri seçin</option>
                    {workOrders.map(order => (
                      <option key={order._id} value={order._id}>
                        {order.title} - {order.customer.firstName} {order.customer.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Payment and Scheduling */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Ödeme ve Planlama
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Yöntemi
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Seçiniz</option>
                  {getPaymentMethods().map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                  <option value="overdue">Gecikmiş</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
            </div>

            {/* Payment Terms and Due Date */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Vadesi
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  {getPaymentTerms().map(term => (
                    <option key={term.value} value={term.value}>{term.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vade Tarihi
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Invoice and Recurring */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Fatura ve Tekrarlama
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fatura Numarası
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="FAT-2024-001"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => handleInputChange('recurring', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                  Tekrarlayan Kayıt
                </label>
              </div>
            </div>

            {formData.recurring && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekrarlama Sıklığı
                  </label>
                  <select
                    value={formData.recurringPattern}
                    onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="none">Tekrarlama yok</option>
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="biweekly">İki haftalık</option>
                    <option value="monthly">Aylık</option>
                    <option value="quarterly">Üç aylık</option>
                    <option value="yearly">Yıllık</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={formData.recurringEndDate}
                    onChange={(e) => handleInputChange('recurringEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Notlar
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ek Notlar
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                placeholder="Finansal kayıt hakkında özel notlar..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Finansal Kayıt Oluştur</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
