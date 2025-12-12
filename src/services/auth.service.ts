import axiosInstance, { type ApiResponse } from '../libs/axios';
import type { User, LoginRequest, LoginResponse, RegisterRequest } from '../types';

export const authService = {
  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      data
    );
    return response.data.data;
  },

  // Register new user (admin only)
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await axiosInstance.post<ApiResponse<User>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
};
