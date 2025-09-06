import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  onboardingCompleted: boolean;
}

export interface WorkOrder {
  id: string;
  customerId: string;
  vehicleId: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  estimatedHours: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Store State
interface AppState {
  // UI State
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeModal: string | null;
  notifications: Notification[];
  
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  
  // Business State
  workOrders: WorkOrder[];
  customers: Customer[];
  vehicles: Vehicle[];
  
  // Loading States
  isLoading: {
    workOrders: boolean;
    customers: boolean;
    vehicles: boolean;
    auth: boolean;
  };
  
  // Error States
  errors: {
    workOrders: string | null;
    customers: string | null;
    vehicles: string | null;
    auth: string | null;
  };
}

// Store Actions
interface AppActions {
  // UI Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setActiveModal: (modal: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Auth Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setPermissions: (permissions: string[]) => void;
  
  // Business Actions
  setWorkOrders: (workOrders: WorkOrder[]) => void;
  addWorkOrder: (workOrder: WorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  removeWorkOrder: (id: string) => void;
  
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  
  // Loading Actions
  setLoading: (key: keyof AppState['isLoading'], loading: boolean) => void;
  
  // Error Actions
  setError: (key: keyof AppState['errors'], error: string | null) => void;
  clearErrors: () => void;
  
  // Reset Actions
  reset: () => void;
}

// Initial State
const initialState: AppState = {
  // UI State
  theme: 'light',
  sidebarCollapsed: false,
  activeModal: null,
  notifications: [],
  
  // Auth State
  user: null,
  isAuthenticated: false,
  permissions: [],
  
  // Business State
  workOrders: [],
  customers: [],
  vehicles: [],
  
  // Loading States
  isLoading: {
    workOrders: false,
    customers: false,
    vehicles: false,
    auth: false,
  },
  
  // Error States
  errors: {
    workOrders: null,
    customers: null,
    vehicles: null,
    auth: null,
  },
};

// Create Store
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // UI Actions
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setActiveModal: (modal) => set({ activeModal: modal }),
        
        addNotification: (notification) => set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: `notification-${Date.now()}`,
              createdAt: new Date().toISOString(),
            }
          ]
        })),
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
        
        markNotificationAsRead: (id) => set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        })),
        
        clearAllNotifications: () => set({ notifications: [] }),
        
        // Auth Actions
        setUser: (user) => set({ user }),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        setPermissions: (permissions) => set({ permissions }),
        
        // Business Actions
        setWorkOrders: (workOrders) => set({ workOrders }),
        addWorkOrder: (workOrder) => set((state) => ({
          workOrders: [...state.workOrders, workOrder]
        })),
        updateWorkOrder: (id, updates) => set((state) => ({
          workOrders: state.workOrders.map(wo => 
            wo.id === id ? { ...wo, ...updates } : wo
          )
        })),
        removeWorkOrder: (id) => set((state) => ({
          workOrders: state.workOrders.filter(wo => wo.id !== id)
        })),
        
        setCustomers: (customers) => set({ customers }),
        addCustomer: (customer) => set((state) => ({
          customers: [...state.customers, customer]
        })),
        updateCustomer: (id, updates) => set((state) => ({
          customers: state.customers.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        })),
        removeCustomer: (id) => set((state) => ({
          customers: state.customers.filter(c => c.id !== id)
        })),
        
        setVehicles: (vehicles) => set({ vehicles }),
        addVehicle: (vehicle) => set((state) => ({
          vehicles: [...state.vehicles, vehicle]
        })),
        updateVehicle: (id, updates) => set((state) => ({
          vehicles: state.vehicles.map(v => 
            v.id === id ? { ...v, ...updates } : v
          )
        })),
        removeVehicle: (id) => set((state) => ({
          vehicles: state.vehicles.filter(v => v.id !== id)
        })),
        
        // Loading Actions
        setLoading: (key, loading) => set((state) => ({
          isLoading: { ...state.isLoading, [key]: loading }
        })),
        
        // Error Actions
        setError: (key, error) => set((state) => ({
          errors: { ...state.errors, [key]: error }
        })),
        clearErrors: () => set({ errors: initialState.errors }),
        
        // Reset Actions
        reset: () => set(initialState),
      }),
      {
        name: 'ototakibim-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          permissions: state.permissions,
        }),
      }
    ),
    {
      name: 'ototakibim-store',
    }
  )
);