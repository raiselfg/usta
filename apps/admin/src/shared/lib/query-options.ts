import { queryOptions } from '@tanstack/react-query';

import { productCategories } from '@/product-category/lib/product-categories';
import { products } from '@/products/lib/products';

export const productQueries = {
  all: ['products'] as const,
  list: (categoryId?: string) =>
    [...productQueries.all, 'list', categoryId ?? 'all'] as const,
  detail: (id: string) => [...productQueries.all, 'detail', id] as const,
};

export const categoryQueries = {
  all: ['product-categories'] as const,
  list: () => [...categoryQueries.all, 'list'] as const,
  detail: (id: string) => [...categoryQueries.all, 'detail', id] as const,
};

export const productOptions = {
  list: (categoryId?: string) =>
    queryOptions({
      queryKey: productQueries.list(categoryId),
      queryFn: () => products.getProducts(categoryId),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: productQueries.detail(id),
      queryFn: () => products.getProductById(id),
    }),
};

export const categoryOptions = {
  list: () =>
    queryOptions({
      queryKey: categoryQueries.list(),
      queryFn: () => productCategories.getCategories(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: categoryQueries.detail(id),
      queryFn: () => productCategories.getCategoryById(id),
    }),
};
