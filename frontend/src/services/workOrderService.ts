// Work Order management service for OtoTakibim
import { api, handleApiError, uploadFile } from './api';

export interface WorkOrder {
  _id: string;
  orderNumber: string;
  customerId: string;
  vehicleId: string;
  customer?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  vehicle?: {
    _id: string;
    plate: string;
    brand: string;
    vehicleModel: string;
    year: number;
  };
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  estimatedHours: number;
  actualHours?: number;
  estimatedCost: number;
  actualCost?: number;
  startDate?: string;
  endDate?: string;
  assignedTechnician?: string;
  technician?: {
    _id: string;
    name: string;
    email: string;
  };
  services: WorkOrderService[];
  parts: WorkOrderPart[];
  images?: string[];
  documents?: string[];
  notes?: string;
  customerNotes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderService {
  _id?: string;
  serviceId: string;
  serviceName: string;
  description: string;
  estimatedHours: number;
  actualHours?: number;
  estimatedCost: number;
  actualCost?: number;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

export interface WorkOrderPart {
  _id?: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier?: string;
  status: 'ordered' | 'received' | 'installed';
  notes?: string;
}

export interface CreateWorkOrderData {
  customerId: string;
  vehicleId: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  estimatedCost: number;
  services: Omit<WorkOrderService, '_id'>[];
  parts?: Omit<WorkOrderPart, '_id'>[];
  images?: File[];
  documents?: File[];
  notes?: string;
  customerNotes?: string;
}

export interface UpdateWorkOrderData extends Partial<CreateWorkOrderData> {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  actualHours?: number;
  actualCost?: number;
  startDate?: string;
  endDate?: string;
  assignedTechnician?: string;
  internalNotes?: string;
}

export interface WorkOrderFilters {
  search?: string;
  status?: string;
  priority?: string;
  customerId?: string;
  vehicleId?: string;
  technicianId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface WorkOrderStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  on_hold: number;
  totalRevenue: number;
  averageCompletionTime: number;
  byPriority: { [key: string]: number };
  byStatus: { [key: string]: number };
}

export const workOrderService = {
  // Get all work orders with filters
  getAllWorkOrders: async (filters: WorkOrderFilters = {}): Promise<{
    workOrders: WorkOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.vehicleId) params.append('vehicleId', filters.vehicleId);
      if (filters.technicianId) params.append('technicianId', filters.technicianId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<{
        workOrders: WorkOrder[];
        total: number;
        page: number;
        totalPages: number;
      }>(`/work-orders?${params.toString()}`);
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get work order by ID
  getWorkOrderById: async (id: string): Promise<WorkOrder> => {
    try {
      const response = await api.get<WorkOrder>(`/work-orders/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new work order
  createWorkOrder: async (workOrderData: CreateWorkOrderData): Promise<WorkOrder> => {
    try {
      const formData = new FormData();
      
      // Add basic work order data
      Object.entries(workOrderData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'documents' && value !== undefined) {
          if (key === 'services' || key === 'parts') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Upload images if any
      if (workOrderData.images && workOrderData.images.length > 0) {
        for (let i = 0; i < workOrderData.images.length; i++) {
          formData.append('images', workOrderData.images[i]);
        }
      }
      
      // Upload documents if any
      if (workOrderData.documents && workOrderData.documents.length > 0) {
        for (let i = 0; i < workOrderData.documents.length; i++) {
          formData.append('documents', workOrderData.documents[i]);
        }
      }
      
      const response = await api.post<WorkOrder>('/work-orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update work order
  updateWorkOrder: async (id: string, workOrderData: UpdateWorkOrderData): Promise<WorkOrder> => {
    try {
      const formData = new FormData();
      
      // Add basic work order data
      Object.entries(workOrderData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'documents' && value !== undefined) {
          if (key === 'services' || key === 'parts') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Upload new images if any
      if (workOrderData.images && workOrderData.images.length > 0) {
        for (let i = 0; i < workOrderData.images.length; i++) {
          formData.append('images', workOrderData.images[i]);
        }
      }
      
      // Upload new documents if any
      if (workOrderData.documents && workOrderData.documents.length > 0) {
        for (let i = 0; i < workOrderData.documents.length; i++) {
          formData.append('documents', workOrderData.documents[i]);
        }
      }
      
      const response = await api.put<WorkOrder>(`/work-orders/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete work order
  deleteWorkOrder: async (id: string): Promise<void> => {
    try {
      await api.delete(`/work-orders/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update work order status
  updateWorkOrderStatus: async (id: string, status: WorkOrder['status']): Promise<WorkOrder> => {
    try {
      const response = await api.patch<WorkOrder>(`/work-orders/${id}/status`, { status });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Assign technician to work order
  assignTechnician: async (id: string, technicianId: string): Promise<WorkOrder> => {
    try {
      const response = await api.patch<WorkOrder>(`/work-orders/${id}/assign`, { technicianId });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Start work order
  startWorkOrder: async (id: string): Promise<WorkOrder> => {
    try {
      const response = await api.patch<WorkOrder>(`/work-orders/${id}/start`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Complete work order
  completeWorkOrder: async (id: string, actualHours: number, actualCost: number): Promise<WorkOrder> => {
    try {
      const response = await api.patch<WorkOrder>(`/work-orders/${id}/complete`, {
        actualHours,
        actualCost
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get work order statistics
  getWorkOrderStats: async (): Promise<WorkOrderStats> => {
    try {
      const response = await api.get<WorkOrderStats>('/work-orders/stats');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get work orders by customer
  getWorkOrdersByCustomer: async (customerId: string): Promise<WorkOrder[]> => {
    try {
      const response = await api.get<WorkOrder[]>(`/work-orders/customer/${customerId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get work orders by vehicle
  getWorkOrdersByVehicle: async (vehicleId: string): Promise<WorkOrder[]> => {
    try {
      const response = await api.get<WorkOrder[]>(`/work-orders/vehicle/${vehicleId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get work orders by technician
  getWorkOrdersByTechnician: async (technicianId: string): Promise<WorkOrder[]> => {
    try {
      const response = await api.get<WorkOrder[]>(`/work-orders/technician/${technicianId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Search work orders
  searchWorkOrders: async (query: string): Promise<WorkOrder[]> => {
    try {
      const response = await api.get<WorkOrder[]>(`/work-orders/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Upload work order image
  uploadWorkOrderImage: async (workOrderId: string, file: File): Promise<string> => {
    try {
      const response = await uploadFile(file, `/work-orders/${workOrderId}/images`);
      return response.url;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete work order image
  deleteWorkOrderImage: async (workOrderId: string, imageUrl: string): Promise<void> => {
    try {
      await api.delete(`/work-orders/${workOrderId}/images`, {
        data: { imageUrl }
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generate work order report
  generateWorkOrderReport: async (filters: WorkOrderFilters = {}): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/work-orders/report?${params.toString()}`, {
        responseType: 'blob'
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
