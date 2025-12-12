import axiosInstance, { ApiResponse, PaginatedResponse } from '../libs/axios';
import { Table, CreateTableRequest, UpdateTableRequest } from '../types';

export const tableService = {
  // Get all tables with pagination (admin)
  getAll: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Table>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    const response = await axiosInstance.get<PaginatedResponse<Table>>(
      `/tables?${params.toString()}`
    );
    return response.data;
  },

  // Get table by ID
  getById: async (id: string): Promise<Table> => {
    const response = await axiosInstance.get<ApiResponse<Table>>(
      `/tables/${id}`
    );
    return response.data.data;
  },

  // Create new table (admin)
  create: async (data: CreateTableRequest): Promise<Table> => {
    const response = await axiosInstance.post<ApiResponse<Table>>(
      '/tables',
      data
    );
    return response.data.data;
  },

  // Update table (admin)
  update: async (id: string, data: UpdateTableRequest): Promise<Table> => {
    const response = await axiosInstance.put<ApiResponse<Table>>(
      `/tables/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete table (admin)
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tables/${id}`);
  },

  // Get QR code for table
  getQRCode: async (id: string): Promise<Blob> => {
    const response = await axiosInstance.get(`/tables/${id}/qr`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get table info (public - customer)
  getPublicInfo: async (tableId: string): Promise<Table> => {
    const response = await axiosInstance.get<ApiResponse<Table>>(
      `/public/tables/${tableId}`
    );
    return response.data.data;
  },
};
