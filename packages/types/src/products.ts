import { z } from 'zod';
import type { Product } from '@usta/database';
import { ProductCategorySchema } from './product-categories.js';

export const ProductSchema = z.object({
  id: z.uuid({ version: 'v4' }),
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  is_active: z.boolean(),
  image: z.url('Некорректная ссылка на изображение'),
  created_at: z.iso.datetime().or(z.date()),
  updated_at: z.iso.datetime().or(z.date()),
  product_category_id: z.uuid({ version: 'v4' }),
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
  image: z.url('Некорректная ссылка на изображение'),
});

export const CreateProductFormSchema = ProductSchema.pick({
  name: true,
  description: true,
  product_category_id: true,
  is_active: true,
}).extend({
  file: z
    .file()
    .max(2 * 1024 * 1024) //2mb
    .mime(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']),
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
