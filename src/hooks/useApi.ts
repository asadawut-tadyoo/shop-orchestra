import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assemblyUnitsService } from '@/services/assemblyUnits';
import { batchesService } from '@/services/batches';
import { workOrdersService } from '@/services/workOrders';
import { stationsService } from '@/services/stations';
import { rawMaterialsService } from '@/services/rawMaterials';
import { bomService } from '@/services/bom';
import { processStepsService } from '@/services/processSteps';
import { 
  AssemblyUnit, 
  AssemblyUnitFormData,
  Batch,
  BatchFormData,
  WorkOrder,
  WorkOrderFormData,
  Station,
  StationFormData,
  RawMaterial,
  RawMaterialFormData,
  BillOfMaterials,
  ProcessStep,
  QueryParams,
  PaginatedResponse 
} from '@/types/index_BK';

// Assembly Units Hooks
export const useAssemblyUnits = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['assemblyUnits', params],
    queryFn: () => assemblyUnitsService.getAll(params),
  });
};

export const useAssemblyUnit = (id: string) => {
  return useQuery({
    queryKey: ['assemblyUnit', id],
    queryFn: () => assemblyUnitsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAssemblyUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AssemblyUnitFormData) => assemblyUnitsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assemblyUnits'] });
      toast.success('Assembly unit created successfully');
    },
    onError: () => {
      toast.error('Failed to create assembly unit');
    },
  });
};

export const useUpdateAssemblyUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssemblyUnitFormData> }) => 
      assemblyUnitsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assemblyUnits'] });
      toast.success('Assembly unit updated successfully');
    },
    onError: () => {
      toast.error('Failed to update assembly unit');
    },
  });
};

export const useDeleteAssemblyUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => assemblyUnitsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assemblyUnits'] });
      toast.success('Assembly unit deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete assembly unit');
    },
  });
};

// Batches Hooks
export const useBatches = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: () => batchesService.getAll(params),
  });
};

export const useBatch = (id: string) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BatchFormData) => batchesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch created successfully');
    },
    onError: () => {
      toast.error('Failed to create batch');
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BatchFormData> }) => 
      batchesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch updated successfully');
    },
    onError: () => {
      toast.error('Failed to update batch');
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => batchesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete batch');
    },
  });
};

// Work Orders Hooks
export const useWorkOrders = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['workOrders', params],
    queryFn: () => workOrdersService.getAll(params),
  });
};

export const useWorkOrder = (id: string) => {
  return useQuery({
    queryKey: ['workOrder', id],
    queryFn: () => workOrdersService.getById(id),
    enabled: !!id,
  });
};

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WorkOrderFormData) => workOrdersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order created successfully');
    },
    onError: () => {
      toast.error('Failed to create work order');
    },
  });
};

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkOrderFormData> }) => 
      workOrdersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order updated successfully');
    },
    onError: () => {
      toast.error('Failed to update work order');
    },
  });
};

export const useDeleteWorkOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => workOrdersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete work order');
    },
  });
};

// Stations Hooks
export const useStations = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['stations', params],
    queryFn: () => stationsService.getAll(params),
  });
};

export const useStation = (id: string) => {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StationFormData) => stationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast.success('Station created successfully');
    },
    onError: () => {
      toast.error('Failed to create station');
    },
  });
};

export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StationFormData> }) => 
      stationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast.success('Station updated successfully');
    },
    onError: () => {
      toast.error('Failed to update station');
    },
  });
};

export const useDeleteStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => stationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast.success('Station deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete station');
    },
  });
};

// Raw Materials Hooks
export const useRawMaterials = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['rawMaterials', params],
    queryFn: () => rawMaterialsService.getAll(params),
  });
};

export const useRawMaterial = (id: string) => {
  return useQuery({
    queryKey: ['rawMaterial', id],
    queryFn: () => rawMaterialsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRawMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RawMaterialFormData) => rawMaterialsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      toast.success('Raw material created successfully');
    },
    onError: () => {
      toast.error('Failed to create raw material');
    },
  });
};

export const useUpdateRawMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RawMaterialFormData> }) => 
      rawMaterialsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      toast.success('Raw material updated successfully');
    },
    onError: () => {
      toast.error('Failed to update raw material');
    },
  });
};

export const useDeleteRawMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rawMaterialsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      toast.success('Raw material deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete raw material');
    },
  });
};

// BOM Hooks
export const useBOMs = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['boms', params],
    queryFn: () => bomService.getAll(params),
  });
};

export const useBOM = (id: string) => {
  return useQuery({
    queryKey: ['bom', id],
    queryFn: () => bomService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBOM = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<BillOfMaterials, 'id' | 'createdAt' | 'updatedAt'>) => bomService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toast.success('BOM created successfully');
    },
    onError: () => {
      toast.error('Failed to create BOM');
    },
  });
};

export const useUpdateBOM = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BillOfMaterials> }) => 
      bomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toast.success('BOM updated successfully');
    },
    onError: () => {
      toast.error('Failed to update BOM');
    },
  });
};

export const useDeleteBOM = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => bomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boms'] });
      toast.success('BOM deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete BOM');
    },
  });
};

// Process Steps Hooks
export const useProcessSteps = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['processSteps', params],
    queryFn: () => processStepsService.getAll(params),
  });
};

export const useProcessStep = (id: string) => {
  return useQuery({
    queryKey: ['processStep', id],
    queryFn: () => processStepsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProcessStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<ProcessStep, 'id'>) => processStepsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processSteps'] });
      toast.success('Process step created successfully');
    },
    onError: () => {
      toast.error('Failed to create process step');
    },
  });
};

export const useUpdateProcessStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessStep> }) => 
      processStepsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processSteps'] });
      toast.success('Process step updated successfully');
    },
    onError: () => {
      toast.error('Failed to update process step');
    },
  });
};

export const useDeleteProcessStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => processStepsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processSteps'] });
      toast.success('Process step deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete process step');
    },
  });
};