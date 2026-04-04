import { apiClient } from '@/core/api/axios';
import { WAREHOUSE_ENDPOINTS } from '@/core/api/endpoint';
import { CreateWarehouseData, WarehouseResponse, WarehouseListResponse } from '../types';

export const warehouseService = {
  addWarehouse: async (data: CreateWarehouseData): Promise<WarehouseResponse> => {
    const response = await apiClient.post<WarehouseResponse>(
      WAREHOUSE_ENDPOINTS.ADD,
      data
    );
    return response.data;
  },

  listWarehouses: async (): Promise<WarehouseListResponse> => {
    const response = await apiClient.get<WarehouseListResponse>(
      WAREHOUSE_ENDPOINTS.LIST
    );
    return response.data;
  },

  updateWarehouse: async (id: string, data: Partial<CreateWarehouseData>): Promise<WarehouseResponse> => {
    const response = await apiClient.patch<WarehouseResponse>(
      `${WAREHOUSE_ENDPOINTS.UPDATE}?warehouse_id=${id}`,
      data
    );
    return response.data;
  },

  deleteWarehouse: async (id: string): Promise<WarehouseResponse> => {
    const response = await apiClient.delete<WarehouseResponse>(
      `${WAREHOUSE_ENDPOINTS.DELETE}?warehouse_id=${id}`
    );
    return response.data;
  },
};
