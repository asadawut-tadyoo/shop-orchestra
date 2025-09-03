import api from './api';
import { 
  AssemblyUnit, 
  AssemblyUnitFormData, 
  PaginatedResponse, 
  QueryParams 
} from '@/types';

const BASE_PATH = '/AssemblyUnits';

export const assemblyUnitsService = {
  // Get all assembly units with pagination
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<AssemblyUnit>> => {
    const { data } = await api.get(BASE_PATH, { params });
    return data;
  },

  // Get single assembly unit
  getById: async (id: string): Promise<AssemblyUnit> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  // Create new assembly unit
  create: async (formData: AssemblyUnitFormData): Promise<AssemblyUnit> => {
    const { data } = await api.post(BASE_PATH, formData);
    return data;
  },

  // Update assembly unit
  update: async (id: string, formData: Partial<AssemblyUnitFormData>): Promise<AssemblyUnit> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, formData);
    return data;
  },

  // Delete assembly unit
  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  // Get assembly units by work order
  getByWorkOrder: async (workOrderId: string): Promise<AssemblyUnit[]> => {
    const { data } = await api.get(`${BASE_PATH}/work-order/${workOrderId}`);
    return data;
  },

  // Get assembly units by batch
  getByBatch: async (batchId: string): Promise<AssemblyUnit[]> => {
    const { data } = await api.get(`${BASE_PATH}/batch/${batchId}`);
    return data;
  },

  // Get assembly unit by serial number
  getBySerial: async (productCode: string, serialNumber: string): Promise<AssemblyUnit> => {
    const { data } = await api.get(`${BASE_PATH}/by-serial/${productCode}/${serialNumber}`);
    return data;
  },

  // Consume raw material
  consumeRawMaterial: async (id: string, materialCode: string, serialNumber: string): Promise<void> => {
    await api.post(`${BASE_PATH}/${id}/consume-rawmaterial`, {
      materialCode,
      serialNumber
    });
  },

  // Change assembly unit status
  changeStatus: async (id: string, status: string): Promise<void> => {
    await api.post(`${BASE_PATH}/${id}/change-status`, { status });
  },
};