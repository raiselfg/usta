import { Container } from '../ui/container';

export interface Product {
  id: string | number;
  name: string;
  imageUrl: string;
  altText?: string;
}

interface Props {
  products: Product[];
}

export const ProductList = ({ products }: Props) => {
  return (
    <Container>
      <section
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-8 lg:gap-12 xl:gap-16"
        role="list"
        aria-label="Список продуктов"
      >
        {products.map((product) => (
          <article key={product.id} className="w-full " role="listitem">
            <img
              className="w-full h-auto border-2 border-[oklch(81%_0.18_77)]"
              src={product.imageUrl}
              alt={product.altText || product.name}
              width={305}
              height={455}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          </article>
        ))}
      </section>
    </Container>
  );
};
