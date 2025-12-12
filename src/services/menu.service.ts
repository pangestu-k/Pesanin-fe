import axiosInstance, { ApiResponse, PaginatedResponse } from '../libs/axios';
import { Menu, CreateMenuRequest, UpdateMenuRequest } from '../types';

export const menuService = {
  // Get all menus with pagination (admin)
  getAll: async (
    page: number = 1,
    pageSize: number = 10,
    categoryId?: string
  ): Promise<PaginatedResponse<Menu>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (categoryId) params.append('category_id', categoryId);

    const response = await axiosInstance.get<PaginatedResponse<Menu>>(
      `/menus?${params.toString()}`
    );
    return response.data;
  },

  // Get menu by ID
  getById: async (id: string): Promise<Menu> => {
    const response = await axiosInstance.get<ApiResponse<Menu>>(`/menus/${id}`);
    return response.data.data;
  },

  // Create new menu (admin)
  create: async (data: CreateMenuRequest): Promise<Menu> => {
    const response = await axiosInstance.post<ApiResponse<Menu>>('/menus', data);
    return response.data.data;
  },

  // Update menu (admin)
  update: async (id: string, data: UpdateMenuRequest): Promise<Menu> => {
    const response = await axiosInstance.put<ApiResponse<Menu>>(
      `/menus/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete menu (admin)
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/menus/${id}`);
  },

  // Upload menu image (admin)
  uploadImage: async (id: string, file: File): Promise<Menu> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosInstance.post<ApiResponse<Menu>>(
      `/menus/${id}/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Get available menus for customers (public)
  getAvailable: async (categoryId?: string): Promise<Menu[]> => {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    const response = await axiosInstance.get<ApiResponse<Menu[]>>(
      `/public/menus${params}`
    );
    return response.data.data;
  },

  // Get menu by ID (public)
  getPublicById: async (id: string): Promise<Menu> => {
    const response = await axiosInstance.get<ApiResponse<Menu>>(
      `/public/menus/${id}`
    );
    return response.data.data;
  },
};
