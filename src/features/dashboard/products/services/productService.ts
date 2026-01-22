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

export interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  product_price: number;
  discount_precentage: number;
  final_price: number;
  product_brand: string;
  product_category: string;
  product_sub_category: string;
  avatar: string;
  cover_images: Array<{
    url: string;
    _id: string;
  }>;
  dimensions: string;
  manufacturer: string;
  sales: string | boolean;
  featured: string | boolean;
  isNew: string | boolean;
  tags: ProductTag[];
  created_by: string;
  product_reviews: any[];
  product_likes: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface ProductsListResponse {
  success: boolean;
  message: string;
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
    data: FormData
  ): Promise<ProductResponse> => {
    const response = await apiClient.put<ProductResponse>(
      `${PRODUCT_ENDPOINTS.UPDATE}?product_id=${productId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  listProducts: async (): Promise<ProductsListResponse> => {
    const response = await apiClient.get<ProductsListResponse>(
      PRODUCT_ENDPOINTS.LIST
    );
    return response.data;
  },
};
