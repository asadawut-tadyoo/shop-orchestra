import api from './api';
import { 
  RawMaterial, 
  RawMaterialFormData, 
  PaginatedResponse, 
  QueryParams 
} from '@/types/index';

const BASE_PATH = '/raw-materials';

export const rawMaterialsService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<RawMaterial>> => {
    const { data } = await api.get(BASE_PATH, { params });
    return data;
  },

  getById: async (id: string): Promise<RawMaterial> => {
    const { data } = await api.get(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (formData: RawMaterialFormData): Promise<RawMaterial> => {
    const { data } = await api.post(BASE_PATH, formData);
    return data;
  },

  update: async (id: string, formData: Partial<RawMaterialFormData>): Promise<RawMaterial> => {
    const { data } = await api.put(`${BASE_PATH}/${id}`, formData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  getByBatch: async (batchNo: string): Promise<RawMaterial[]> => {
    const { data } = await api.get(`${BASE_PATH}/batch/${batchNo}`);
    return data;
  },

  // Get raw material by serial number
  getBySerial: async (materialCode: string, serialNumber: string): Promise<RawMaterial> => {
    const { data } = await api.get(`${BASE_PATH}/by-serial/${materialCode}/${serialNumber}`);
    return data;
  },

  // Add inspection to raw material
  addInspection: async (id: string, inspectionData: {
    testType: string;
    result: string;
    measuredValue: string;
    inspector: string;
  }): Promise<void> => {
    await api.post(`${BASE_PATH}/${id}/inspection`, inspectionData);
  },
};