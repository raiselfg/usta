import type { ProductCategoryWithProducts } from '@usta/types/product-categories';

import { Badge } from '@usta/ui/components/badge';
import { cn } from '@usta/ui/lib/utils';
import { memo } from 'react';

import { DeleteProductCategryButton } from './delete-product-category-button';
import { EditProductCategoryForm } from './edit-product-category-form';

interface ProductCategoryCardProps {
  category: ProductCategoryWithProducts;
}

export const ProductCategoryCard = memo(
  ({ category }: ProductCategoryCardProps) => {
    const isActive = category.is_active;

    return (
      <div className="group border-border bg-card hover:border-muted-foreground relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-1 flex-col gap-6 p-6">
          <h3 className="text-foreground text-xl font-black tracking-tight uppercase italic transition-transform group-hover:translate-x-1">
            {category.name}
          </h3>

          <div className="flex items-start justify-between border-t pt-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Товаров в категории
              </span>
              <span className="text-foreground text-2xl font-black tracking-tighter">
                {category.product?.length || 0}
              </span>
            </div>
            <Badge
              className={cn(
                isActive
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
              )}
            >
              {isActive ? 'Отображается на сайте' : 'Не отображается на сайте'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <EditProductCategoryForm category={category} />
            <DeleteProductCategryButton categoryId={category.id} />
          </div>
        </div>
      </div>
    );
  },
);
