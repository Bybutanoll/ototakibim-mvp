'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowLeft,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Tag,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Image as ImageIcon
} from 'lucide-react';

interface InventoryItem {
  _id: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  partNumber?: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  costPrice: number;
  sellingPrice: number;
  supplier?: {
    name: string;
    contact: string;
    email?: string;
    phone?: string;
  };
  location?: {
    warehouse: string;
    shelf: string;
    bin?: string;
  };
  compatibility: Array<{
    make: string;
    model: string;
    yearFrom?: number;
    yearTo?: number;
    engineType?: string;
  }>;
  images: string[];
  tags: string[];
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

const categoryOptions = [
  { value: 'all', label: 'Tüm Kategoriler' },
  { value: 'engine', label: 'Motor' },
  { value: 'brake', label: 'Fren' },
  { value: 'suspension', label: 'Süspansiyon' },
  { value: 'electrical', label: 'Elektrik' },
  { value: 'body', label: 'Karoseri' },
  { value: 'interior', label: 'İç Donanım' },
  { value: 'exterior', label: 'Dış Donanım' },
  { value: 'transmission', label: 'Şanzıman' },
  { value: 'fuel_system', label: 'Yakıt Sistemi' },
  { value: 'cooling_system', label: 'Soğutma Sistemi' },
  { value: 'exhaust_system', label: 'Egzoz Sistemi' },
  { value: 'tire', label: 'Lastik' },
  { value: 'battery', label: 'Batarya' },
  { value: 'filter', label: 'Filtre' },
  { value: 'fluid', label: 'Sıvı' },
  { value: 'tool', label: 'Alet' },
  { value: 'other', label: 'Diğer' }
];

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0
  });

  useEffect(() => {
    if (user) {
      loadInventory();
      loadStats();
    }
  }, [user]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ototakibim-mvp.onrender.com/api';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (stockFilter === 'low') params.append('lowStock', 'true');

      const response = await fetch(`${API_BASE_URL}/api/inventory?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInventory(data.data.items || []);
      }
    } catch (error) {
      console.error('Inventory loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ototakibim-mvp.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/api/inventory/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Stats loading error:', error);
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Stokta';
      case 'low_stock': return 'Düşük Stok';
      case 'out_of_stock': return 'Stok Yok';
      default: return 'Bilinmiyor';
    }
  };

  const getCategoryLabel = (category: string) => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option ? option.label : category;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || item.stockStatus === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Envanter Yönetimi</h1>
                <p className="text-gray-600">Parça stoklarını yönetin ve takip edin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Parça</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stok Yok</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Parça adı, SKU veya marka ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg transition-colors flex items-center space-x-2 ${
                  showFilters
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtreler</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/inventory/add')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Parça Ekle</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Durumu</label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tümü</option>
                    <option value="in_stock">Stokta</option>
                    <option value="low_stock">Düşük Stok</option>
                    <option value="out_of_stock">Stok Yok</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inventory Grid */}
        <div className="mt-8">
          {filteredInventory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.sku}</p>
                        {item.brand && (
                          <p className="text-sm text-gray-500">{item.brand}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item.stockStatus)}`}>
                          {getStockStatusLabel(item.stockStatus)}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Images */}
                    {item.images && item.images.length > 0 && (
                      <div className="mb-4">
                        <div className="flex space-x-2">
                          {item.images.slice(0, 3).map((image, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          ))}
                          {item.images.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">+{item.images.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kategori:</span>
                        <span className="font-medium">{getCategoryLabel(item.category)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Miktar:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Birim Fiyat:</span>
                        <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Toplam Değer:</span>
                        <span className="font-medium text-green-600">{formatCurrency(item.totalValue)}</span>
                      </div>
                    </div>

                    {/* Location */}
                    {item.location && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location.warehouse} - {item.location.shelf}</span>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expandable Details */}
                    {expandedItem === item._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-2 text-sm">
                          {item.description && (
                            <div>
                              <span className="text-gray-600">Açıklama:</span>
                              <p className="text-gray-900 mt-1">{item.description}</p>
                            </div>
                          )}
                          {item.supplier && (
                            <div>
                              <span className="text-gray-600">Tedarikçi:</span>
                              <p className="text-gray-900 mt-1">{item.supplier.name}</p>
                            </div>
                          )}
                          {item.compatibility && item.compatibility.length > 0 && (
                            <div>
                              <span className="text-gray-600">Uyumluluk:</span>
                              <div className="mt-1 space-y-1">
                                {item.compatibility.slice(0, 2).map((comp, index) => (
                                  <p key={index} className="text-gray-900">
                                    {comp.make} {comp.model} {comp.yearFrom && `(${comp.yearFrom}-${comp.yearTo || 'Güncel'})`}
                                  </p>
                                ))}
                                {item.compatibility.length > 2 && (
                                  <p className="text-gray-500">+{item.compatibility.length - 2} daha</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between items-center">
                      <button
                        onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {expandedItem === item._id ? 'Daha Az Göster' : 'Detayları Göster'}
                      </button>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Envanter Bulunamadı</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                  ? 'Arama kriterlerinize uygun parça bulunamadı.'
                  : 'Henüz envanter öğesi eklenmemiş.'}
              </p>
              <button
                onClick={() => router.push('/dashboard/inventory/add')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                İlk Parçayı Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}