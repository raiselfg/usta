import type { Product } from '@usta/database';

import { api, handleApiError } from './axios-instance';

export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDTO = Partial<CreateProductDTO>;

export const products = {
  getProducts: async () => {
    try {
      const { data } = await api.get<Product[]>('/products');
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch products');
    }
  },

  createProduct: async (productData: CreateProductDTO) => {
    try {
      const { data } = await api.post<Product>('/products', productData);
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to create product');
    }
  },

  updateProduct: async (id: string, productData: UpdateProductDTO) => {
    try {
      const { data } = await api.patch<Product>(`/products/${id}`, productData);
      return data;
    } catch (error) {
      handleApiError(error, `Failed to update product ${id}`);
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const { data } = await api.delete<Product>(`/products/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, `Failed to delete product ${id}`);
    }
  },
};
