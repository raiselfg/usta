import type { ProductWithProductCategory } from '@usta/types/products';

import { DeleteProductForm } from './delete-product-form';
import { EditProductForm } from './edit-product-form';

export const ProductCard = ({
  product,
}: {
  product: ProductWithProductCategory;
}) => {
  return (
    <div
      key={product.id}
      className="flex flex-col items-center justify-center gap-1 overflow-hidden"
    >
      <img
        src={product.image}
        alt={product.name || 'Товар'}
        className="h-64 w-48 object-cover"
      />
      <span className="text-lg font-bold">{product.name}</span>
      <div className="flex w-full max-w-48 items-center justify-between">
        <EditProductForm product={product} />
        <DeleteProductForm productId={product.id} />
      </div>
    </div>
  );
};
