// Vehicle management hook for OtoTakibim
import { useCallback } from 'react';
import { useApi, useMutation, usePagination } from './useApi';
import { 
  vehicleService, 
  Vehicle, 
  CreateVehicleData, 
  UpdateVehicleData, 
  VehicleFilters,
  VehicleStats 
} from '@/services/vehicleService';

// Hook for getting all vehicles with pagination
export const useVehicles = (filters: VehicleFilters = {}) => {
  const pagination = usePagination(
    (page: number, limit: number) => vehicleService.getAllVehicles({
      ...filters,
      page,
      limit,
    }),
    10,
    [filters.search, filters.brand, filters.year, filters.status, filters.customerId]
  );

  return pagination;
};

// Hook for getting vehicle by ID
export const useVehicle = (id: string | null) => {
  return useApi(
    () => id ? vehicleService.getVehicleById(id) : Promise.resolve(null),
    [id],
    { immediate: !!id }
  );
};

// Hook for creating vehicle
export const useCreateVehicle = () => {
  return useMutation<Vehicle, CreateVehicleData>(
    vehicleService.createVehicle,
    {
      onSuccess: (data) => {
        console.log('Vehicle created successfully:', data);
      },
      onError: (error) => {
        console.error('Vehicle creation failed:', error);
      },
    }
  );
};

// Hook for updating vehicle
export const useUpdateVehicle = () => {
  return useMutation<Vehicle, { id: string; data: UpdateVehicleData }>(
    ({ id, data }) => vehicleService.updateVehicle(id, data),
    {
      onSuccess: (data) => {
        console.log('Vehicle updated successfully:', data);
      },
      onError: (error) => {
        console.error('Vehicle update failed:', error);
      },
    }
  );
};

// Hook for deleting vehicle
export const useDeleteVehicle = () => {
  return useMutation<void, string>(
    vehicleService.deleteVehicle,
    {
      onSuccess: () => {
        console.log('Vehicle deleted successfully');
      },
      onError: (error) => {
        console.error('Vehicle deletion failed:', error);
      },
    }
  );
};

// Hook for vehicle statistics
export const useVehicleStats = () => {
  return useApi<VehicleStats>(
    vehicleService.getVehicleStats,
    [],
    { immediate: true }
  );
};

// Hook for vehicles by customer
export const useVehiclesByCustomer = (customerId: string | null) => {
  return useApi<Vehicle[]>(
    () => customerId ? vehicleService.getVehiclesByCustomer(customerId) : Promise.resolve([]),
    [customerId],
    { immediate: !!customerId }
  );
};

// Hook for vehicle search
export const useVehicleSearch = (query: string) => {
  return useApi<Vehicle[]>(
    () => query ? vehicleService.searchVehicles(query) : Promise.resolve([]),
    [query],
    { immediate: !!query }
  );
};

// Hook for updating vehicle status
export const useUpdateVehicleStatus = () => {
  return useMutation<Vehicle, { id: string; status: 'active' | 'inactive' | 'maintenance' }>(
    ({ id, status }) => vehicleService.updateVehicleStatus(id, status),
    {
      onSuccess: (data) => {
        console.log('Vehicle status updated successfully:', data);
      },
      onError: (error) => {
        console.error('Vehicle status update failed:', error);
      },
    }
  );
};

// Hook for vehicle image upload
export const useUploadVehicleImage = () => {
  return useMutation<string, { vehicleId: string; file: File }>(
    ({ vehicleId, file }) => vehicleService.uploadVehicleImage(vehicleId, file),
    {
      onSuccess: (url) => {
        console.log('Vehicle image uploaded successfully:', url);
      },
      onError: (error) => {
        console.error('Vehicle image upload failed:', error);
      },
    }
  );
};

