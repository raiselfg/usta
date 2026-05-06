import type { ProductWithProductCategory } from '@usta/types/products';

import { Badge } from '@usta/ui/components/badge';
import { cn } from '@usta/ui/lib/utils';
import { memo } from 'react';

import { DeleteProductButton } from './delete-product-button';
import { EditProductForm } from './edit-product-form';

export const ProductCard = memo(
  ({ product }: { product: ProductWithProductCategory }) => {
    const isActive = product.is_active;

    return (
      <div className="group border-border bg-card relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl">
        <div className="bg-muted relative aspect-3/4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name || 'Товар'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out"
          />

          <Badge
            className={cn(
              'absolute top-1 left-1',
              isActive
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
            )}
          >
            {isActive ? 'Отображается на сайте' : 'Не отображается на сайте'}
          </Badge>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div className="flex flex-col items-start justify-between gap-2">
            {product.product_category && (
              <span className="text-muted-foreground shrink-0 text-[10px] font-medium tracking-widest uppercase">
                {product.product_category.name}
              </span>
            )}
            <span className="text-foreground truncate text-sm font-bold tracking-tight">
              {product.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <EditProductForm product={product} />
            <DeleteProductButton productId={product.id} />
          </div>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = 'ProductCard';
