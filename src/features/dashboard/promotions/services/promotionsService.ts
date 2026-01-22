import { apiClient } from "@/core/api/axios/client";
import { CAROUSEL_ENDPOINTS, BANNER_ENDPOINTS, COUNTDOWN_ENDPOINTS } from "@/core/api/endpoint/endpoints";
import { CarouselApiResponse } from "../types";

export const promotionsService = {
    getCarouselItems: async (): Promise<CarouselApiResponse> => {
        const response = await apiClient.get(CAROUSEL_ENDPOINTS.LIST);
        return response.data;
    },

    addCarouselItem: async (formData: FormData) => {
        const response = await apiClient.post(CAROUSEL_ENDPOINTS.CREATE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    updateCarouselItem: async (formData: FormData) => {
        const response = await apiClient.put(CAROUSEL_ENDPOINTS.UPDATE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    deleteCarouselItem: async (id: string) => {
        const response = await apiClient.delete(`${CAROUSEL_ENDPOINTS.DELETE}?carousel_id=${id}`);
        return response.data;
    },

    addBannerItem: async (formData: FormData) => {
        const response = await apiClient.post(BANNER_ENDPOINTS.CREATE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getBannerItems: async (): Promise<any> => { // Using any for now or modify types to import BannerApiResponse
        const response = await apiClient.get(BANNER_ENDPOINTS.LIST);
        return response.data;
    },

    deleteBannerItem: async (id: string) => {
        const response = await apiClient.delete(`${BANNER_ENDPOINTS.DELETE}?banner_id=${id}`);
        return response.data;
    },

    addCountdownItem: async (formData: FormData) => {
        const response = await apiClient.post(COUNTDOWN_ENDPOINTS.CREATE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getCountdownItems: async (): Promise<any> => { // Should return CountdownApiResponse
        const response = await apiClient.get(COUNTDOWN_ENDPOINTS.LIST);
        return response.data;
    },
};
