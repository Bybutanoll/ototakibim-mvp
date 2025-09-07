// Appointment management service for OtoTakibim
import { api, handleApiError } from './api';

export interface Appointment {
  _id: string;
  appointmentNumber: string;
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
  serviceType: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTechnician?: string;
  technician?: {
    _id: string;
    name: string;
    email: string;
  };
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  customerNotes?: string;
  internalNotes?: string;
  reminderSent: boolean;
  reminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  customerId: string;
  vehicleId: string;
  serviceType: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTechnician?: string;
  estimatedCost: number;
  notes?: string;
  customerNotes?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  actualDuration?: number;
  actualCost?: number;
  internalNotes?: string;
  reminderSent?: boolean;
}

export interface AppointmentFilters {
  search?: string;
  status?: string;
  priority?: string;
  customerId?: string;
  vehicleId?: string;
  technicianId?: string;
  serviceType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  no_show: number;
  totalRevenue: number;
  averageDuration: number;
  byStatus: { [key: string]: number };
  byPriority: { [key: string]: number };
  byServiceType: { [key: string]: number };
}

export const appointmentService = {
  // Get all appointments with filters
  getAllAppointments: async (filters: AppointmentFilters = {}): Promise<{
    appointments: Appointment[];
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
      if (filters.serviceType) params.append('serviceType', filters.serviceType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await api.get<{
        appointments: Appointment[];
        total: number;
        page: number;
        totalPages: number;
      }>(`/appointments?${params.toString()}`);
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const response = await api.get<Appointment>(`/appointments/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new appointment
  createAppointment: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    try {
      const response = await api.post<Appointment>('/appointments', appointmentData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update appointment
  updateAppointment: async (id: string, appointmentData: UpdateAppointmentData): Promise<Appointment> => {
    try {
      const response = await api.put<Appointment>(`/appointments/${id}`, appointmentData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete appointment
  deleteAppointment: async (id: string): Promise<void> => {
    try {
      await api.delete(`/appointments/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id: string, status: Appointment['status']): Promise<Appointment> => {
    try {
      const response = await api.patch<Appointment>(`/appointments/${id}/status`, { status });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Confirm appointment
  confirmAppointment: async (id: string): Promise<Appointment> => {
    try {
      const response = await api.patch<Appointment>(`/appointments/${id}/confirm`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cancel appointment
  cancelAppointment: async (id: string, reason?: string): Promise<Appointment> => {
    try {
      const response = await api.patch<Appointment>(`/appointments/${id}/cancel`, { reason });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (id: string, newDate: string, newTime: string): Promise<Appointment> => {
    try {
      const response = await api.patch<Appointment>(`/appointments/${id}/reschedule`, {
        scheduledDate: newDate,
        scheduledTime: newTime
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Assign technician to appointment
  assignTechnician: async (id: string, technicianId: string): Promise<Appointment> => {
    try {
      const response = await api.patch<Appointment>(`/appointments/${id}/assign`, { technicianId });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Start appointment
  startAppointment: async (id: string): Promise<Appointment> => {
    try {
      const response = await api.patch<Appointment>(`/appointments/${id}/start`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Complete appointment
  completeAppointment: async (id: string, actualDuration: number, actualCost: number): Promise<Appointment> => {
    try {
      const response = await api.patch<Appointment>(`/appointments/${id}/complete`, {
        actualDuration,
        actualCost
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get appointment statistics
  getAppointmentStats: async (): Promise<AppointmentStats> => {
    try {
      const response = await api.get<AppointmentStats>('/appointments/stats');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get appointments by date range
  getAppointmentsByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>(`/appointments/date-range?startDate=${startDate}&endDate=${endDate}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get appointments by customer
  getAppointmentsByCustomer: async (customerId: string): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>(`/appointments/customer/${customerId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get appointments by vehicle
  getAppointmentsByVehicle: async (vehicleId: string): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>(`/appointments/vehicle/${vehicleId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get appointments by technician
  getAppointmentsByTechnician: async (technicianId: string): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>(`/appointments/technician/${technicianId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get today's appointments
  getTodaysAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>('/appointments/today');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (days: number = 7): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>(`/appointments/upcoming?days=${days}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Search appointments
  searchAppointments: async (query: string): Promise<Appointment[]> => {
    try {
      const response = await api.get<Appointment[]>(`/appointments/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Send appointment reminder
  sendAppointmentReminder: async (id: string): Promise<void> => {
    try {
      await api.post(`/appointments/${id}/remind`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get available time slots
  getAvailableTimeSlots: async (date: string, technicianId?: string): Promise<string[]> => {
    try {
      const params = new URLSearchParams();
      params.append('date', date);
      if (technicianId) params.append('technicianId', technicianId);
      
      const response = await api.get<string[]>(`/appointments/available-slots?${params.toString()}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generate appointment report
  generateAppointmentReport: async (filters: AppointmentFilters = {}): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/appointments/report?${params.toString()}`, {
        responseType: 'blob'
      });
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
