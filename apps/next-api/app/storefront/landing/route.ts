import { NextResponse } from 'next/server';

import { prisma } from '@usta/database';

import { handle } from '@/lib/handler';

export const dynamic = 'force-dynamic';

// GET /storefront/landing — публичный (storefront)
export const GET = handle(async () => {
  const categories = await prisma.productCategory.findMany({
    where: { is_active: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      product: {
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return NextResponse.json(categories);
});
