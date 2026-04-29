import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  image: z.string(),
  created_at: z.string().datetime().or(z.date()),
  updated_at: z.string().datetime().or(z.date()),
  product_category_id: z.string().uuid(),
});

export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  order: z.number(),
  is_active: z.boolean(),
  created_at: z.string().datetime().or(z.date()),
  updated_at: z.string().datetime().or(z.date()),
});

export const ProductCategoryWithProductsSchema = ProductCategorySchema.extend({
  product: z.array(ProductSchema),
});

export const ProductWithProductCategorySchema = ProductSchema.extend({
  product_category: ProductCategorySchema.nullable(),
});

export const CreateProductBodySchema = z.object({
  file: z.any().optional(), // Using any() or z.custom<File>() for File type if needed, or omit.
  name: z.string(),
  description: z.string().optional(),
  product_category_id: z.string().uuid(),
  image: z.string().optional(),
});

export const UpdateProductBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  product_category_id: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
});

export const LandingProductSchema = z.object({
  id: z.string().uuid(),
  image: z.string(),
});

export const LandingCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  product: z.array(LandingProductSchema),
});

export const SignInSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Введите пароль длиной не менее 6 символов'),
});

export const ProductFormSchema = ProductSchema.pick({
  name: true,
  description: true,
  is_active: true,
  product_category_id: true,
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type ProductFormData = z.infer<typeof ProductFormSchema>;
