'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: 'maintenance' | 'repair' | 'inspection' | 'emergency';
  isActive: boolean;
}

export interface Appointment {
  _id: string;
  userId: string;
  vehicleId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  estimatedDuration: number;
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  vehicleId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface AppointmentState {
  appointments: Appointment[];
  services: Service[];
  isLoading: boolean;
  error: string | null;
  selectedAppointment: Appointment | null;
}

export interface AppointmentContextType {
  state: AppointmentState;
  createAppointment: (data: AppointmentFormData) => Promise<Appointment>;
  updateAppointment: (id: string, data: Partial<AppointmentFormData>) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  getAppointments: () => Promise<void>;
  getServices: () => Promise<void>;
  selectAppointment: (appointment: Appointment | null) => void;
  clearError: () => void;
}

// Action Types
type AppointmentAction =
  | { type: 'APPOINTMENT_START' }
  | { type: 'APPOINTMENT_SUCCESS'; payload: Appointment }
  | { type: 'APPOINTMENTS_LOAD_SUCCESS'; payload: Appointment[] }
  | { type: 'SERVICES_LOAD_SUCCESS'; payload: Service[] }
  | { type: 'APPOINTMENT_FAILURE'; payload: string }
  | { type: 'APPOINTMENT_UPDATE'; payload: Appointment }
  | { type: 'APPOINTMENT_DELETE'; payload: string }
  | { type: 'SELECT_APPOINTMENT'; payload: Appointment | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: AppointmentState = {
  appointments: [],
  services: [],
  isLoading: false,
  error: null,
  selectedAppointment: null,
};

// Reducer
function appointmentReducer(state: AppointmentState, action: AppointmentAction): AppointmentState {
  switch (action.type) {
    case 'APPOINTMENT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'APPOINTMENT_SUCCESS':
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
        isLoading: false,
        error: null,
      };
    case 'APPOINTMENTS_LOAD_SUCCESS':
      return {
        ...state,
        appointments: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SERVICES_LOAD_SUCCESS':
      return {
        ...state,
        services: action.payload,
        isLoading: false,
        error: null,
      };
    case 'APPOINTMENT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'APPOINTMENT_UPDATE':
      return {
        ...state,
        appointments: state.appointments.map(apt => 
          apt._id === action.payload._id ? action.payload : apt
        ),
        isLoading: false,
        error: null,
      };
    case 'APPOINTMENT_DELETE':
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt._id !== action.payload),
        isLoading: false,
        error: null,
      };
    case 'SELECT_APPOINTMENT':
      return {
        ...state,
        selectedAppointment: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Create Context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ototakibim-mvp.onrender.com/api';

// Appointment Provider Component
export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  const { state: authState } = useAuth();

  // Load services on mount
  useEffect(() => {
    if (authState.isAuthenticated) {
      getServices();
    }
  }, [authState.isAuthenticated]);

  // Load appointments on mount
  useEffect(() => {
    if (authState.isAuthenticated) {
      getAppointments();
    }
  }, [authState.isAuthenticated]);

  // Create appointment function
  const createAppointment = async (data: AppointmentFormData): Promise<Appointment> => {
    try {
      dispatch({ type: 'APPOINTMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const appointmentData = await response.json();

      if (!response.ok) {
        throw new Error(appointmentData.message || 'Appointment creation failed');
      }

      dispatch({ type: 'APPOINTMENT_SUCCESS', payload: appointmentData });
      return appointmentData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Appointment creation failed';
      dispatch({ type: 'APPOINTMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Update appointment function
  const updateAppointment = async (id: string, data: Partial<AppointmentFormData>): Promise<Appointment> => {
    try {
      dispatch({ type: 'APPOINTMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const appointmentData = await response.json();

      if (!response.ok) {
        throw new Error(appointmentData.message || 'Appointment update failed');
      }

      dispatch({ type: 'APPOINTMENT_UPDATE', payload: appointmentData });
      return appointmentData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Appointment update failed';
      dispatch({ type: 'APPOINTMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Cancel appointment function
  const cancelAppointment = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'APPOINTMENT_START' });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Appointment cancellation failed');
      }

      // Update local state to mark as cancelled
      const updatedAppointment = state.appointments.find(apt => apt._id === id);
      if (updatedAppointment) {
        const cancelledAppointment = { ...updatedAppointment, status: 'cancelled' as const };
        dispatch({ type: 'APPOINTMENT_UPDATE', payload: cancelledAppointment });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Appointment cancellation failed';
      dispatch({ type: 'APPOINTMENT_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Get appointments function
  const getAppointments = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!authState.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const appointments = await response.json();
      dispatch({ type: 'APPOINTMENTS_LOAD_SUCCESS', payload: appointments });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch appointments';
      dispatch({ type: 'APPOINTMENT_FAILURE', payload: errorMessage });
    }
  };

  // Get services function
  const getServices = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`${API_BASE_URL}/services`);

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const services = await response.json();
      dispatch({ type: 'SERVICES_LOAD_SUCCESS', payload: services });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch services';
      dispatch({ type: 'APPOINTMENT_FAILURE', payload: errorMessage });
    }
  };

  // Select appointment function
  const selectAppointment = (appointment: Appointment | null): void => {
    dispatch({ type: 'SELECT_APPOINTMENT', payload: appointment });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AppointmentContextType = {
    state,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointments,
    getServices,
    selectAppointment,
    clearError,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

// Custom hook to use appointment context
export function useAppointment(): AppointmentContextType {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}

// Utility functions
export const getAvailableTimeSlots = (): string[] => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

export const getNextAvailableDate = (): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const isDateAvailable = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Can't book appointments in the past
  if (selectedDate < today) {
    return false;
  }
  
  // Can't book appointments on weekends (Saturday = 6, Sunday = 0)
  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  return true;
};
