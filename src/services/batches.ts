import api from './api';
import { 
  Batch, 
  BatchFormData, 
  PaginatedResponse, 
  QueryParams 
} from '@/types';

const BASE_PATH = '/batches';

export const batchesService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Batch>> => {
    const { data } = await api.get(BASE_PATH, { params });
    return data;
  },

  getById: async (id: string): Promise<Batch> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (formData: BatchFormData): Promise<Batch> => {
    const { data } = await api.post(BASE_PATH, formData);
    return data;
  },

  update: async (id: string, formData: Partial<BatchFormData>): Promise<Batch> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, formData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  getByWorkOrder: async (workOrderId: string): Promise<Batch[]> => {
    const { data } = await api.get(`${BASE_PATH}/work-order/${workOrderId}`);
    return data;
  },
};