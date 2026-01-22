import { apiClient } from '@/core/api/axios';
import { DASHBOARD_ENDPOINTS } from '@/core/api/endpoint';

export interface DashboardData {
    totalOrders: number;
    totalProducts: number;
    totalBrands: number;
    totalCategories: number;
    totalSubCategories: number;
}

export interface DashboardResponse {
    success: boolean;
    message: string;
    data: DashboardData;
}

export const dashboardService = {
    getDashboardData: async (): Promise<DashboardResponse> => {
        const response = await apiClient.get<DashboardResponse>(
            DASHBOARD_ENDPOINTS.DATA
        );
        return response.data;
    },
};
