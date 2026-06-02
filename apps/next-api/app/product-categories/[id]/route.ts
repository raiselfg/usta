import { NextResponse } from 'next/server';

import { prisma } from '@usta/database';
import { UpdateProductCategorySchema } from '@usta/types/product-categories.js';
import { z } from 'zod';

import { NotFoundError, ValidationError } from '@/lib/errors';
import { handle, requireAdmin } from '@/lib/handler';
import { revalidateFrontend } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

const idSchema = z.uuid();

// GET /product-categories/:id — публичный
export const GET = handle(async (_req, { params }) => {
  const { id } = await params;
  idSchema.parse(id);

  const productCategory = await prisma.productCategory.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!productCategory) throw new NotFoundError('Product category not found');
  return NextResponse.json(productCategory);
});

// PATCH /product-categories/:id — только админ
export const PATCH = handle(async (req, { params }) => {
  await requireAdmin(req);
  const { id } = await params;
  idSchema.parse(id);

  const { name, is_active, color } = UpdateProductCategorySchema.parse(
    await req.json(),
  );

  const existing = await prisma.productCategory.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Product category not found');

  const productCategory = await prisma.productCategory.update({
    where: { id },
    data: { name, is_active, color },
  });

  revalidateFrontend();
  return NextResponse.json(productCategory);
});

// DELETE /product-categories/:id — только админ
export const DELETE = handle(async (req, { params }) => {
  await requireAdmin(req);
  const { id } = await params;
  idSchema.parse(id);

  const existing = await prisma.productCategory.findUnique({
    where: { id },
    include: { _count: { select: { product: true } } },
  });

  if (!existing) throw new NotFoundError('Product category not found');

  if (existing._count.product > 0) {
    throw new ValidationError('Cannot delete category that still has products');
  }

  await prisma.productCategory.delete({ where: { id } });
  revalidateFrontend();
  return NextResponse.json({ success: true });
});
