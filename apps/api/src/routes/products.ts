import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { prisma } from '@usta/database';
import { randomUUID } from 'crypto';

import { uploadToMinio } from '../lib/minio.js';
import { revalidateFrontend } from '../lib/revalidate.js';

// Schemas
const ProductSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    is_active: z.boolean(),
    image: z.string(),
    created_at: z.string().datetime().or(z.date()),
    updated_at: z.string().datetime().or(z.date()),
    product_category_id: z.string().uuid(),
  })
  .openapi('Product');

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
            schema: z.array(ProductSchema),
          },
        },
        description: 'Retrieve all products',
      },
    },
  }),
  async (c) => {
    const products = await prisma.product.findMany();
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
            schema: ProductSchema,
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
          'multipart/form-data': {
            schema: z.object({
              file: z
                .instanceof(File)
                .openapi({ type: 'string', format: 'binary' }),
              name: z.string().optional(),
              description: z.string().optional(),
              categoryId: z.string().uuid(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: ProductSchema,
          },
        },
        description: 'Create a new product',
      },
      400: {
        description: 'Invalid input',
      },
    },
  }),
  async (c) => {
    const body = await c.req.parseBody();
    const file = body['file'] as unknown as File;
    const name = body['name'] as string;
    const description = body['description'] as string | undefined;
    const categoryId = body['categoryId'] as string;

    if (!file || !(file instanceof File)) {
      return c.json({ message: 'File is required' }, 400);
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;
    const imageUrl = await uploadToMinio(file, fileName);

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: name,
        description: description ?? null,
        image: imageUrl,
        product_category: { connect: { id: categoryId } },
        updated_at: new Date(),
      },
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
      params: z.object({
        id: z.string().uuid(),
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: z.object({
              file: z
                .instanceof(File)
                .openapi({ type: 'string', format: 'binary' })
                .optional(),
              name: z.string().optional(),
              description: z.string().optional(),
              categoryId: z.string().uuid().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProductSchema,
          },
        },
        description: 'Update a product',
      },
      404: {
        description: 'Product not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = await c.req.parseBody();

    const existing = await prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: 'Product not found' }, 404);
    }

    const file = body['file'] as unknown as File | undefined;
    const name = body['name'] as string | undefined;
    const description = body['description'] as string | undefined;
    const categoryId = body['categoryId'] as string | undefined;

    let imageUrl: string | undefined;
    if (file && file instanceof File) {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const fileName = `${randomUUID()}.${ext}`;
      imageUrl = await uploadToMinio(file, fileName);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        updated_at: new Date(),
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(categoryId
          ? { product_category: { connect: { id: categoryId } } }
          : {}),
      },
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
        description: 'Delete a product',
      },
      404: {
        description: 'Product not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const existing = await prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: 'Product not found' }, 404);
    }

    await prisma.product.delete({ where: { id } });
    revalidateFrontend();
    return c.json({ success: true });
  },
);
