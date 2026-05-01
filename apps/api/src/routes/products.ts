import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { prisma } from '@usta/database';
import {
  ProductWithProductCategorySchema as BaseProductWithProductCategorySchema,
  CreateProductApiSchema as BaseCreateProductApiSchema,
  UpdateProductBodySchema as BaseUpdateProductBodySchema,
} from '@usta/types/products.js';
import { randomUUID } from 'crypto';

import { revalidateFrontend } from '../lib/revalidate.js';

// Schemas
const ProductWithProductCategorySchema =
  BaseProductWithProductCategorySchema.openapi('ProductWithProductCategory');
const CreateProductApiSchema = BaseCreateProductApiSchema.openapi({
  type: 'object',
});
const UpdateProductBodySchema = BaseUpdateProductBodySchema.openapi({
  type: 'object',
});

export const productsRoutes = new OpenAPIHono();

// GET /
productsRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ProductWithProductCategorySchema),
          },
        },
        description: 'Retrieve all products',
      },
    },
  }),
  async (c) => {
    const products = await prisma.product.findMany({
      include: { product_category: true },
    });
    return c.json(products);
  },
);

// GET /:id
productsRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: z.object({
        id: z
          .string()
          .uuid()
          .openapi({
            param: {
              name: 'id',
              in: 'path',
            },
            example: '123e4567-e89b-12d3-a456-426614174000',
          }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProductWithProductCategorySchema,
          },
        },
        description: 'Retrieve a product by ID',
      },
      404: {
        description: 'Product not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const product = await prisma.product.findUnique({
      where: { id },
      include: { product_category: true },
    });
    if (!product) {
      return c.json({ message: 'Product not found' }, 404);
    }
    return c.json(product);
  },
);

// POST /
productsRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateProductApiSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': { schema: ProductWithProductCategorySchema },
        },
        description: 'Create a new product',
      },
      400: { description: 'Invalid input' },
    },
  }),
  async (c) => {
    const data = c.req.valid('json');

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: data.name,
        description: data.description ?? null,
        is_active: data.is_active,
        image: data.image,
        product_category: { connect: { id: data.product_category_id } },
        updated_at: new Date(),
      },
      include: { product_category: true },
    });

    revalidateFrontend();
    return c.json(product, 201);
  },
);

// PATCH /:id
productsRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: z.object({ id: z.uuid() }),
      body: {
        content: {
          'multipart/form-data': { schema: UpdateProductBodySchema },
          'application/json': {
            schema: UpdateProductBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': { schema: ProductWithProductCategorySchema },
        },
        description: 'Update a product',
      },
      404: { description: 'Product not found' },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const contentType = c.req.header('content-type') || '';
    const rawData = contentType.includes('application/json')
      ? await c.req.json()
      : await c.req.parseBody();

    const result = UpdateProductBodySchema.safeParse(rawData);
    if (!result.success) {
      console.error('[Validation Error]', result.error.format());
      return c.json(
        { message: 'Validation failed', errors: result.error.format() },
        400,
      );
    }
    const validatedData = result.data;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Product not found' }, 404);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        is_active: validatedData.is_active,
        updated_at: new Date(),
        ...(validatedData.product_category_id
          ? {
              product_category: {
                connect: { id: validatedData.product_category_id },
              },
            }
          : {}),
      },
      include: { product_category: true },
    });

    revalidateFrontend();
    return c.json(product);
  },
);

// DELETE /:id
productsRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: { params: z.object({ id: z.string().uuid() }) },
    responses: {
      200: {
        content: {
          'application/json': { schema: z.object({ success: z.boolean() }) },
        },
        description: 'Delete a product',
      },
      404: { description: 'Product not found' },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return c.json({ message: 'Product not found' }, 404);

    await prisma.product.delete({ where: { id } });
    revalidateFrontend();
    return c.json({ success: true });
  },
);
