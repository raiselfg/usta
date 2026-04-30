import { Suspense } from 'react';

import {
  Catalog,
  CatalogSkeleton,
} from '@/features/landing/components/catalog';
import Hero from '@/features/landing/components/hero';
import { LandingSection } from '@/features/landing/components/landing-section';
import dynamic from 'next/dynamic';

const ContactInfo = dynamic(
  () => import('@/features/landing/components/contact-info'),
  {
    ssr: true,
  },
);

export default function Home() {
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
          <Suspense fallback={<CatalogSkeleton />}>
            <Catalog />
          </Suspense>
        </LandingSection>

        <LandingSection className="mb-4" title="Контакты">
          <ContactInfo />
        </LandingSection>
      </div>
    </>
  );
}
