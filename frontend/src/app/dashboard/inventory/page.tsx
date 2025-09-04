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
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Truck,
  DollarSign,
  BarChart3,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

interface InventoryItem {
  _id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  supplier: {
    _id: string;
    name: string;
    contact: string;
  };
  lastRestocked: Date;
  lastUsed: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  location: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Supplier {
  _id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: Array<{ name: string; count: number; value: number }>;
  topSuppliers: Array<{ name: string; items: number; value: number }>;
  monthlyUsage: Array<{ month: string; items: number; value: number }>;
}

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);

  useEffect(() => {
    if (user) {
      loadInventoryData();
      loadSuppliers();
    }
  }, [user]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('ototakibim_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInventoryItems(data.data || []);
        calculateStats(data.data || []);
      } else {
        // Fallback to mock data for demo
        const mockItems: InventoryItem[] = [
          {
            _id: '1',
            partNumber: 'OIL-001',
            name: 'Motor Yağı 5W-30',
            description: 'Sentetik motor yağı, 4L',
            category: 'Motor Yağları',
            brand: 'Castrol',
            currentStock: 12,
            minStock: 5,
            maxStock: 50,
            unitPrice: 200,
            totalValue: 2400,
            supplier: {
              _id: 's1',
              name: 'Castrol Türkiye',
              contact: 'Ahmet Yılmaz'
            },
            lastRestocked: new Date('2024-09-01'),
            lastUsed: new Date('2024-09-03'),
            status: 'in-stock',
            location: 'A-1-01',
            notes: 'Premium kalite',
            createdAt: new Date('2024-08-01'),
            updatedAt: new Date('2024-09-03')
          },
          {
            _id: '2',
            partNumber: 'FILTER-002',
            name: 'Yağ Filtresi',
            description: 'Orijinal yağ filtresi',
            category: 'Filtreler',
            brand: 'Mann-Filter',
            currentStock: 3,
            minStock: 10,
            maxStock: 100,
            unitPrice: 80,
            totalValue: 240,
            supplier: {
              _id: 's2',
              name: 'Mann-Filter Türkiye',
              contact: 'Fatma Demir'
            },
            lastRestocked: new Date('2024-08-15'),
            lastUsed: new Date('2024-09-02'),
            status: 'low-stock',
            location: 'B-2-05',
            notes: 'Acil sipariş gerekli',
            createdAt: new Date('2024-07-01'),
            updatedAt: new Date('2024-09-02')
          },
          {
            _id: '3',
            partNumber: 'BRAKE-003',
            name: 'Fren Balatası',
            description: 'Ön fren balatası seti',
            category: 'Fren Sistemi',
            brand: 'Brembo',
            currentStock: 0,
            minStock: 5,
            maxStock: 20,
            unitPrice: 400,
            totalValue: 0,
            supplier: {
              _id: 's3',
              name: 'Brembo Türkiye',
              contact: 'Mehmet Kaya'
            },
            lastRestocked: new Date('2024-08-20'),
            lastUsed: new Date('2024-09-01'),
            status: 'out-of-stock',
            location: 'C-3-10',
            notes: 'Stokta yok, sipariş verildi',
            createdAt: new Date('2024-06-01'),
            updatedAt: new Date('2024-09-01')
          },
          {
            _id: '4',
            partNumber: 'AIR-004',
            name: 'Hava Filtresi',
            description: 'Motor hava filtresi',
            category: 'Filtreler',
            brand: 'K&N',
            currentStock: 25,
            minStock: 8,
            maxStock: 50,
            unitPrice: 120,
            totalValue: 3000,
            supplier: {
              _id: 's4',
              name: 'K&N Türkiye',
              contact: 'Ayşe Özkan'
            },
            lastRestocked: new Date('2024-09-02'),
            lastUsed: new Date('2024-08-28'),
            status: 'in-stock',
            location: 'B-2-08',
            notes: 'Yüksek performans',
            createdAt: new Date('2024-05-01'),
            updatedAt: new Date('2024-09-02')
          }
        ];
        setInventoryItems(mockItems);
        calculateStats(mockItems);
      }
    } catch (error) {
      console.error('Inventory loading error:', error);
      setInventoryItems([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const response = await fetch('https://ototakibim-mvp.onrender.com/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.data || []);
      } else {
        // Fallback to mock suppliers
        const mockSuppliers: Supplier[] = [
          {
            _id: 's1',
            name: 'Castrol Türkiye',
            contact: 'Ahmet Yılmaz',
            email: 'ahmet@castrol.com.tr',
            phone: '0212 555 0123',
            address: 'İstanbul, Türkiye',
            paymentTerms: '30 gün',
            rating: 4.8,
            isActive: true,
            createdAt: new Date('2024-01-01')
          },
          {
            _id: 's2',
            name: 'Mann-Filter Türkiye',
            contact: 'Fatma Demir',
            email: 'fatma@mann-filter.com.tr',
            phone: '0216 555 0456',
            address: 'Ankara, Türkiye',
            paymentTerms: '15 gün',
            rating: 4.5,
            isActive: true,
            createdAt: new Date('2024-02-01')
          }
        ];
        setSuppliers(mockSuppliers);
      }
    } catch (error) {
      console.error('Suppliers loading error:', error);
      setSuppliers([]);
    }
  };

  const calculateStats = (items: InventoryItem[]) => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = items.filter(item => item.status === 'low-stock').length;
    const outOfStockItems = items.filter(item => item.status === 'out-of-stock').length;

    // Calculate categories
    const categoryMap = new Map();
    items.forEach(item => {
      const existing = categoryMap.get(item.category) || { count: 0, value: 0 };
      categoryMap.set(item.category, {
        count: existing.count + 1,
        value: existing.value + item.totalValue
      });
    });

    const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      value: data.value
    }));

    // Calculate top suppliers
    const supplierMap = new Map();
    items.forEach(item => {
      const existing = supplierMap.get(item.supplier.name) || { items: 0, value: 0 };
      supplierMap.set(item.supplier.name, {
        items: existing.items + 1,
        value: existing.value + item.totalValue
      });
    });

    const topSuppliers = Array.from(supplierMap.entries()).map(([name, data]) => ({
      name,
      items: data.items,
      value: data.value
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    setStats({
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categories,
      topSuppliers,
      monthlyUsage: [] // Will be calculated from real data
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-stock': return 'Stokta';
      case 'low-stock': return 'Az Stok';
      case 'out-of-stock': return 'Stokta Yok';
      case 'discontinued': return 'Üretimden Kaldırıldı';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <CheckCircle className="w-4 h-4" />;
      case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out-of-stock': return <AlertTriangle className="w-4 h-4" />;
      case 'discontinued': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
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
      year: 'numeric'
    }).format(new Date(date));
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(inventoryItems.map(item => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Envanter verileri yükleniyor...</p>
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
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Envanter Yönetimi</h1>
                <p className="text-gray-600">Parça stok takibi ve tedarikçi yönetimi</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSuppliers(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Truck className="w-4 h-4" />
                <span>Tedarikçiler</span>
              </button>
              <button
                onClick={() => setShowAddItem(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Parça Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Parça</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Az Stok</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stokta Yok</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
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
                    placeholder="Parça ara..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tümü</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="in-stock">Stokta</option>
                    <option value="low-stock">Az Stok</option>
                    <option value="out-of-stock">Stokta Yok</option>
                    <option value="discontinued">Üretimden Kaldırıldı</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Items List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Envanter ({filteredItems.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredItems.length > 0 ? (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{item.partNumber}</span>
                            <span className="text-lg font-bold text-gray-900">{item.name}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span>{getStatusLabel(item.status)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Kategori:</span> {item.category}
                          </div>
                          <div>
                            <span className="font-medium">Marka:</span> {item.brand}
                          </div>
                          <div>
                            <span className="font-medium">Stok:</span> {item.currentStock} / {item.maxStock}
                          </div>
                          <div>
                            <span className="font-medium">Değer:</span> {formatCurrency(item.totalValue)}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          <span>Tedarikçi: {item.supplier.name}</span>
                          <span className="ml-4">Konum: {item.location}</span>
                          <span className="ml-4">Son Kullanım: {formatDate(item.lastUsed)}</span>
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Envanter bulunamadı</p>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İlk Parçayı Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
