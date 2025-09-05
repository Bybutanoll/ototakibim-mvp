'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  DollarSign, 
  Gauge, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';
import MaintenanceForm from './MaintenanceForm';

interface MaintenanceRecord {
  _id: string;
  date: string;
  type: 'service' | 'repair' | 'inspection';
  description: string;
  cost: number;
  mileage: number;
  workshop?: string;
  nextServiceDate?: string;
  nextServiceMileage?: number;
  createdAt: string;
}

interface MaintenanceHistoryProps {
  vehicleId: string;
  currentMileage: number;
  maintenanceHistory: MaintenanceRecord[];
  onMaintenanceUpdate: () => void;
}

const MaintenanceHistory: React.FC<MaintenanceHistoryProps> = ({
  vehicleId,
  currentMileage,
  maintenanceHistory,
  onMaintenanceUpdate
}) => {
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRecord | null>(null);

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return <Settings className="w-4 h-4" />;
      case 'repair': return <Wrench className="w-4 h-4" />;
      case 'inspection': return <CheckCircle className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Bakım';
      case 'repair': return 'Tamir';
      case 'inspection': return 'Muayene';
      default: return 'Bakım';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSaveMaintenance = async (maintenanceData: any) => {
    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const url = editingMaintenance 
        ? `${API_BASE_URL}/api/vehicles/${vehicleId}/maintenance/${editingMaintenance._id}`
        : `${API_BASE_URL}/api/vehicles/${vehicleId}/maintenance`;

      const response = await fetch(url, {
        method: editingMaintenance ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceData),
      });

      if (response.ok) {
        onMaintenanceUpdate();
        setEditingMaintenance(null);
        setShowMaintenanceForm(false);
      } else {
        throw new Error('Maintenance save failed');
      }
    } catch (error) {
      console.error('Maintenance save error:', error);
      throw error;
    }
  };

  const handleEditMaintenance = (maintenance: MaintenanceRecord) => {
    setEditingMaintenance(maintenance);
    setShowMaintenanceForm(true);
  };

  const handleDeleteMaintenance = async (maintenanceId: string) => {
    if (!confirm('Bu bakım kaydını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('ototakibim_token');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/maintenance/${maintenanceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onMaintenanceUpdate();
      } else {
        throw new Error('Maintenance delete failed');
      }
    } catch (error) {
      console.error('Maintenance delete error:', error);
    }
  };

  const handleAddMaintenance = () => {
    setEditingMaintenance(null);
    setShowMaintenanceForm(true);
  };

  // Calculate total maintenance cost
  const totalCost = maintenanceHistory.reduce((sum, record) => sum + record.cost, 0);

  // Get next service info
  const nextService = maintenanceHistory
    .filter(record => record.nextServiceDate || record.nextServiceMileage)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .pop();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bakım Geçmişi</h3>
          <p className="text-sm text-gray-600">
            {maintenanceHistory.length} kayıt • Toplam maliyet: {formatCurrency(totalCost)}
          </p>
        </div>
        <button
          onClick={handleAddMaintenance}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Bakım Ekle</span>
        </button>
      </div>

      {/* Next Service Alert */}
      {nextService && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Sonraki Bakım</h4>
              <div className="mt-2 space-y-1 text-sm text-blue-800">
                {nextService.nextServiceDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Tarih: {formatDate(nextService.nextServiceDate)}</span>
                  </div>
                )}
                {nextService.nextServiceMileage && (
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4" />
                    <span>Kilometre: {nextService.nextServiceMileage.toLocaleString('tr-TR')} km</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Records */}
      {maintenanceHistory.length > 0 ? (
        <div className="space-y-4">
          {maintenanceHistory
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((record) => (
              <div key={record._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${getServiceTypeColor(record.type)}`}>
                        {getServiceTypeIcon(record.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {getServiceTypeLabel(record.type)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(record.date)}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{record.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Maliyet:</span>
                        <span className="font-medium">{formatCurrency(record.cost)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gauge className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">KM:</span>
                        <span className="font-medium">{record.mileage.toLocaleString('tr-TR')}</span>
                      </div>
                      {record.workshop && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-600">Servis:</span>
                          <span className="font-medium">{record.workshop}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600">Eklenme:</span>
                        <span className="font-medium">{formatDate(record.createdAt)}</span>
                      </div>
                    </div>

                    {/* Next Service Info */}
                    {(record.nextServiceDate || record.nextServiceMileage) && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 mb-2">Sonraki Bakım</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {record.nextServiceDate && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-800">{formatDate(record.nextServiceDate)}</span>
                            </div>
                          )}
                          {record.nextServiceMileage && (
                            <div className="flex items-center space-x-2">
                              <Gauge className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-800">{record.nextServiceMileage.toLocaleString('tr-TR')} km</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditMaintenance(record)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaintenance(record._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Bakım Kaydı Yok</h3>
          <p className="text-gray-600 mb-6">
            Bu araç için henüz bakım kaydı eklenmemiş. İlk bakım kaydını ekleyerek başlayın.
          </p>
          <button
            onClick={handleAddMaintenance}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            İlk Bakım Kaydını Ekle
          </button>
        </div>
      )}

      {/* Maintenance Form Modal */}
      <MaintenanceForm
        isOpen={showMaintenanceForm}
        onClose={() => {
          setShowMaintenanceForm(false);
          setEditingMaintenance(null);
        }}
        onSave={handleSaveMaintenance}
        editingMaintenance={editingMaintenance}
        vehicleId={vehicleId}
        currentMileage={currentMileage}
      />
    </div>
  );
};

export default MaintenanceHistory;
