import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { randomUUID } from 'crypto';
import { prisma } from '@usta/database';

// Schemas
const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  image: z.string(),
  created_at: z.string().datetime().or(z.date()),
  updated_at: z.string().datetime().or(z.date()),
  product_type_id: z.string().uuid(),
}).openapi('Product');

const ProductTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  order: z.number(),
  created_at: z.string().datetime().or(z.date()),
  updated_at: z.string().datetime().or(z.date()),
}).openapi('ProductType');

const ProductTypeWithProductsSchema = ProductTypeSchema.extend({
  product: z.array(ProductSchema),
}).openapi('ProductTypeWithProducts');

export const productTypesRoutes = new OpenAPIHono();

// GET /
productTypesRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ProductTypeWithProductsSchema),
          },
        },
        description: 'Retrieve all product types with their products',
      },
    },
  }),
  async (c) => {
    const productTypes = await prisma.product_type.findMany({
      include: { product: true },
    });
    return c.json(productTypes);
  }
);

// GET /:id
productTypesRoutes.openapi(
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
            schema: ProductTypeWithProductsSchema,
          },
        },
        description: 'Retrieve a product type by ID',
      },
      404: {
        description: 'Product type not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const productType = await prisma.product_type.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!productType) {
      return c.json({ message: 'Product type not found' }, 404);
    }
    return c.json(productType);
  }
);

// POST /
productTypesRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string(),
              order: z.number(),
              product: z.object({
                connect: z.array(z.object({ id: z.string().uuid() })).optional(),
              }).optional(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: ProductTypeWithProductsSchema,
          },
        },
        description: 'Create a new product type',
      },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const { product, ...data } = body;
    const productType = await prisma.product_type.create({
      data: {
        id: randomUUID(),
        ...data,
        updated_at: new Date(),
        ...(product?.connect ? { product: { connect: product.connect } } : {}),
      },
      include: { product: true },
    });
    return c.json(productType, 201);
  }
);

// PATCH /:id
productTypesRoutes.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional(),
              order: z.number().optional(),
              product: z.object({
                connect: z.array(z.object({ id: z.string().uuid() })).optional(),
                disconnect: z.array(z.object({ id: z.string().uuid() })).optional(),
              }).optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProductTypeWithProductsSchema,
          },
        },
        description: 'Update a product type',
      },
      404: {
        description: 'Product type not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');

    const existing = await prisma.product_type.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: 'Product type not found' }, 404);
    }

    const { product, ...data } = body;
    const productType = await prisma.product_type.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
        ...(product
          ? {
              product: {
                ...(product.connect ? { connect: product.connect } : {}),
                ...(product.disconnect
                  ? { disconnect: product.disconnect }
                  : {}),
              },
            }
          : {}),
      },
      include: { product: true },
    });
    return c.json(productType);
  }
);

// DELETE /:id
productTypesRoutes.openapi(
  createRoute({
    method: 'delete',
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
            schema: z.object({ success: z.boolean() }),
          },
        },
        description: 'Delete a product type',
      },
      404: {
        description: 'Product type not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const existing = await prisma.product_type.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: 'Product type not found' }, 404);
    }

    await prisma.product_type.delete({ where: { id } });
    return c.json({ success: true });
  }
);
