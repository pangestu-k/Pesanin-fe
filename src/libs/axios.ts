import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../configs/api';
import { getItem, removeItem } from './storage';
import { useUserStore } from '../states/user.store';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getItem<string>(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear all auth data
      removeItem(STORAGE_KEYS.TOKEN);
      removeItem(STORAGE_KEYS.USER);
      
      // Logout from zustand store
      useUserStore.getState().logout();
      
      // Redirect to login if on protected routes
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/customer')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}
