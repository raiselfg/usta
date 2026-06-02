import { NextResponse } from 'next/server';

import { prisma } from '@usta/database';
import { CreateProductApiSchema } from '@usta/types/products.js';
import { randomUUID } from 'crypto';

import { handle, requireAdmin } from '@/lib/handler';
import { revalidateFrontend } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

// GET /products — публичный. ?category=<id> фильтрует по категории
export const GET = handle(async req => {
  const categoryId = new URL(req.url).searchParams.get('category');

  const products = await prisma.product.findMany({
    where: categoryId ? { product_category_id: categoryId } : undefined,
    include: { product_category: true },
  });
  return NextResponse.json(products);
});

// POST /products — только админ
export const POST = handle(async req => {
  await requireAdmin(req);
  const data = CreateProductApiSchema.parse(await req.json());

  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? null,
      is_active: data.is_active,
      image: data.image,
      product_category: { connect: { id: data.product_category_id } },
    },
    include: { product_category: true },
  });

  revalidateFrontend();
  return NextResponse.json(product, { status: 201 });
});
