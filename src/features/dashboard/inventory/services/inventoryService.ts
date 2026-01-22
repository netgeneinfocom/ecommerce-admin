import { apiClient } from '@/core/api/axios';
import { INVENTORY_ENDPOINTS, PRODUCT_ENDPOINTS, METRICS_ENDPOINTS, SUPPLIER_ENDPOINTS } from '@/core/api/endpoint';
import {
    InventoryListResponse,
    InventoryListParams,
    AddSupplierParams,
    AddSupplierResponse,
    GetSuppliersResponse,
    InventoryBillResponse,
    InventoryBillDetailResponse,
} from '../types';

export const inventoryService = {
    listInventory: async (params?: InventoryListParams): Promise<InventoryListResponse> => {
        const response = await apiClient.get<InventoryListResponse>(
            INVENTORY_ENDPOINTS.LIST,
            { params }
        );
        return response.data;
    },

    getInventoryBills: async (params?: { page?: number; limit?: number }): Promise<InventoryBillResponse> => {
        const response = await apiClient.get<InventoryBillResponse>(
            INVENTORY_ENDPOINTS.BILL_LIST,
            { params }
        );
        return response.data;
    },

    getInventoryBillById: async (id: string): Promise<InventoryBillDetailResponse> => {
        const response = await apiClient.get<InventoryBillDetailResponse>(
            INVENTORY_ENDPOINTS.BILL_BY_ID,
            { params: { id } }
        );
        return response.data;
    },



    addInventoryBill: async (data: any) => {
        const response = await apiClient.post(
            INVENTORY_ENDPOINTS.ADD_BILL,
            data
        );
        return response.data;
    },

    getProducts: async () => {


        const response = await apiClient.get<{ success: boolean; products: any[] }>(
            PRODUCT_ENDPOINTS.LIST
        );
        return response.data.products;
    },

    getUnits: async () => {
        const response = await apiClient.get<{ success: boolean; metrics: any[] }>(
            METRICS_ENDPOINTS.LIST
        );
        return response.data.metrics;
    },

    addSupplier: async (data: AddSupplierParams): Promise<AddSupplierResponse> => {
        const response = await apiClient.post<AddSupplierResponse>(
            SUPPLIER_ENDPOINTS.CREATE,
            data
        );
        return response.data;
    },

    getSuppliers: async () => {
        const response = await apiClient.get<GetSuppliersResponse>(
            SUPPLIER_ENDPOINTS.LIST
        );
        return response.data.suppliers;
    },
};
