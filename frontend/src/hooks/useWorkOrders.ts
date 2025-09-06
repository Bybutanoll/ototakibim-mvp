import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/stores/appStore';
import { WorkOrder } from '@/stores/appStore';

// API functions (mock - replace with actual API calls)
const fetchWorkOrders = async (): Promise<WorkOrder[]> => {
  // Mock data - replace with actual API call
  return [
    {
      id: '1',
      customerId: '1',
      vehicleId: '1',
      description: 'Motor bakımı',
      priority: 'high',
      status: 'pending',
      estimatedHours: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const createWorkOrder = async (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> => {
  // Mock implementation - replace with actual API call
  return {
    ...workOrder,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updateWorkOrder = async (id: string, updates: Partial<WorkOrder>): Promise<WorkOrder> => {
  // Mock implementation - replace with actual API call
  const existing = useAppStore.getState().workOrders.find(wo => wo.id === id);
  if (!existing) throw new Error('Work order not found');
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
};

const deleteWorkOrder = async (id: string): Promise<void> => {
  // Mock implementation - replace with actual API call
  console.log('Deleting work order:', id);
};

// Custom hooks
export const useWorkOrders = () => {
  const { setWorkOrders, setLoading, setError } = useAppStore();
  
  return useQuery({
    queryKey: ['workOrders'],
    queryFn: async () => {
      setLoading('workOrders', true);
      try {
        const workOrders = await fetchWorkOrders();
        setWorkOrders(workOrders);
        return workOrders;
      } catch (error) {
        setError('workOrders', error instanceof Error ? error.message : 'Failed to fetch work orders');
        throw error;
      } finally {
        setLoading('workOrders', false);
      }
    },
  });
};

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { addWorkOrder, setLoading, setError } = useAppStore();
  
  return useMutation({
    mutationFn: createWorkOrder,
    onMutate: () => {
      setLoading('workOrders', true);
    },
    onSuccess: (newWorkOrder) => {
      addWorkOrder(newWorkOrder);
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      setLoading('workOrders', false);
    },
    onError: (error) => {
      setError('workOrders', error instanceof Error ? error.message : 'Failed to create work order');
      setLoading('workOrders', false);
    },
  });
};

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { updateWorkOrder: updateWorkOrderStore, setLoading, setError } = useAppStore();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WorkOrder> }) =>
      updateWorkOrder(id, updates),
    onMutate: () => {
      setLoading('workOrders', true);
    },
    onSuccess: (updatedWorkOrder) => {
      updateWorkOrderStore(updatedWorkOrder.id, updatedWorkOrder);
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      setLoading('workOrders', false);
    },
    onError: (error) => {
      setError('workOrders', error instanceof Error ? error.message : 'Failed to update work order');
      setLoading('workOrders', false);
    },
  });
};

export const useDeleteWorkOrder = () => {
  const queryClient = useQueryClient();
  const { removeWorkOrder, setLoading, setError } = useAppStore();
  
  return useMutation({
    mutationFn: deleteWorkOrder,
    onMutate: () => {
      setLoading('workOrders', true);
    },
    onSuccess: (_, workOrderId) => {
      removeWorkOrder(workOrderId);
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      setLoading('workOrders', false);
    },
    onError: (error) => {
      setError('workOrders', error instanceof Error ? error.message : 'Failed to delete work order');
      setLoading('workOrders', false);
    },
  });
};