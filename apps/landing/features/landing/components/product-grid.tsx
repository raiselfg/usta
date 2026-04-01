import { product } from '@usta/database';
import Image from 'next/image';

interface Props {
  products: product[];
}

export const ProductGrid = ({ products }: Props) => {
  return (
    <ul className="container grid list-none grid-cols-2 gap-2 p-0 sm:gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-12 xl:gap-16">
      {products.map((product) => (
        <li key={product.id} className="w-full">
          <Image
            className="h-auto w-full border-2 border-[oklch(81%_0.18_77)] object-cover"
            src={product.image}
            alt={product.name || 'Изображение товара'}
            width={305}
            height={455}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </li>
      ))}
    </ul>
  );
};
