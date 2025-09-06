import api from './api';
import { 
  WorkOrder, 
  WorkOrderFormData, 
  PaginatedResponse, 
  QueryParams 
} from '@/types/index';

const BASE_PATH = '/WorkOrders';

export const workOrdersService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<WorkOrder>> => {
    const { data } = await api.get(BASE_PATH, { params });
    return data;
  },

  getById: async (id: string): Promise<WorkOrder> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (formData: WorkOrderFormData): Promise<WorkOrder> => {
    const { data } = await api.post(BASE_PATH, formData);
    return data;
  },

  update: async (id: string, formData: Partial<WorkOrderFormData>): Promise<WorkOrder> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, formData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<WorkOrder> => {
    const { data } = await api.patch(`${BASE_PATH}/${id}/status`, { status });
    return data;
  },

  // Get work order by number
  getByNumber: async (workOrderNo: string): Promise<WorkOrder> => {
    const { data } = await api.get(`${BASE_PATH}/${workOrderNo}`);
    return data;
  },
};