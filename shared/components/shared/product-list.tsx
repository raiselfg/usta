import products from '@/data/products.json';
import Image from 'next/image';
import { Container } from '../ui/container';

export const ProductList = () => {
  return (
    <Container>
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Image
            className="mx-auto"
            key={product.id}
            src={product.imageUrl}
            alt={product.name}
            height={250}
            width={250}
          />
        ))}
      </section>
    </Container>
  );
};
