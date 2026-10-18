import apiClient from './axios-instance';
import { API_ENDPOINTS } from './api-endpoints';

const orderService = {
  // Sab orders ki simple list lene ke liye (/api/order/all)
  getAllList: async () => {
    const res: any = await apiClient.get(API_ENDPOINTS.ORDERS.GET_ALL_LIST);
    return res?.data?.data || res?.data || [];
  },

  // Pagination ke sath orders lene ke liye (/api/order)
  getPaged: async (pageNumber: number = 1, pageSize: number = 10) => {
    const res: any = await apiClient.get(API_ENDPOINTS.ORDERS.GET_PAGED(pageNumber, pageSize));
    return res?.data?.data || res?.data;
  },

  // Single Order ID ki base par order aur uske orderItems fetch karne ke liye (/api/order/{id})
  getById: async (id: string | number) => {
    const res: any = await apiClient.get(API_ENDPOINTS.ORDERS.GET_BY_ID(id));
    return res?.data?.data || res?.data;
  },

  // Order Search karne ke liye (/api/order/search)
  search: async (name?: string, take: number = 10) => {
    const res: any = await apiClient.get(API_ENDPOINTS.ORDERS.SEARCH(name, take));
    return res?.data?.data || res?.data || [];
  },

  // Naya Order aur uske child OrderItems create karne ke liye (/api/order)
  create: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, payload);
    return res?.data;
  },

  // Order Update karne ke liye (/api/order/{id})
  update: async (payload: { Id?: string | number; id?: string | number; [key: string]: any }) => {
    const orderId = payload.Id || payload.id || "";
    const res: any = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE(orderId), payload);
    return res?.data;
  },

  // Order Delete karne ke liye (/api/order/{id})
  delete: async (id: string | number) => {
    const res: any = await apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(id));
    return res?.data;
  },
};

export default orderService;