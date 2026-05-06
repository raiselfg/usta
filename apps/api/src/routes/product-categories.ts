import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { prisma } from '@usta/database';
import {
  ProductCategoryWithProductsSchema as BaseProductCategoryWithProductsSchema,
  CreateProductCategorySchema,
  ProductCategorySchema,
  UpdateProductCategorySchema,
} from '@usta/types/product-categories.js';
import { randomUUID } from 'crypto';

import { revalidateFrontend } from '../lib/revalidate.js';

const ProductCategoryWithProductsSchema =
  BaseProductCategoryWithProductsSchema.openapi('ProductCategoryWithProducts');

export const productCategoriesRoutes = new OpenAPIHono();

// GET /
productCategoriesRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ProductCategoryWithProductsSchema),
          },
        },
        description: 'Retrieve all product categories with their products',
      },
    },
  }),
  async (c) => {
    const productCategories = await prisma.productCategory.findMany({
      orderBy: [{ order: 'asc' }],
      include: { product: true },
    });
    return c.json(productCategories);
  },
);

// GET /:id
productCategoriesRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProductCategoryWithProductsSchema,
          },
        },
        description: 'Retrieve a product category by ID',
      },
      404: {
        description: 'Product category not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const productCategory = await prisma.productCategory.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!productCategory) {
      return c.json({ message: 'Product category not found' }, 404);
    }
    return c.json(productCategory);
  },
);

// POST /
productCategoriesRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateProductCategorySchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: ProductCategorySchema,
          },
        },
        description: 'Create a new product category',
      },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const { name, is_active } = body;
    const productCategory = await prisma.productCategory.create({
      data: {
        id: randomUUID(),
        name,
        is_active,
        updated_at: new Date(),
      },
    });
    revalidateFrontend();
    return c.json(productCategory, 201);
  },
);

// PATCH /:id
productCategoriesRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.uuid({ version: 'v4' }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateProductCategorySchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProductCategorySchema,
          },
        },
        description: 'Update a product category',
      },
      404: {
        description: 'Product category not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');

    const existing = await prisma.productCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: 'Product category not found' }, 404);
    }

    const { name, is_active } = body;

    const productCategory = await prisma.productCategory.update({
      where: { id },
      data: {
        name,
        is_active,
        updated_at: new Date(),
      },
    });
    revalidateFrontend();
    return c.json(productCategory);
  },
);

// DELETE /:id
productCategoriesRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.uuid({ version: 'v4' }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({ success: z.boolean() }),
          },
        },
        description: 'Delete a product category',
      },
      404: {
        description: 'Product category not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const existing = await prisma.productCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: 'Product category not found' }, 404);
    }

    await prisma.productCategory.delete({ where: { id } });
    revalidateFrontend();
    return c.json({ success: true });
  },
);
