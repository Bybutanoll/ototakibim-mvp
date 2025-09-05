'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, X, Save, AlertCircle, Calendar, DollarSign, Gauge } from 'lucide-react';

interface MaintenanceFormData {
  date: string;
  type: 'service' | 'repair' | 'inspection';
  description: string;
  cost: number;
  mileage: number;
  workshop?: string;
  nextServiceDate?: string;
  nextServiceMileage?: number;
}

interface MaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (maintenanceData: MaintenanceFormData) => void;
  editingMaintenance?: any;
  vehicleId: string;
  currentMileage: number;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMaintenance,
  vehicleId,
  currentMileage
}) => {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    date: new Date().toISOString().split('T')[0],
    type: 'service',
    description: '',
    cost: 0,
    mileage: currentMileage,
    workshop: '',
    nextServiceDate: '',
    nextServiceMileage: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingMaintenance) {
      setFormData({
        date: editingMaintenance.date ? new Date(editingMaintenance.date).toISOString().split('T')[0] : '',
        type: editingMaintenance.type || 'service',
        description: editingMaintenance.description || '',
        cost: editingMaintenance.cost || 0,
        mileage: editingMaintenance.mileage || currentMileage,
        workshop: editingMaintenance.workshop || '',
        nextServiceDate: editingMaintenance.nextServiceDate ? new Date(editingMaintenance.nextServiceDate).toISOString().split('T')[0] : '',
        nextServiceMileage: editingMaintenance.nextServiceMileage || 0
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'service',
        description: '',
        cost: 0,
        mileage: currentMileage,
        workshop: '',
        nextServiceDate: '',
        nextServiceMileage: 0
      });
    }
    setErrors({});
  }, [editingMaintenance, isOpen, currentMileage]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Tarih gereklidir';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Açıklama en az 10 karakter olmalıdır';
    }

    if (formData.cost < 0) {
      newErrors.cost = 'Maliyet negatif olamaz';
    }

    if (formData.mileage < 0) {
      newErrors.mileage = 'Kilometre negatif olamaz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'mileage' || name === 'nextServiceMileage' 
        ? parseFloat(value) || 0 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Maintenance save error:', error);
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMaintenance ? 'Bakım Kaydı Düzenle' : 'Yeni Bakım Kaydı'}
                </h2>
                <p className="text-sm text-gray-600">
                  {editingMaintenance ? 'Bakım bilgilerini güncelleyin' : 'Bakım bilgilerini girin'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Tarih *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wrench className="w-4 h-4 inline mr-1" />
                Bakım Türü *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="service">Bakım</option>
                <option value="repair">Tamir</option>
                <option value="inspection">Muayene</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gauge className="w-4 h-4 inline mr-1" />
                Kilometre
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.mileage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.mileage && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.mileage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Maliyet (₺)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.cost ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.cost && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.cost}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Yapılan işlemler, değiştirilen parçalar, öneriler..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Workshop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servis/Atölye
            </label>
            <input
              type="text"
              name="workshop"
              value={formData.workshop}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Servis adı veya atölye bilgisi"
            />
          </div>

          {/* Next Service */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Sonraki Bakım Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sonraki Bakım Tarihi
                </label>
                <input
                  type="date"
                  name="nextServiceDate"
                  value={formData.nextServiceDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sonraki Bakım Kilometresi
                </label>
                <input
                  type="number"
                  name="nextServiceMileage"
                  value={formData.nextServiceMileage}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingMaintenance ? 'Güncelle' : 'Kaydet'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
