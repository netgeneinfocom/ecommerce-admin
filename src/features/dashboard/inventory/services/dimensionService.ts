import { apiClient } from '@/core/api/axios';
import { METRICS_ENDPOINTS } from '@/core/api/endpoint';

export interface AddMetricsData {
    dimension_name: string;
}

export interface MetricsResponse {
    success: boolean;
    message: string;
    Dimension: {
        _id: string;
        dimension_name: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}

export interface MetricsListResponse {
    success: boolean;
    message: string;
    metrics: Array<{
        _id: string;
        dimension_name: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }>;
}

export const dimensionService = {
    addMetrics: async (data: AddMetricsData): Promise<MetricsResponse> => {
        const response = await apiClient.post<MetricsResponse>(
            METRICS_ENDPOINTS.ADD,
            data
        );
        return response.data;
    },

    getMetrics: async (): Promise<MetricsListResponse> => {
        const response = await apiClient.get<MetricsListResponse>(
            METRICS_ENDPOINTS.LIST
        );
        return response.data;
    },

    deleteMetric: async (metricId: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete<{ success: boolean; message: string }>(
            `${METRICS_ENDPOINTS.DELETE}?metric_id=${metricId}`
        );
        return response.data;
    },
};
