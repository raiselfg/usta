import { Hono } from 'hono';
import { randomUUID } from 'crypto';
import { prisma } from '@usta/database';

export const productTypesRoutes = new Hono()
  .get('/', async (c) => {
    const productTypes = await prisma.product_type.findMany({
      include: { product: true },
    });
    return c.json(productTypes);
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const productType = await prisma.product_type.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!productType) {
      return c.text('Product type not found', 404);
    }
    return c.json(productType);
  })
  .post('/', async (c) => {
    const body = await c.req.json();
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
  })
  .patch('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await prisma.product_type.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.text('Product type not found', 404);
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
  })
  .delete('/:id', async (c) => {
    const id = c.req.param('id');
    const existing = await prisma.product_type.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.text('Product type not found', 404);
    }

    await prisma.product_type.delete({ where: { id } });
    return c.json({ success: true });
  });
