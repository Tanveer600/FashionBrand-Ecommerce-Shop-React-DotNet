import apiClient from './axios-instance';
import { API_ENDPOINTS } from './api-endpoints';

const userService = {
  getAll: async () => {
    const res: any = await apiClient.get(API_ENDPOINTS.USERS.GET_ALL);
    return res?.data?.data || res?.data || [];
  },

  getById: async (id: string | number) => {
    const res: any = await apiClient.get(API_ENDPOINTS.USERS.GET_BY_ID(id));
    return res?.data?.data || res?.data;
  },

  create: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.USERS.CREATE, payload);
    return res?.data;
  },

  signup: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.USERS.SIGNUP, payload);
    return res?.data;
  },

update: async (payload: { Id?: string | number; id?: string | number; [key: string]: any }) => {
    const userId = payload.Id || payload.id || ""; // Yahan fallback add kar diya hai
    const res: any = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(userId), payload);
    return res?.data;
  },

  delete: async (id: string | number) => {
    const res: any = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    return res?.data;
  },

  login: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.USERS.LOGIN, payload);
    return res?.data;
  },

  forgotPassword: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.USERS.FORGOT_PASSWORD, payload);
    return res?.data;
  },

  resetPassword: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.USERS.RESET_PASSWORD, payload);
    return res?.data;
  },

  changePassword: async (payload: any) => {
    const res: any = await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, payload);
    return res?.data;
  },
};

export default userService;