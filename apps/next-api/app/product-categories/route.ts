import { NextResponse } from 'next/server';

import { prisma } from '@usta/database';
import { CreateProductCategorySchema } from '@usta/types/product-categories.js';

import { handle, requireAdmin } from '@/lib/handler';
import { revalidateFrontend } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

// GET /product-categories — публичный
export const GET = handle(async () => {
  const productCategories = await prisma.productCategory.findMany({
    orderBy: [{ order: 'asc' }],
    include: { product: true },
  });
  return NextResponse.json(productCategories);
});

// POST /product-categories — только админ
export const POST = handle(async req => {
  await requireAdmin(req);
  const { name, is_active, color } = CreateProductCategorySchema.parse(
    await req.json(),
  );

  const result = await prisma.$transaction(async tx => {
    const lastCategory = await tx.productCategory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = lastCategory ? lastCategory.order + 1 : 0;

    return await tx.productCategory.create({
      data: {
        name,
        is_active,
        order: nextOrder,
        color,
      },
    });
  });

  revalidateFrontend();
  return NextResponse.json(result, { status: 201 });
});
