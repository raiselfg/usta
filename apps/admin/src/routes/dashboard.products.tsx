import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@usta/ui/components/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@usta/ui/components/select';
import { Separator } from '@usta/ui/components/separator';
import { Skeleton } from '@usta/ui/components/skeleton';
import { useState } from 'react';

import { CreateProductForm } from '@/products/components/create-product-form';
import { ProductCard } from '@/products/components/product-card';
import { categoryOptions, productOptions } from '@/shared/lib/query-options';

export const Route = createFileRoute('/dashboard/products')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(productOptions.list()),
      queryClient.ensureQueryData(categoryOptions.list()),
    ]),
  component: DashboardProductsContent,
});

const ALL_CATEGORIES = 'all';

const SKELETONS = Array.from({ length: 16 }, (_, i) => (
  <div
    key={i}
    className='flex flex-col items-center justify-center gap-2'
  >
    <Skeleton className='h-64 w-48' />
    <div className='flex w-full max-w-48 items-center justify-between'>
      <Skeleton className='h-8 w-32' />
      <Skeleton className='h-8 w-8' />
    </div>
  </div>
));

function DashboardProductsContent() {
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES);

  const { data: categories } = useSuspenseQuery(categoryOptions.list());
  const { data: products, isPlaceholderData } = useQuery({
    ...productOptions.list(
      categoryId === ALL_CATEGORIES ? undefined : categoryId,
    ),
    placeholderData: keepPreviousData,
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='bg-background sticky top-0 z-1 flex flex-col gap-4 py-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-black'>Товары</h1>
          <CreateProductForm />
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <Badge variant={'indigo'}>
            Всего товаров: {products?.length || 0}
          </Badge>

          <Select
            value={categoryId}
            onValueChange={setCategoryId}
          >
            <SelectTrigger className='w-max'>
              <SelectValue placeholder='Категория' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Все категории</SelectItem>
              {categories?.map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                >
                  <span className='flex items-center gap-2'>
                    <span
                      className='h-2 w-2 shrink-0 rounded-full'
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />
      </div>

      <div
        className='grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
        style={{ opacity: isPlaceholderData ? 0.6 : 1 }}
      >
        {products
          ? products.map((product, index) => (
              <div
                key={product.id}
                className='animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          : SKELETONS}
      </div>

      {products && products.length === 0 && (
        <p className='text-muted-foreground py-8 text-center'>
          В этой категории пока нет товаров
        </p>
      )}
    </div>
  );
}
