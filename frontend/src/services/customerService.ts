// Customer management service for OtoTakibim
import { api, handleApiError } from './api';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  company?: string;
  taxNumber?: string;
  customerType: 'individual' | 'corporate';
  status: 'active' | 'inactive' | 'suspended';
  notes?: string;
  preferredContactMethod: 'email' | 'phone' | 'sms';
  vehicles?: string[];
  totalSpent: number;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  company?: string;
  taxNumber?: string;
  customerType: 'individual' | 'corporate';
  notes?: string;
  preferredContactMethod: 'email' | 'phone' | 'sms';
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  status?: 'active' | 'inactive' | 'suspended';
}

export interface CustomerFilters {
  search?: string;
  customerType?: string;
  status?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  individual: number;
  corporate: number;
  totalRevenue: number;
  averageSpent: number;
  byCity: { [key: string]: number };
  byType: { [key: string]: number };
}

export const customerService = {
  // Get all customers with filters
  getAllCustomers: async (filters: CustomerFilters = {}): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.customerType) params.append('customerType', filters.customerType);
      if (filters.status) params.append('status', filters.status);
      if (filters.city) params.append('city', filters.city);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<{
        customers: Customer[];
        total: number;
        page: number;
        totalPages: number;
      }>(`/customers?${params.toString()}`);
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get customer by ID
  getCustomerById: async (id: string): Promise<Customer> => {
    try {
      const response = await api.get<Customer>(`/customers/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new customer
  createCustomer: async (customerData: CreateCustomerData): Promise<Customer> => {
    try {
      const response = await api.post<Customer>('/customers', customerData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update customer
  updateCustomer: async (id: string, customerData: UpdateCustomerData): Promise<Customer> => {
    try {
      const response = await api.put<Customer>(`/customers/${id}`, customerData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update customer status
  updateCustomerStatus: async (id: string, status: 'active' | 'inactive' | 'suspended'): Promise<Customer> => {
    try {
      const response = await api.patch<Customer>(`/customers/${id}/status`, { status });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get customer statistics
  getCustomerStats: async (): Promise<CustomerStats> => {
    try {
      const response = await api.get<CustomerStats>('/customers/stats');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Search customers
  searchCustomers: async (query: string): Promise<Customer[]> => {
    try {
      const response = await api.get<Customer[]>(`/customers/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get customer vehicles
  getCustomerVehicles: async (customerId: string): Promise<any[]> => {
    try {
      const response = await api.get<any[]>(`/customers/${customerId}/vehicles`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get customer work orders
  getCustomerWorkOrders: async (customerId: string): Promise<any[]> => {
    try {
      const response = await api.get<any[]>(`/customers/${customerId}/work-orders`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get customer history
  getCustomerHistory: async (customerId: string): Promise<any[]> => {
    try {
      const response = await api.get<any[]>(`/customers/${customerId}/history`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Send customer notification
  sendCustomerNotification: async (customerId: string, message: string, type: 'email' | 'sms' | 'phone'): Promise<void> => {
    try {
      await api.post(`/customers/${customerId}/notify`, {
        message,
        type
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get customer analytics
  getCustomerAnalytics: async (customerId: string): Promise<any> => {
    try {
      const response = await api.get<any>(`/customers/${customerId}/analytics`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Export customers
  exportCustomers: async (filters: CustomerFilters = {}): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/customers/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Import customers
  importCustomers: async (file: File): Promise<{ imported: number; errors: any[] }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<{ imported: number; errors: any[] }>('/customers/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
