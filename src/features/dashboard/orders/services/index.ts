import { apiClient } from "@/core/api/axios/client";
import { ORDER_ENDPOINTS } from "@/core/api/endpoint/endpoints";
import { APIResponse, Order } from "../types";

export const orderService = {
    fetchOrders: async (page = 1, limit = 10) => {
        const response = await apiClient.get<APIResponse<Order>>(
            `${ORDER_ENDPOINTS.LIST}?page=${page}&limit=${limit}`
        );
        return response.data;
    },
    updateOrderStatus: async (orderId: string, status: string) => {
        // Capitalize the first letter of status (e.g., 'processing' -> 'Processing')
        const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        const response = await apiClient.post<{ success: boolean; message: string }>(
            `${ORDER_ENDPOINTS.CONFIRM_ORDER}?order_id=${orderId}`,
            { order_status: capitalizedStatus }
        );
        return response.data;
    },
};
