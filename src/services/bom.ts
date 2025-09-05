import api from './api';
import { 
  BillOfMaterials, 
  PaginatedResponse, 
  QueryParams 
} from '@/types/index';

const BASE_PATH = '/bill-of-materials';

export const bomService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<BillOfMaterials>> => {
    const { data } = await api.get(BASE_PATH, { params });
    return data;
  },

  getById: async (id: string): Promise<BillOfMaterials> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (formData: Omit<BillOfMaterials, 'id' | 'createdAt' | 'updatedAt'>): Promise<BillOfMaterials> => {
    const { data } = await api.post(BASE_PATH, formData);
    return data;
  },

  update: async (id: string, formData: Partial<BillOfMaterials>): Promise<BillOfMaterials> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, formData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  getByProductCode: async (productCode: string): Promise<BillOfMaterials[]> => {
    const { data } = await api.get(`${BASE_PATH}/product/${productCode}`);
    return data;
  },
};