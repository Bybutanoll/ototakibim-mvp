// Vehicle management service for OtoTakibim
import { api, handleApiError, uploadFile } from './api';

export interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  vehicleModel: string;
  year: number;
  color: string;
  mileage: number;
  vin?: string;
  engineType?: string;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  customerId: string;
  customer?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  images?: string[];
  documents?: string[];
  lastService?: string;
  nextService?: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleData {
  plate: string;
  brand: string;
  vehicleModel: string;
  year: number;
  color: string;
  mileage: number;
  vin?: string;
  engineType?: string;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  customerId: string;
  images?: File[];
  documents?: File[];
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface VehicleFilters {
  search?: string;
  brand?: string;
  year?: number;
  status?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export interface VehicleStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  byBrand: { [key: string]: number };
  byYear: { [key: string]: number };
}

export const vehicleService = {
  // Get all vehicles with filters
  getAllVehicles: async (filters: VehicleFilters = {}): Promise<{
    vehicles: Vehicle[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<{
        vehicles: Vehicle[];
        total: number;
        page: number;
        totalPages: number;
      }>(`/vehicles?${params.toString()}`);
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id: string): Promise<Vehicle> => {
    try {
      const response = await api.get<Vehicle>(`/vehicles/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData: CreateVehicleData): Promise<Vehicle> => {
    try {
      // Handle file uploads first
      const formData = new FormData();
      
      // Add basic vehicle data
      Object.entries(vehicleData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'documents' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Upload images if any
      if (vehicleData.images && vehicleData.images.length > 0) {
        for (let i = 0; i < vehicleData.images.length; i++) {
          formData.append('images', vehicleData.images[i]);
        }
      }
      
      // Upload documents if any
      if (vehicleData.documents && vehicleData.documents.length > 0) {
        for (let i = 0; i < vehicleData.documents.length; i++) {
          formData.append('documents', vehicleData.documents[i]);
        }
      }
      
      const response = await api.post<Vehicle>('/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update vehicle
  updateVehicle: async (id: string, vehicleData: UpdateVehicleData): Promise<Vehicle> => {
    try {
      const formData = new FormData();
      
      // Add basic vehicle data
      Object.entries(vehicleData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'documents' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Upload new images if any
      if (vehicleData.images && vehicleData.images.length > 0) {
        for (let i = 0; i < vehicleData.images.length; i++) {
          formData.append('images', vehicleData.images[i]);
        }
      }
      
      // Upload new documents if any
      if (vehicleData.documents && vehicleData.documents.length > 0) {
        for (let i = 0; i < vehicleData.documents.length; i++) {
          formData.append('documents', vehicleData.documents[i]);
        }
      }
      
      const response = await api.put<Vehicle>(`/vehicles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete vehicle
  deleteVehicle: async (id: string): Promise<void> => {
    try {
      await api.delete(`/vehicles/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get vehicle statistics
  getVehicleStats: async (): Promise<VehicleStats> => {
    try {
      const response = await api.get<VehicleStats>('/vehicles/stats');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get vehicles by customer
  getVehiclesByCustomer: async (customerId: string): Promise<Vehicle[]> => {
    try {
      const response = await api.get<Vehicle[]>(`/vehicles/customer/${customerId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Search vehicles
  searchVehicles: async (query: string): Promise<Vehicle[]> => {
    try {
      const response = await api.get<Vehicle[]>(`/vehicles/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update vehicle status
  updateVehicleStatus: async (id: string, status: 'active' | 'inactive' | 'maintenance'): Promise<Vehicle> => {
    try {
      const response = await api.patch<Vehicle>(`/vehicles/${id}/status`, { status });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Upload vehicle image
  uploadVehicleImage: async (vehicleId: string, file: File): Promise<string> => {
    try {
      const response = await uploadFile(file, `/vehicles/${vehicleId}/images`);
      return response.url;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete vehicle image
  deleteVehicleImage: async (vehicleId: string, imageUrl: string): Promise<void> => {
    try {
      await api.delete(`/vehicles/${vehicleId}/images`, {
        data: { imageUrl }
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get vehicle maintenance history
  getVehicleMaintenanceHistory: async (vehicleId: string): Promise<any[]> => {
    try {
      const response = await api.get<any[]>(`/vehicles/${vehicleId}/maintenance`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get vehicle service reminders
  getVehicleServiceReminders: async (vehicleId: string): Promise<any[]> => {
    try {
      const response = await api.get<any[]>(`/vehicles/${vehicleId}/reminders`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
