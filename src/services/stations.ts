import api from './api';
import { 
  Station, 
  StationFormData, 
  PaginatedResponse, 
  QueryParams 
} from '@/types/index';

const BASE_PATH = '/Stations';

export const stationsService = {
  getAll: async (params?: QueryParams): Promise<Station[]> => {
    const { data } = await api.get<Station[]>(BASE_PATH, { params });
    return data || [];
  },

  getById: async (id: string): Promise<Station> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (formData: StationFormData): Promise<Station> => {
    const { data } = await api.post(BASE_PATH, formData);
    return data;
  },

  update: async (id: string, formData: Partial<StationFormData>): Promise<Station> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, formData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  getByType: async (type: string): Promise<Station[]> => {
    const { data } = await api.get(`${BASE_PATH}/type/${type}`);
    return data;
  },
};