'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Search, 
  Plus, 
  Download, 
  Eye,
  Hash,
  Link as LinkIcon,
  Database,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BlockchainRecord {
  _id: string;
  userId: string;
  vehicleId: string;
  workOrderId?: string;
  recordType: 'service_history' | 'maintenance' | 'repair' | 'inspection' | 'warranty';
  data: {
    serviceDate: string;
    serviceType: string;
    description: string;
    parts: Array<{
      partName: string;
      partNumber: string;
      quantity: number;
      cost: number;
    }>;
    laborHours: number;
    totalCost: number;
    technician: string;
    garage: string;
    mileage: number;
    nextServiceDate?: string;
  };
  hash: string;
  previousHash?: string;
  blockNumber: number;
  transactionId: string;
  isVerified: boolean;
  verificationDate?: string;
  verifiedBy?: string;
  metadata: {
    ipfsHash?: string;
    timestamp: string;
    version: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BlockchainStats {
  totalRecords: number;
  verifiedRecords: number;
  pendingRecords: number;
  verificationRate: number;
  latestBlockNumber: number;
  firstBlockDate?: string;
  lastBlockDate?: string;
}

export default function BlockchainPage() {
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<BlockchainRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/blockchain/stats');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch demo records (in real app, this would be user-specific)
      const demoResponse = await fetch('/api/blockchain/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user-id',
          vehicleId: 'demo-vehicle-id'
        })
      });
      
      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        if (demoData.success) {
          setRecords(demoData.data);
        }
      }
    } catch (error) {
      console.error('Blockchain data fetch error:', error);
      toast.error('Blockchain verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const verifyRecord = async (recordId: string) => {
    try {
      const response = await fetch(`/api/blockchain/records/${recordId}/verify`, {
        method: 'POST'
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Kayıt doğrulandı!');
        fetchBlockchainData(); // Refresh data
      } else {
        toast.error(data.message || 'Doğrulama başarısız');
      }
    } catch (error) {
      toast.error('Doğrulama sırasında hata oluştu');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.data.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.data.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || record.recordType === filterType;
    const matchesVerified = filterVerified === 'all' || 
                           (filterVerified === 'verified' && record.isVerified) ||
                           (filterVerified === 'pending' && !record.isVerified);
    
    return matchesSearch && matchesType && matchesVerified;
  });

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'warranty': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return '🔧';
      case 'repair': return '🔨';
      case 'inspection': return '🔍';
      case 'warranty': return '🛡️';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Blockchain Dashboard
                </h1>
                <p className="text-gray-600 text-sm">Servis geçmişi doğrulama sistemi</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchBlockchainData}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
            >
              Yenile
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Kayıt</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalRecords || 0}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Doğrulanmış</p>
                <p className="text-3xl font-bold text-green-600">{stats?.verifiedRecords || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Bekleyen</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.pendingRecords || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Doğrulama Oranı</p>
                <p className="text-3xl font-bold text-purple-600">{(stats?.verificationRate || 0).toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Kayıt ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Türler</option>
              <option value="maintenance">Bakım</option>
              <option value="repair">Tamir</option>
              <option value="inspection">Muayene</option>
              <option value="warranty">Garanti</option>
            </select>
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="verified">Doğrulanmış</option>
              <option value="pending">Bekleyen</option>
            </select>
          </div>
        </div>

        {/* Records List */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Blockchain Kayıtları</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getRecordTypeIcon(record.recordType)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{record.data.serviceType}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.recordType)}`}>
                          {record.recordType}
                        </span>
                        {record.isVerified ? (
                          <span className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Doğrulanmış
                          </span>
                        ) : (
                          <span className="flex items-center text-orange-600 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            Bekliyor
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{record.data.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Blok #{record.blockNumber}</span>
                        <span>•</span>
                        <span>{new Date(record.data.serviceDate).toLocaleDateString('tr-TR')}</span>
                        <span>•</span>
                        <span>{record.data.technician}</span>
                        <span>•</span>
                        <span>{record.data.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowRecordModal(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="h-5 w-5" />
                    </motion.button>
                    {!record.isVerified && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => verifyRecord(record._id)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {showRecordModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Kayıt Detayları</h2>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Service Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Servis Bilgileri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Servis Türü</p>
                      <p className="font-medium">{selectedRecord.data.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tarih</p>
                      <p className="font-medium">{new Date(selectedRecord.data.serviceDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teknisyen</p>
                      <p className="font-medium">{selectedRecord.data.technician}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Servis</p>
                      <p className="font-medium">{selectedRecord.data.garage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kilometre</p>
                      <p className="font-medium">{selectedRecord.data.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Toplam Maliyet</p>
                      <p className="font-medium">{selectedRecord.data.totalCost.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                </div>

                {/* Parts */}
                {selectedRecord.data.parts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Kullanılan Parçalar</h3>
                    <div className="space-y-2">
                      {selectedRecord.data.parts.map((part, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{part.partName}</p>
                            <p className="text-sm text-gray-600">{part.partNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{part.quantity} adet</p>
                            <p className="text-sm text-gray-600">{part.cost.toLocaleString('tr-TR')} ₺</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blockchain Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Blockchain Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Hash</p>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded">{selectedRecord.hash}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Transaction ID</p>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded">{selectedRecord.transactionId}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Blok Numarası</p>
                        <p className="font-medium">{selectedRecord.blockNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Durum</p>
                        <p className="font-medium">
                          {selectedRecord.isVerified ? (
                            <span className="text-green-600">Doğrulanmış</span>
                          ) : (
                            <span className="text-orange-600">Bekliyor</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
