import axiosInstance, { ApiResponse, PaginatedResponse } from '../libs/axios';
import { Order, CreateOrderRequest, Payment } from '../types';

export const orderService = {
  // Get all orders with pagination (admin)
  getAll: async (
    page: number = 1,
    pageSize: number = 10,
    status?: string
  ): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (status) params.append('status', status);

    const response = await axiosInstance.get<PaginatedResponse<Order>>(
      `/orders?${params.toString()}`
    );
    return response.data;
  },

  // Get order by ID
  getById: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get<ApiResponse<Order>>(
      `/orders/${id}`
    );
    return response.data.data;
  },

  // Get orders by table ID
  getByTableId: async (tableId: string): Promise<Order[]> => {
    const response = await axiosInstance.get<ApiResponse<Order[]>>(
      `/orders/table/${tableId}`
    );
    return response.data.data;
  },

  // Update order status (admin)
  updateStatus: async (
    id: string,
    status: 'pending' | 'paid' | 'cooking' | 'done' | 'cancelled'
  ): Promise<void> => {
    await axiosInstance.patch(`/orders/${id}/status`, { status });
  },

  // Create order (public - customer)
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post<ApiResponse<Order>>(
      '/public/orders',
      data
    );
    return response.data.data;
  },

  // Get order status (public - customer)
  getStatus: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get<ApiResponse<Order>>(
      `/public/orders/${id}`
    );
    return response.data.data;
  },

  // Checkout order (public - customer)
  checkout: async (id: string): Promise<Payment> => {
    const response = await axiosInstance.post<ApiResponse<Payment>>(
      `/public/orders/${id}/checkout`
    );
    return response.data.data;
  },
};
