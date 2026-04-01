import { Hono } from 'hono';
import { uploadToMinio } from '../lib/minio.js';
import { randomUUID } from 'crypto';
import { prisma } from '@usta/database';

export const productsRoutes = new Hono()
  .get('/', async (c) => {
    const products = await prisma.product.findMany();
    return c.json(products);
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return c.text('Product not found', 404);
    }
    return c.json(product);
  })
  .post('/', async (c) => {
    const body = await c.req.parseBody();
    const file = body['file'] as unknown as File;
    const name = body['name'] as string | undefined;
    const description = body['description'] as string | undefined;
    const typeId = body['typeId'] as string;

    if (!file || !(file instanceof File)) {
      return c.text('File is required', 400);
    }

    // Generate a unique filename preserving the extension
    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;
    const imageUrl = await uploadToMinio(file, fileName);

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: name ?? null,
        description: description ?? null,
        image: imageUrl,
        product_type: { connect: { id: typeId } },
        updated_at: new Date(),
      },
    });
    return c.json(product, 201);
  })
  .patch('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.parseBody();

    const existing = await prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.text('Product not found', 404);
    }

    const file = body['file'] as unknown as File | undefined;
    const name = body['name'] as string | undefined;
    const description = body['description'] as string | undefined;
    const typeId = body['typeId'] as string | undefined;

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
        ...(typeId ? { product_type: { connect: { id: typeId } } } : {}),
      },
    });
    return c.json(product);
  })
  .delete('/:id', async (c) => {
    const id = c.req.param('id');
    const existing = await prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.text('Product not found', 404);
    }

    await prisma.product.delete({ where: { id } });
    return c.json({ success: true });
  });
