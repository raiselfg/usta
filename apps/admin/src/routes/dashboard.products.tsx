import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent } from '@usta/ui/components/card';
import { Skeleton } from '@usta/ui/components/skeleton';

import { productOptions } from '@/lib/query-options';
import { CreateProductForm } from '@/products/components/create-product';
import { ProductCard } from '@/products/components/product-card';

export const Route = createFileRoute('/dashboard/products')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(productOptions.list()),
  component: DashboardProductsContent,
});

const SKELETONS = Array.from({ length: 16 }, (_, i) => (
  <div key={i} className="flex flex-col items-center justify-center gap-2">
    <Skeleton className="h-64 w-48" />
    <div className="flex w-full max-w-48 items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
));

function DashboardProductsContent() {
  const { data: products } = useSuspenseQuery(productOptions.list());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Товары</h1>
        <CreateProductForm />
      </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {products
              ? products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : SKELETONS}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
