import { CategorySection } from '@/features/landing/components/category-section';
import Contacts from '@/features/landing/components/contact-info';
import Hero from '@/features/landing/components/hero';
import { LandingSection } from '@/features/landing/components/landing-section';
import { ProductGrid } from '@/features/landing/components/product-grid';
import { product, product_type } from '@usta/database';

interface ProductTypeApi extends product_type {
  product: product[];
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-types`, {
    next: { revalidate: 3600, tags: ['catalog'] },
  });
  const productTypesData: ProductTypeApi[] = await res.json();

  if (!res.ok) {
    return <div>Error</div>;
  }

  const sortedProductTypes = productTypesData
    .map((productType) => ({
      ...productType,
      product: productType.product.filter((product) => product.is_active),
    }))
    .filter((productType) => productType.product.length > 0)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <Hero />
      <div className="container mx-auto mt-3 flex flex-col gap-8 px-3 text-stone-300 lg:px-4 xl:px-0">
        <LandingSection title="О нас">
          <p className="mx-auto w-9/10 text-center text-2xl lg:w-3/5">
            Бренд «УстА» — это место, где одежда становится искусством, —
            способом самовыражения. Мы создаём уникальные образы, вдохновлённые
            культурными корнями, разными эпохами, событиями прошедшего времени и
            современностью. Ведь мода это всегда отражение жизни и личности, не
            случайно народная мудрость гласит:- &quot;По одежке
            встречают&quot;... Здесь мы переосмысляем моду, соединяя прошлое и
            настоящее. Вдохновляйтесь вместе с нами и меняйте мир через стиль!
          </p>
        </LandingSection>
        <LandingSection title="Каталог">
          {sortedProductTypes?.map((productType) => (
            <CategorySection key={productType.id} label={productType.name}>
              <ProductGrid products={productType.product} />
            </CategorySection>
          ))}
        </LandingSection>
        <LandingSection className="mb-4" title="Контакты">
          <Contacts />
        </LandingSection>
      </div>
    </>
  );
}
