import type { Product, ProductCategory } from '@usta/database';

export interface LandingProduct {
  id: string;
  name: string | null;
  image: string;
}

export interface LandingCategory {
  id: string;
  name: string;
  product: LandingProduct[];
}

export type ProductWithProductCategory = Product & {
  productCategory: ProductCategory;
};
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDTO = Partial<CreateProductDTO>;
