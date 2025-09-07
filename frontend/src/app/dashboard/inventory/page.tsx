'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface InventoryItem {
  _id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  margin: number;
  location: {
    warehouse: string;
    shelf: string;
    bin: string;
    zone: string;
  };
  unit: string;
  stockStatus: 'normal' | 'low-stock' | 'out-of-stock' | 'overstock';
  needsReorder: boolean;
  stockValue: number;
  createdAt: string;
  updatedAt: string;
}

const InventoryPage = () => {
  const { user } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [stats, setStats] = useState<any>(null);

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    loadInventoryItems();
      loadStats();
  }, []);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/inventory?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Stok öğeleri yüklenirken hata oluştu');
      }

      const data = await response.json();
      setInventoryItems(data.data || []);
    } catch (error) {
      console.error('Error loading inventory items:', error);
      toast.error('Stok öğeleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('İstatistikler yüklenirken hata oluştu');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadInventoryItems();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'low-stock':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'out-of-stock':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'overstock':
        return <ChartBarIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <CubeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStockStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'normal': 'Normal',
      'low-stock': 'Düşük Stok',
      'out-of-stock': 'Stok Yok',
      'overstock': 'Fazla Stok'
    };
    return labels[status] || status;
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'overstock':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredInventoryItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStockStatus = stockStatusFilter === 'all' || item.stockStatus === stockStatusFilter;

    return matchesSearch && matchesCategory && matchesStockStatus;
  });

  const categories = [...new Set(inventoryItems.map(item => item.category))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stok Yönetimi</h1>
        <p className="text-gray-600">Stok öğelerinizi yönetin ve takip edin</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <CubeIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Öğe</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                <p className="text-2xl font-bold text-gray-900">₺{stats.totalValue?.toLocaleString('tr-TR')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <ExclamationTriangleIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <XCircleIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stok Yok</p>
                <p className="text-2xl font-bold text-gray-900">{stats.outOfStockItems}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
            placeholder="Stok öğesi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
          <option value="all">Tüm Kategoriler</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="normal">Normal</option>
          <option value="low-stock">Düşük Stok</option>
          <option value="out-of-stock">Stok Yok</option>
          <option value="overstock">Fazla Stok</option>
        </select>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Yeni Stok Öğesi
        </button>
                </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Stok öğeleri yükleniyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parça Bilgileri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Durumu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat Bilgileri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Değeri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventoryItems.map((item) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CubeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.partNumber} • {item.brand}
                </div>
                          <div className="text-xs text-gray-400">
                            {item.category}
              </div>
            </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStockStatusIcon(item.stockStatus)}
                        <span className="text-sm font-medium text-gray-900">
                          {getStockStatusLabel(item.stockStatus)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Mevcut: {item.currentStock} {item.unit}
                      </div>
                      <div className="text-xs text-gray-400">
                        Min: {item.minimumStock} • Max: {item.maximumStock}
                      </div>
                      {item.needsReorder && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200 mt-1">
                          Sipariş Gerekli
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Maliyet: ₺{item.costPrice.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-sm text-gray-900">
                        Satış: ₺{item.sellingPrice.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Kar: %{item.margin.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{item.location.warehouse}</div>
                      <div className="text-gray-500">
                        {item.location.shelf} • {item.location.bin}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.location.zone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₺{item.stockValue.toLocaleString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

      {filteredInventoryItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Stok öğesi bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || categoryFilter !== 'all' || stockStatusFilter !== 'all' 
              ? 'Arama kriterlerinize uygun stok öğesi bulunamadı.'
              : 'Henüz hiç stok öğesi eklenmemiş.'
            }
          </p>
      </div>
      )}
    </div>
  );
};

export default InventoryPage;