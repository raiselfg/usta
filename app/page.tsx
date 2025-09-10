import { Post } from '@/shared/components/shared/post';
import { Product, ProductList } from '@/shared/components/shared/product-list';
import { Container } from '@/shared/components/ui/container';
import Contacts from '@/shared/components/shared/contacts';
import Header from '@/shared/components/shared/header';

const products: Product[] = require('@/shared/data/products.json');
const hats: Product[] = require('@/shared/data/hats.json');

export default function Home() {
  return (
    <>
      <Header />
      <Container className="flex flex-col gap-8 mt-3 px-3 lg:px-4 xl:px-0">
        <Post title="О нас">
          <p className="text-2xl w-9/10 lg:w-3/5 text-center mx-auto">
            Бренд «УстА» — это место, где одежда становится искусством, —
            способом самовыражения. Мы создаём уникальные образы, вдохновлённые
            культурными корнями, разными эпохами, событиями прошедшего времени и
            современностью. Ведь мода это всегда отражение жизни и личности, не
            случайно народная мудрость гласит:- " По одежке встречают"... Здесь
            мы переосмысляем моду, соединяя прошлое и настоящее. Вдохновляйтесь
            вместе с нами и меняйте мир через стиль!
          </p>
        </Post>
        <Post title="Каталог">
          <div className="flex flex-col gap-3">
            <h3 className="text-center text-2xl">Одежда</h3>
            <ProductList products={products} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-center text-2xl">Шапки</h3>
            <ProductList products={hats} />
          </div>
        </Post>
        <Post className="mb-4" title="Контакты">
          <Contacts />
        </Post>
      </Container>
    </>
  );
}
