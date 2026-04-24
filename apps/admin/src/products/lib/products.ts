import type {
  CreateProductDTO,
  ProductWithProductCategory,
  UpdateProductDTO,
} from '@/types';

import { api, handleApiError } from '../../lib/axios-instance';

export const products = {
  getProducts: async () => {
    try {
      const { data } = await api.get<ProductWithProductCategory[]>('/products');
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch products');
    }
  },

  getProductById: async (id: string) => {
    try {
      const { data } = await api.get<ProductWithProductCategory[]>(
        `/products/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch product');
    }
  },

  createProduct: async (productData: CreateProductDTO) => {
    try {
      const { data } = await api.post<CreateProductDTO>(
        '/products',
        productData,
      );
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to create product');
    }
  },

  updateProduct: async (id: string, productData: UpdateProductDTO) => {
    try {
      const { data } = await api.patch<UpdateProductDTO>(
        `/products/${id}`,
        productData,
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to update product ${id}`);
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const { data } = await api.delete<ProductWithProductCategory>(
        `/products/${id}`,
      );
      return data;
    } catch (error) {
      handleApiError(error, `Failed to delete product ${id}`);
    }
  },
};
