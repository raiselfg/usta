import type { ProductCategoryWithProducts } from '@usta/types/product-categories';

import { Badge } from '@usta/ui/components/badge';
import { memo } from 'react';

import { DeleteProductCategoryButton } from './delete-product-category-button';
import { EditProductCategoryForm } from './edit-product-category-form';

interface ProductCategoryCardProps {
  category: ProductCategoryWithProducts;
}

export const ProductCategoryCard = memo(
  ({ category }: ProductCategoryCardProps) => {
    const isActive = category.is_active;
    const categoryPosition = category.order + 1;
    const categoryColor = category.color;

    return (
      <div
        className='group border-border bg-card relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl'
        style={
          categoryColor
            ? { boxShadow: `0 0 0 0px ${categoryColor}` }
            : undefined
        }
        onMouseEnter={e => {
          if (categoryColor) {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              `0 0 0 2px ${categoryColor}40, 0 20px 40px -8px ${categoryColor}20`;
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        }}
      >
        {categoryColor && (
          <div
            className='h-1 w-full shrink-0'
            style={{ backgroundColor: categoryColor }}
          />
        )}

        <div className='flex flex-1 flex-col gap-5 p-5'>
          {/* Заголовок */}
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-foreground text-lg leading-tight font-black tracking-tight uppercase italic'>
              {category.name}
            </h3>
          </div>

          <div className='bg-muted/40 flex items-center gap-3 rounded-lg p-3'>
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-[9px] font-bold tracking-widest uppercase'>
                Товаров
              </span>
              <span className='text-foreground text-center text-3xl leading-none font-black tabular-nums'>
                {category.product?.length || 0}
              </span>
            </div>
            <div className='bg-border mx-1 w-px self-stretch' />
            <div className='flex flex-col gap-1.5'>
              <Badge variant={isActive ? 'green' : 'red'}>
                {isActive ? 'На сайте' : 'Скрыто'}
              </Badge>
              <Badge variant='cyan'>Позиция: {categoryPosition}</Badge>

              {categoryColor && (
                <div className='flex items-center gap-1.5'>
                  <div
                    className='h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-white/20'
                    style={{ backgroundColor: categoryColor }}
                  />
                  <span className='text-muted-foreground font-mono text-[10px]'>
                    {categoryColor}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Действия */}
          <div className='border-border flex items-center justify-between border-t pt-3'>
            <EditProductCategoryForm category={category} />
            <DeleteProductCategoryButton categoryId={category.id} />
          </div>
        </div>
      </div>
    );
  },
);
