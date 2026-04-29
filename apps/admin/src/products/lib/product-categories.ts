import type { ProductCategory } from '@usta/types/product-categories';

import { api, handleApiError } from '../../lib/axios-instance';

export const productCategories = {
  getCategories: async () => {
    try {
      const { data } = await api.get<ProductCategory[]>('/product-categories');
      return data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch product categories');
    }
  },
};
