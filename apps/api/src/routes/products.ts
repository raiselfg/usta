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

const ProductCategorySchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    order: z.number(),
    is_active: z.boolean(),
    created_at: z.string().datetime().or(z.date()),
    updated_at: z.string().datetime().or(z.date()),
  })
  .openapi('ProductCategory');

const ProductWithProductCategorySchema = ProductSchema.extend({
  product_category: ProductCategorySchema.nullable(),
}).openapi('ProductWithProductCategory');

const CreateProductBodySchema = z.object({
  file: z
    .instanceof(File)
    .optional()
    .openapi({ type: 'string', format: 'binary' }),
  name: z.string(),
  description: z.string().optional(),
  product_category_id: z.string().uuid(),
  image: z.string().optional(),
});

const UpdateProductBodySchema = z.object({
  file: z
    .instanceof(File)
    .optional()
    .openapi({ type: 'string', format: 'binary' }),
  name: z.string().optional(),
  description: z.string().optional(),
  product_category_id: z.string().uuid().optional(),
  image: z.string().optional(),
  is_active: z.preprocess(
    (v) => (v === 'true' ? true : v === 'false' ? false : v),
    z.boolean().optional(),
  ),
});

type CreateProductInput = z.infer<typeof CreateProductBodySchema>;
type UpdateProductInput = z.infer<typeof UpdateProductBodySchema>;

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
          'multipart/form-data': { schema: CreateProductBodySchema },
          'application/json': {
            schema: CreateProductBodySchema.omit({ file: true }),
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
    const contentType = c.req.header('content-type') || '';
    const rawData = contentType.includes('application/json')
      ? await c.req.json()
      : await c.req.parseBody();

    const result = CreateProductBodySchema.safeParse(rawData);
    if (!result.success) {
      console.error('[Validation Error]', result.error.format());
      return c.json(
        { message: 'Validation failed', errors: result.error.format() },
        400,
      );
    }
    const validatedData = result.data;
    const { file, name, description, product_category_id, image } =
      validatedData;

    let imageUrl = image;
    if (file instanceof File) {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const fileName = `${randomUUID()}.${ext}`;
      imageUrl = await uploadToMinio(file, fileName);
    }

    if (!imageUrl) {
      return c.json({ message: 'Image or file is required' }, 400);
    }

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name,
        description: description ?? null,
        image: imageUrl,
        product_category: { connect: { id: product_category_id } },
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
      params: z.object({ id: z.string().uuid() }),
      body: {
        content: {
          'multipart/form-data': { schema: UpdateProductBodySchema },
          'application/json': {
            schema: UpdateProductBodySchema.omit({ file: true }),
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

    let imageUrl = validatedData.image;
    if (validatedData.file instanceof File) {
      const ext = validatedData.file.name.split('.').pop() ?? 'jpg';
      const fileName = `${randomUUID()}.${ext}`;
      imageUrl = await uploadToMinio(validatedData.file, fileName);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        is_active: validatedData.is_active,
        updated_at: new Date(),
        ...(imageUrl ? { image: imageUrl } : {}),
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
