import { NextResponse } from 'next/server';

import { prisma } from '@usta/database';
import { UpdateProductBodySchema } from '@usta/types/products.js';
import { z } from 'zod';

import { NotFoundError } from '@/lib/errors';
import { handle, requireAdmin } from '@/lib/handler';
import { revalidateFrontend } from '@/lib/revalidate';
import { deleteFile } from '@/lib/s3cloud';

export const dynamic = 'force-dynamic';

const idSchema = z.uuid();

// GET /products/:id — публичный
export const GET = handle(async (_req, { params }) => {
  const { id } = await params;
  idSchema.parse(id);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { product_category: true },
  });
  if (!product) throw new NotFoundError('Product not found');
  return NextResponse.json(product);
});

// PATCH /products/:id — только админ
export const PATCH = handle(async (req, { params }) => {
  await requireAdmin(req);
  const { id } = await params;
  idSchema.parse(id);

  const validatedData = UpdateProductBodySchema.parse(await req.json());

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Product findUnique failed');

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: validatedData.name,
      description: validatedData.description,
      is_active: validatedData.is_active,
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
  return NextResponse.json(product);
});

// DELETE /products/:id — только админ
export const DELETE = handle(async (req, { params }) => {
  await requireAdmin(req);
  const { id } = await params;
  idSchema.parse(id);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError('Product not found');

  // Сначала удаляем из БД. Если БД ок, но S3 упал — логируем, но
  // считаем ресурс удалённым (как в Hono-версии).
  await prisma.product.delete({ where: { id } });

  try {
    await deleteFile(product.image);
  } catch (err) {
    console.error(`[Cleanup] Failed to delete file for product ${id}:`, err);
  }

  revalidateFrontend();
  return NextResponse.json({ success: true });
});
