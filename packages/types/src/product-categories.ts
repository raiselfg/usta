import { z } from 'zod';
import type { ProductCategory } from '@usta/database';
import { ProductSchema, LandingProductSchema } from './products';

export const ProductCategorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  order: z.number(),
  is_active: z.boolean(),
  created_at: z.iso.datetime().or(z.date()),
  updated_at: z.iso.datetime().or(z.date()),
});

export const ProductCategoryWithProductsSchema = ProductCategorySchema.extend({
  product: z.array(ProductSchema),
});

export const LandingCategorySchema = ProductCategorySchema.pick({
  id: true,
  name: true,
}).extend({
  product: z.array(LandingProductSchema),
});

export const CreateProductCategorySchema = ProductCategorySchema.pick({
  name: true,
  order: true,
  is_active: true,
});

export const UpdateProductCategorySchema =
  CreateProductCategorySchema.optional();

export type LandingCategory = z.infer<typeof LandingCategorySchema>;
export type CreateProductCategory = z.infer<typeof CreateProductCategorySchema>;
export type UpdateProductCategory = z.infer<typeof UpdateProductCategorySchema>;

export type { ProductCategory };
