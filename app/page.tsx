import { Post } from '@/shared/components/shared/post';
import { ProductList } from '@/shared/components/shared/product-list';
import { Container } from '@/shared/components/ui/container';

export default function Home() {
  return (
    <Container className="flex flex-col gap-8 mt-12">
      <Post title={'О нас'}>
        <p className="text-2xl max-w-[900px] w-auto text-center mx-auto">
          Бренд «УстА» — это место, где одежда становится искусством, — способом
          самовыражения. Мы создаём уникальные образы, вдохновлённые культурными
          корнями, разными эпохами, событиями прошедшего времени и
          современностью. Ведь мода это всегда отражение жизни и личности, не
          случайно народная мудрость гласит:- " По одежке встречают"... Здесь мы
          переосмысляем моду, соединяя прошлое и настоящее. Вдохновляйтесь
          вместе с нами и меняйте мир через стиль!
        </p>
      </Post>
      <Post title="Каталог">
        <ProductList />
      </Post>
      <Post title="Контакты">вк</Post>
    </Container>
  );
}
