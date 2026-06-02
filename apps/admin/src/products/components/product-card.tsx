// import type { ProductWithProductCategory } from '@usta/types/products';

// import { Badge } from '@usta/ui/components/badge';
// import { memo } from 'react';

// import { DeleteProductButton } from './delete-product-button';
// import { EditProductForm } from './edit-product-form';

// export const ProductCard = memo(
//   ({ product }: { product: ProductWithProductCategory }) => {
//     const isActive = product.is_active;

//     return (
//       <div className='group border-border bg-card relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl'>
//         <div className='bg-muted relative aspect-3/4 overflow-hidden'>
//           <img
//             src={product.image}
//             alt={product.name || 'Товар'}
//             className='h-full w-full object-cover'
//           />

//           <Badge
//             variant={isActive ? 'green' : 'red'}
//             className='absolute top-1 left-1'
//           >
//             {isActive ? 'Отображается на сайте' : 'Не отображается на сайте'}
//           </Badge>
//         </div>

//         <div className='flex flex-col gap-1 p-4'>
//           <div className='flex flex-col items-start justify-between gap-2'>
//             {product.product_category && (
//               <Badge
//                 style={{
//                   backgroundColor: product.product_category.color,
//                 }}
//                 className='shrink-0'
//               >
//                 {product.product_category.name}
//               </Badge>
//             )}
//             <span className='truncate text-sm font-semibold'>
//               {product.name}
//             </span>
//           </div>
//           <div className='flex items-center justify-between'>
//             <EditProductForm product={product} />
//             <DeleteProductButton productId={product.id} />
//           </div>
//         </div>
//       </div>
//     );
//   },
// );
import type { ProductWithProductCategory } from '@usta/types/products';

import { Badge } from '@usta/ui/components/badge';
import { memo } from 'react';

import { DeleteProductButton } from './delete-product-button';
import { EditProductForm } from './edit-product-form';

export const ProductCard = memo(
  ({ product }: { product: ProductWithProductCategory }) => {
    const isActive = product.is_active;
    const categoryColor = product.product_category?.color;

    return (
      <div className='group border-border bg-card relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
        <div className='bg-muted relative aspect-3/4 overflow-hidden'>
          <img
            src={product.image}
            alt={product.name || 'Товар'}
            className='h-full w-full object-cover'
          />

          <div className='absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10' />

          <Badge
            variant={isActive ? 'green' : 'red'}
            className='absolute top-2 left-2 shadow-sm'
          >
            {isActive ? 'Отображается на сайте' : 'Не отображается на сайте'}
          </Badge>
        </div>

        {/* Контент */}
        <div className='flex flex-col gap-3 p-3'>
          <div className='flex flex-col gap-1.5'>
            {product.product_category && (
              <div className='flex items-center gap-1.5'>
                <span
                  className='h-2 w-2 shrink-0 rounded-full'
                  style={{ backgroundColor: categoryColor ?? 'currentColor' }}
                />
                <span className='text-muted-foreground truncate text-[11px] font-bold tracking-wider uppercase'>
                  {product.product_category.name}
                </span>
              </div>
            )}
            <span className='text-foreground truncate text-sm leading-snug font-semibold'>
              {product.name}
            </span>
          </div>

          {/* Действия */}
          <div className='border-border flex items-center justify-between border-t pt-2'>
            <EditProductForm product={product} />
            <DeleteProductButton productId={product.id} />
          </div>
        </div>
      </div>
    );
  },
);
