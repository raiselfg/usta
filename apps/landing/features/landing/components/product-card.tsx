import type { LandingProduct } from '@usta/types/products';
import Image from 'next/image';

interface Props {
  product: LandingProduct;
  isPriority: boolean;
}

export const ProductCard = ({ product, isPriority }: Props) => {
  return (
    <div className="relative">
      <Image
        alt={product.name || 'Изображение товара'}
        className="w-full border-2 object-cover transition-opacity"
        priority={isPriority}
        quality={70}
        height={455}
        width={305}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        src={product.image}
      />
    </div>
  );
};
