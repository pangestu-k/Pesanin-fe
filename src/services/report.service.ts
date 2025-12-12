import axiosInstance, { type ApiResponse } from '../libs/axios';
import type { DailySalesReport, MonthlySalesReport, Transaction } from '../types';

export const reportService = {
  // Get daily sales report
  getDailySales: async (date?: string): Promise<DailySalesReport> => {
    const params = date ? `?date=${date}` : '';
    const response = await axiosInstance.get<ApiResponse<DailySalesReport>>(
      `/reports/sales/daily${params}`
    );
    return response.data.data;
  },

  // Get monthly sales report
  getMonthlySales: async (
    year?: number,
    month?: number
  ): Promise<MonthlySalesReport> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get<ApiResponse<MonthlySalesReport>>(
      `/reports/sales/monthly${queryString}`
    );
    return response.data.data;
  },

  // Get all transactions
  getTransactions: async (
    startDate?: string,
    endDate?: string
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      `/reports/transactions${queryString}`
    );
    return response.data.data;
  },
};
