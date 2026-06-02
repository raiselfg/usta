import { NextResponse } from 'next/server';

import { prisma } from '@usta/database';
import { z } from 'zod';

import { handle, requireAdmin } from '@/lib/handler';
import { revalidateFrontend } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

const ReorderSchema = z.array(z.uuid());

// POST /product-categories/reorder — только админ
export const POST = handle(async req => {
  await requireAdmin(req);
  const categoryIds = ReorderSchema.parse(await req.json());

  await prisma.$transaction(
    categoryIds.map((id, index) =>
      prisma.productCategory.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );

  revalidateFrontend();
  return NextResponse.json({ success: true });
});
