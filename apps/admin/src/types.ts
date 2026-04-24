import type { Product, ProductCategory } from '@usta/database';

export type ProductWithProductCategory = Product & {
  productCategory: ProductCategory;
};
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDTO = Partial<CreateProductDTO>;
