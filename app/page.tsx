import { Post } from '@/shared/components/shared/post';
import { ProductList } from '@/shared/components/shared/product-list';
import { Container } from '@/shared/components/ui/container';
import Contacts from '@/shared/components/shared/contacts';

export default function Home() {
  return (
    <Container className="flex flex-col gap-8 mt-12">
      <Post blockId={1} title="О нас" slug="about">
        <p className="text-2xl w-9/10 lg:w-3/5 text-center mx-auto">
          Бренд «УстА» — это место, где одежда становится искусством, — способом
          самовыражения. Мы создаём уникальные образы, вдохновлённые культурными
          корнями, разными эпохами, событиями прошедшего времени и
          современностью. Ведь мода это всегда отражение жизни и личности, не
          случайно народная мудрость гласит:- " По одежке встречают"... Здесь мы
          переосмысляем моду, соединяя прошлое и настоящее. Вдохновляйтесь
          вместе с нами и меняйте мир через стиль!
        </p>
      </Post>
      <Post blockId={2} title="Каталог" slug="catalog">
        <ProductList />
      </Post>
      <Post blockId={3} className="mb-4" title="Контакты" slug="contacts">
        <Contacts />
      </Post>
    </Container>
  );
}
