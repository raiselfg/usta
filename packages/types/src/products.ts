import { z } from 'zod';
import type { Product } from '@usta/database';
import { ProductCategorySchema } from './product-categories.js';

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().nullish(),
  is_active: z.boolean(),
  image: z.string(),
  created_at: z.iso.datetime().or(z.date()),
  updated_at: z.iso.datetime().or(z.date()),
  product_category_id: z.uuid(),
});

export const ProductWithProductCategorySchema = ProductSchema.extend({
  product_category: z.lazy(() => ProductCategorySchema).optional(),
});

export const CreateProductApiSchema = ProductSchema.pick({
  name: true,
  description: true,
  product_category_id: true,
  is_active: true,
}).extend({
  image: z.string().url('Некорректная ссылка на изображение'),
});

export const CreateProductFormSchema = CreateProductApiSchema.omit({
  image: true,
}).extend({
  file: z.instanceof(File, { message: 'Загрузите фото товара' }),
});

export const UpdateProductBodySchema = ProductSchema.pick({
  name: true,
  description: true,
  product_category_id: true,
  is_active: true,
}).partial();

export const LandingProductSchema = ProductSchema.pick({
  id: true,
  name: true,
  image: true,
});

export const ProductFormSchema = ProductSchema.pick({
  name: true,
  description: true,
  is_active: true,
  product_category_id: true,
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;
export type LandingProduct = z.infer<typeof LandingProductSchema>;
export type CreateProductApiDTO = z.infer<typeof CreateProductApiSchema>;
export type CreateProductFormDTO = z.infer<typeof CreateProductFormSchema>;
export type UpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
export type ProductWithProductCategory = z.infer<
  typeof ProductWithProductCategorySchema
>;

export type CreateProductDTO = CreateProductApiDTO;
export type UpdateProductDTO = z.infer<typeof UpdateProductBodySchema>;

export type { Product };
