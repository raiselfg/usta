import { Skeleton } from '@usta/ui/components/skeleton';

import { getLandingData } from '../api/get-landing-data';
import { CategorySection } from './category-section';
import { ProductGrid } from './product-grid';

export async function Catalog() {
  const productsWithCategories = await getLandingData();

  if (!productsWithCategories || productsWithCategories.length === 0) {
    return null;
  }

  return (
    <>
      {productsWithCategories.map((productCategory, i) => (
        <CategorySection key={productCategory.id} label={productCategory.name}>
          <ProductGrid
            isPriority={i === 0}
            products={productCategory.product}
          />
        </CategorySection>
      ))}
    </>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      {Array.from({ length: 2 }).map((_, i) => (
        <div className="flex flex-col gap-3" key={i}>
          <Skeleton className="mx-auto h-8 w-48 rounded bg-stone-800" />
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 md:gap-8 lg:gap-12 xl:gap-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                className="aspect-305/455 w-full rounded bg-stone-800"
                key={i}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
