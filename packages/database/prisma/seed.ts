import { products, productTypes } from './constants';
import { prisma } from '../src/client';

async function main() {
  console.log('Start seeding...');

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "product", "product_type" CASCADE;`,
  );
  console.log('Tables truncated.');

  for (const type of productTypes) {
    try {
      const created = await prisma.product_type.create({
        data: {
          ...type,
          updated_at: new Date(),
        },
      });
      console.log(`Created product type: ${created.name} (id: ${created.id})`);
    } catch (error) {
      console.error(`Failed to create product type ${type.name}:`, error);
      throw error;
    }
  }

  for (const product of products) {
    try {
      const created = await prisma.product.create({
        data: {
          ...product,
          updated_at: new Date(),
        },
      });
      console.log(`Created product: ${created.id}`);
    } catch (error) {
      console.error(`Failed to create product ${product.image}:`, error);
      throw error;
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed script failed with error:');
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