// Hook for deleting vehicle image
export const useDeleteVehicleImage = () => {
  return useMutation<void, { vehicleId: string; imageUrl: string }>(
    ({ vehicleId, imageUrl }) => vehicleService.deleteVehicleImage(vehicleId, imageUrl),
    {
      onSuccess: () => {
        console.log('Vehicle image deleted successfully');
      },
      onError: (error) => {
        console.error('Vehicle image deletion failed:', error);
      },
    }
  );
};

// Hook for vehicle maintenance history
export const useVehicleMaintenanceHistory = (vehicleId: string | null) => {
  return useApi<any[]>(
    () => vehicleId ? vehicleService.getVehicleMaintenanceHistory(vehicleId) : Promise.resolve([]),
    [vehicleId],
    { immediate: !!vehicleId }
  );
};

// Hook for vehicle service reminders
export const useVehicleServiceReminders = (vehicleId: string | null) => {
  return useApi<any[]>(
    () => vehicleId ? vehicleService.getVehicleServiceReminders(vehicleId) : Promise.resolve([]),
    [vehicleId],
    { immediate: !!vehicleId }
  );
};

// Comprehensive vehicle management hook
export const useVehicleManagement = () => {
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const updateStatus = useUpdateVehicleStatus();
  const uploadImage = useUploadVehicleImage();
  const deleteImage = useDeleteVehicleImage();

  // Helper functions
  const handleCreateVehicle = useCallback(async (vehicleData: CreateVehicleData) => {
    try {
      const result = await createVehicle.mutate(vehicleData);
      return result;
    } catch (error) {
      throw error;
    }
  }, [createVehicle]);

  const handleUpdateVehicle = useCallback(async (id: string, vehicleData: UpdateVehicleData) => {
    try {
      const result = await updateVehicle.mutate({ id, data: vehicleData });
      return result;
    } catch (error) {
      throw error;
    }
  }, [updateVehicle]);

  const handleDeleteVehicle = useCallback(async (id: string) => {
    try {
      await deleteVehicle.mutate(id);
    } catch (error) {
      throw error;
    }
  }, [deleteVehicle]);

  const handleUpdateStatus = useCallback(async (id: string, status: 'active' | 'inactive' | 'maintenance') => {
    try {
      const result = await updateStatus.mutate({ id, status });
      return result;
    } catch (error) {
      throw error;
    }
  }, [updateStatus]);

  const handleUploadImage = useCallback(async (vehicleId: string, file: File) => {
    try {
      const result = await uploadImage.mutate({ vehicleId, file });
      return result;
    } catch (error) {
      throw error;
    }
  }, [uploadImage]);

  const handleDeleteImage = useCallback(async (vehicleId: string, imageUrl: string) => {
    try {
      await deleteImage.mutate({ vehicleId, imageUrl });
    } catch (error) {
      throw error;
    }
  }, [deleteImage]);

  return {
    // Actions
    createVehicle: handleCreateVehicle,
    updateVehicle: handleUpdateVehicle,
    deleteVehicle: handleDeleteVehicle,
    updateStatus: handleUpdateStatus,
    uploadImage: handleUploadImage,
    deleteImage: handleDeleteImage,
    
    // Loading states
    isCreating: createVehicle.loading,
    isUpdating: updateVehicle.loading,
    isDeleting: deleteVehicle.loading,
    isUpdatingStatus: updateStatus.loading,
    isUploadingImage: uploadImage.loading,
    isDeletingImage: deleteImage.loading,
    
    // Errors
    createError: createVehicle.error,
    updateError: updateVehicle.error,
    deleteError: deleteVehicle.error,
    statusUpdateError: updateStatus.error,
    uploadError: uploadImage.error,
    deleteImageError: deleteImage.error,
    
    // Reset functions
    resetCreate: createVehicle.reset,
    resetUpdate: updateVehicle.reset,
    resetDelete: deleteVehicle.reset,
    resetStatusUpdate: updateStatus.reset,
    resetUpload: uploadImage.reset,
    resetDeleteImage: deleteImage.reset,
  };
};
