import axiosInstance, { type ApiResponse } from '../libs/axios';
import type { Category } from '../types';

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<ApiResponse<Category[]>>(
      '/categories'
    );
    return response.data.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get<ApiResponse<Category>>(
      `/categories/${id}`
    );
    return response.data.data;
  },

  // Create new category (admin)
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.post<ApiResponse<Category>>(
      '/categories',
      data
    );
    return response.data.data;
  },

  // Update category (admin)
  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete category (admin)
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
