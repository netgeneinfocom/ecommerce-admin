import { apiClient } from '@/core/api/axios';
import { CATEGORY_ENDPOINTS } from '@/core/api/endpoint';

export interface CreateCategoryData {
  category_name: string;
  category_logo: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  category: {
    _id: string;
    category_name: string;
    category_logo: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface CategoriesListResponse {
  success: boolean;
  message: string;
  catgoryProducts: Array<{
    category_id: string;
    category_name: string;
    category_logo: string;
    total_subcategories: number;
  }>;
}

export const categoryService = {
  createCategory: async (data: CreateCategoryData | FormData): Promise<CategoryResponse> => {
    const response = await apiClient.post<CategoryResponse>(
      CATEGORY_ENDPOINTS.CREATE,
      data,
      data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : undefined
    );
    return response.data;
  },

  updateCategory: async (id: string, data: FormData): Promise<CategoryResponse> => {
    const response = await apiClient.put<CategoryResponse>(
      `${CATEGORY_ENDPOINTS.UPDATE}?category_id=${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  listCategories: async (): Promise<CategoriesListResponse> => {
    const response = await apiClient.get<CategoriesListResponse>(
      CATEGORY_ENDPOINTS.LIST
    );
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${CATEGORY_ENDPOINTS.DELETE}?category_id=${id}`
    );
    return response.data;
  },
};
