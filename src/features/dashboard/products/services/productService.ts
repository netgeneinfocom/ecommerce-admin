import { apiClient } from '@/core/api/axios';
import { PRODUCT_ENDPOINTS } from '@/core/api/endpoint';

export interface CreateProductData {
  product_name: string;
  product_description: string;
  product_price: number;
  discount_percentage: number;
  avatar: File;
  cover_images: File[];
  dimensions: string;
  sales: boolean;
  featured: boolean;
  manufacturer: string;
  tags: string[];
  isNew: boolean;
}

export interface ProductTag {
  tag_name: string;
  _id: string;
}

export interface ProductBrandObject {
  _id: string;
  brand_name: string;
}

export interface ProductCategoryObject {
  _id: string;
  category_name: string;
}

export interface ProductSubCategoryObject {
  _id: string;
  sub_category_name: string;
}

export interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  product_price: number;
  discount_precentage: number;
  final_price: number;
  product_brand: string | ProductBrandObject;
  product_category: string | ProductCategoryObject;
  product_sub_category: string | ProductSubCategoryObject;
  avatar: string;
  cover_images: Array<{
    url: string;
    _id?: string;
  }>;
  dimensions?: string;
  manufacturer?: string;
  sales: string | boolean;
  featured: string | boolean;
  isNew: string | boolean;
  tags?: ProductTag[];
  return_policy?: {
    value: number;
    unit: string;
    duration_in_hours: number;
    policy_notes: string;
  };
  created_by?: string;
  product_reviews?: any[];
  product_likes?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

export interface ProductsListResponse {
  success: boolean;
  message: string;
  pagination: Pagination;
  products: Product[];
}

export interface ProductSearchResponse {
  success: boolean;
  message: string;
  search_query: string;
  pagination: Pagination;
  products: Product[];
}

export const productService = {
  createProduct: async (
    data: FormData,
    brandId: string,
    categoryId: string,
    subCategoryId: string,
    dimensionId: string
  ): Promise<ProductResponse> => {
    const response = await apiClient.post<ProductResponse>(
      `${PRODUCT_ENDPOINTS.CREATE}?brand_id=${brandId}&category_id=${categoryId}&sub_category_id=${subCategoryId}&dimension_id=${dimensionId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  updateProduct: async (
    productId: string,
    data: FormData,
    dimensionId: string
  ): Promise<ProductResponse> => {
    const response = await apiClient.put<ProductResponse>(
      `${PRODUCT_ENDPOINTS.UPDATE}?product_id=${productId}&dimension_id=${dimensionId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  listProducts: async (page: number = 1, value: number = 10): Promise<ProductsListResponse> => {
    const response = await apiClient.get<ProductsListResponse>(
      `${PRODUCT_ENDPOINTS.LIST}?page=${page}&value=${value}`
    );
    return response.data;
  },

  searchProducts: async (
    name: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductSearchResponse> => {
    const response = await apiClient.get<ProductSearchResponse>(
      `${PRODUCT_ENDPOINTS.SEARCH}?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${PRODUCT_ENDPOINTS.DELETE}?product_id=${productId}`
    );
    return response.data;
  },
};
