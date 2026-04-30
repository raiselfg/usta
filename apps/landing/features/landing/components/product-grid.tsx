import type { LandingProduct } from '@usta/types/products';
import { ProductCard } from './product-card';

interface Props {
  products: LandingProduct[];
  isFirstCategory: boolean;
}

export const ProductGrid = ({ products, isFirstCategory }: Props) => {
  return (
    <ul className="container grid list-none grid-cols-2 gap-2 p-0 sm:gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-12 xl:gap-16">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            isPriority={isFirstCategory && index < 4}
          />
        </li>
      ))}
    </ul>
  );
};
