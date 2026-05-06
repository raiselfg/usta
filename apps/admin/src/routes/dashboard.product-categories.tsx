import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@usta/ui/components/separator';

import { categoryOptions } from '@/lib/query-options';
import { CreateProductCategoryForm } from '@/product-category/components/create-product-category-form';
import { ProductCategoryCard } from '@/product-category/components/product-category-card';

export const Route = createFileRoute('/dashboard/product-categories')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(categoryOptions.list()),
  component: DashboardProductCategoriesContent,
});

function DashboardProductCategoriesContent() {
  const { data: categories } = useSuspenseQuery(categoryOptions.list());

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-background sticky top-0 z-1 flex flex-col gap-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-4xl font-black">
            Категории товаров
          </h1>
          <CreateProductCategoryForm />
        </div>
        <span className="text-sm">
          Всего категорий: {categories?.length || 0}
        </span>
        <Separator />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories &&
          categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <ProductCategoryCard category={category} />
            </div>
          ))}
      </div>
    </div>
  );
}
