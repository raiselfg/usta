import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@usta/ui/components/button';
import { Card, CardContent } from '@usta/ui/components/card';
import { Skeleton } from '@usta/ui/components/skeleton';

import { ProductCard } from '@/products/components/product-card';
import { products } from '@/products/lib/products';

export const Route = createFileRoute('/dashboard/products')({
  component: DashboardProductsContent,
});

function DashboardProductsContent() {
  const { isPending, isError, data } = useQuery({
    queryKey: ['products'],
    queryFn: products.getProducts,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Button>Добавить товар</Button>
      </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {isError && (
              <Card className="bg-destructive flex h-100 w-full items-center justify-center">
                <CardContent>Ошибка при получении продуктов</CardContent>
              </Card>
            )}

            {isPending &&
              Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <Skeleton className="h-64 w-48" />
                  <div className="flex w-full max-w-48 items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}

            {data &&
              data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
