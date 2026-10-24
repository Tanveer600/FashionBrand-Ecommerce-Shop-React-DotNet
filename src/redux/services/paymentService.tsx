import apiClient from './axios-instance';
import { API_ENDPOINTS } from './api-endpoints';

const paymentService = {
  processJazzCashPayment: async (payload: { mobileNumber: string; amount: number }) => {
    const res: any = await apiClient.post(API_ENDPOINTS.PAYMENTS.PROCESS_JAZZCASH, payload);
    return res?.data?.data || res?.data;
  },
};

export default paymentService;