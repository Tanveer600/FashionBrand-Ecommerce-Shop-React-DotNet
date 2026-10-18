    import apiClient from './axios-instance';
import { API_ENDPOINTS } from './api-endpoints';

const categoryService = {
  getAll: async () => {
    const res: any = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
    return res?.data?.data || res?.data || [];
  },

  getById: async (id: string | number) => {
    const res: any = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id));
    return res?.data?.data || res?.data;
  },

 create: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, payload);
    return res?.data;
  },

  update: async (payload: { Id?: string | number; id?: string | number; [key: string]: any }) => {
    const categoryId = payload.Id || payload.id || "";
    const res: any = await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(categoryId), payload);
    return res?.data;
  },

  delete: async (id: string | number) => {
    const res: any = await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
    return res?.data;
  },

  getPaged: async (pageNumber: number = 1, pageSize: number = 10) => {
    const res: any = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_PAGED(pageNumber, pageSize));
    return res?.data?.data || res?.data;
  },

  search: async (name?: string, take: number = 10) => {
    const res: any = await apiClient.get(API_ENDPOINTS.CATEGORIES.SEARCH(name, take));
    return res?.data?.data || res?.data || [];
  },
};

export default categoryService;