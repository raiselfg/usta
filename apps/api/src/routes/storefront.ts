import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { prisma } from '@usta/database';

export const storefrontRoutes = new OpenAPIHono();

const LandingProductSchema = z
  .object({
    id: z.string().uuid(),
    image: z.string(),
  })
  .openapi('LandingProduct');

const LandingCategorySchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    product: z.array(LandingProductSchema),
  })
  .openapi('LandingCategory');

storefrontRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/landing',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(LandingCategorySchema),
          },
        },
        description: 'Retrieve categories with products for the landing page',
      },
    },
  }),
  async (c) => {
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
            image: true,
          },
        },
      },
    });
    return c.json(categories);
  },
);
