import apiClient from './axios-instance';
import { API_ENDPOINTS } from './api-endpoints';

const productService = {
  // Sab products ki simple list lene ke liye (/api/product/all)
  getAllList: async () => {
    const res: any = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_ALL_LIST);
    return res?.data?.data || res?.data || [];
  },

  // Pagination ke sath products lene ke liye (/api/product)
  getPaged: async (pageNumber: number = 1, pageSize: number = 10) => {
    const res: any = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_PAGED(pageNumber, pageSize));
    return res?.data?.data || res?.data;
  },

  // ID ke zariye single product lene ke liye (/api/product/{id})
  getById: async (id: string | number) => {
    const res: any = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
    return res?.data?.data || res?.data;
  },

  // Product search karne ke liye (/api/product/search)
  search: async (name?: string, take: number = 10) => {
    const res: any = await apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH(name, take));
    return res?.data?.data || res?.data || [];
  },

  // Naya product create karne ke liye (FormData / JSON)
  create: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, payload);
    return res?.data;
  },

  // Product update karne ke liye (/api/product/{id})
  update: async (payload: { Id?: string | number; id?: string | number; [key: string]: any }) => {
    const productId = payload.Id || payload.id || "";
    const res: any = await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(productId), payload);
    return res?.data;
  },

  // Product delete karne ke liye (/api/product/{id})
  delete: async (id: string | number) => {
    const res: any = await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    return res?.data;
  },
};

export default productService;