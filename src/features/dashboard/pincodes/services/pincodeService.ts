import { apiClient } from "@/core/api/axios/client";
import { PINCODE_ENDPOINTS } from "@/core/api/endpoint";
import { PincodeListResponse, PincodeResponse, CreatePincodeData } from "../types";

export const pincodeService = {
  listPincodes: async (): Promise<PincodeListResponse> => {
    const response = await apiClient.get<PincodeListResponse>(PINCODE_ENDPOINTS.LIST);
    return response.data;
  },

  addPincode: async (data: CreatePincodeData): Promise<PincodeResponse> => {
    const response = await apiClient.post<PincodeResponse>(PINCODE_ENDPOINTS.ADD, data);
    return response.data;
  },

  deletePincode: async (id: string): Promise<PincodeResponse> => {
    const response = await apiClient.delete<PincodeResponse>(
      `${PINCODE_ENDPOINTS.DELETE}?pincode_id=${id}`
    );
    return response.data;
  },

  deleteArea: async (areaId: string): Promise<PincodeResponse> => {
    const response = await apiClient.delete<PincodeResponse>(
      `${PINCODE_ENDPOINTS.DELETE_AREA}?area_id=${areaId}`
    );
    return response.data;
  },

  updateArea: async (areaId: string, data: any): Promise<PincodeResponse> => {
    const response = await apiClient.patch<PincodeResponse>(
      `${PINCODE_ENDPOINTS.UPDATE_AREA}?area_id=${areaId}`,
      data
    );
    return response.data;
  },

  updatePincodeStatus: async (pincodeId: string, data: { pincode?: string; isActive?: boolean }): Promise<PincodeResponse> => {
    const response = await apiClient.patch<PincodeResponse>(
      `${PINCODE_ENDPOINTS.UPDATE_STATUS}?pincode_id=${pincodeId}`,
      data
    );
    return response.data;
  }
};
