import type { LandingProduct } from '@usta/types/products';
import Image from 'next/image';

interface Props {
  products: LandingProduct[];
  isPriority?: boolean;
}

export const ProductGrid = ({ products, isPriority = false }: Props) => {
  return (
    <ul className="container grid list-none grid-cols-2 gap-2 p-0 sm:gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-12 xl:gap-16">
      {products.map((product, index) => (
        <li className="relative aspect-305/455 w-full" key={product.id}>
          <Image
            alt={product.name || 'Изображение товара'}
            className="border-2 border-[oklch(0.81_0.18_77)] object-cover transition-opacity"
            fetchPriority={isPriority && index < 2 ? 'high' : 'auto'}
            fill
            priority={isPriority && index < 4}
            quality={70}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
            src={product.image}
          />
        </li>
      ))}
    </ul>
  );
};
