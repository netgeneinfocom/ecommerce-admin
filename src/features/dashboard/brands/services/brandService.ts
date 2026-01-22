import { apiClient } from '@/core/api/axios';
import { BRAND_ENDPOINTS } from '@/core/api/endpoint';

export interface CreateBrandData {
  brand_name: string;
  brand_logo: string;
}

export interface BrandResponse {
  success: boolean;
  message: string;
  Brand: {
    _id: string;
    brand_name: string;
    brand_logo: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface BrandsListResponse {
  success: boolean;
  message: string;
  data: Array<{
    brand_id: string;
    brand_name: string;
    brand_logo: string;
    total_products: number;
  }>;
}

export const brandService = {
  createBrand: async (data: CreateBrandData | FormData): Promise<BrandResponse> => {
    const response = await apiClient.post<BrandResponse>(
      BRAND_ENDPOINTS.CREATE,
      data,
      data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : undefined
    );
    return response.data;
  },

  updateBrand: async (id: string, data: FormData): Promise<BrandResponse> => {
    const response = await apiClient.put<BrandResponse>(
      `${BRAND_ENDPOINTS.UPDATE}?brand_id=${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  listBrands: async (): Promise<BrandsListResponse> => {
    const response = await apiClient.get<BrandsListResponse>(
      BRAND_ENDPOINTS.LIST
    );
    return response.data;
  },
};
