import axiosInstance, { type ApiResponse } from '../libs/axios';
import type { Payment } from '../types';

export const paymentService = {
  // Get payment by order ID
  getByOrderId: async (orderId: string): Promise<Payment> => {
    const response = await axiosInstance.get<ApiResponse<Payment>>(
      `/payments/order/${orderId}`
    );
    return response.data.data;
  },
};
