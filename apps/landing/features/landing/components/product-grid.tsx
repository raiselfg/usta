import Image from 'next/image';

import { LandingProduct } from '../api/get-landing-data';

interface Props {
  products: LandingProduct[];
}

export const ProductGrid = ({ products }: Props) => {
  return (
    <ul className="container grid list-none grid-cols-2 gap-2 p-0 sm:gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-12 xl:gap-16">
      {products.map((product) => (
        <li className="w-full" key={product.id}>
          <Image
            alt={product.name || 'Изображение товара'}
            className="h-auto w-full border-2 border-[oklch(81%_0.18_77)] object-cover"
            height={455}
            loading="eager"
            priority
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={product.image}
            width={305}
          />
        </li>
      ))}
    </ul>
  );
};
