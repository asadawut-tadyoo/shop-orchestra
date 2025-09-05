import api from './api';
import { 
  ProcessStep, 
  PaginatedResponse, 
  QueryParams 
} from '@/types/index';

const BASE_PATH = '/process-steps';

export const processStepsService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<ProcessStep>> => {
    const { data } = await api.get(BASE_PATH, { params });
    return data;
  },

  getById: async (id: string): Promise<ProcessStep> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (formData: Omit<ProcessStep, 'id'>): Promise<ProcessStep> => {
    const { data } = await api.post(BASE_PATH, formData);
    return data;
  },

  update: async (id: string, formData: Partial<ProcessStep>): Promise<ProcessStep> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, formData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  getByAssemblyUnit: async (assemblyUnitId: string): Promise<ProcessStep[]> => {
    const { data } = await api.get(`${BASE_PATH}/assembly-unit/${assemblyUnitId}`);
    return data;
  },

  completeStep: async (id: string): Promise<ProcessStep> => {
    const { data } = await api.post(`${BASE_PATH}/${id}/complete`);
    return data;
  },
};