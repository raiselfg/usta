import { Post } from '@/shared/components/shared/post';
import { Product, ProductList } from '@/shared/components/shared/product-list';
import { Container } from '@/shared/components/ui/container';
import Contacts from '@/shared/components/shared/contacts';
import Header from '@/shared/components/shared/header';
import productsData from '@/shared/data/products.json';
import hatsData from '@/shared/data/hats.json';
import blousesData from '@/shared/data/blouses.json';

const products: Product[] = productsData;
const hats: Product[] = hatsData;
const blouses: Product[] = blousesData;

export default function Home() {
  const description: string = `Бренд «УстА» — это место, где одежда становится искусством, —
            способом самовыражения. Мы создаём уникальные образы, вдохновлённые
            культурными корнями, разными эпохами, событиями прошедшего времени и
            современностью. Ведь мода это всегда отражение жизни и личности, не
            случайно народная мудрость гласит:- " По одежке встречают"... Здесь
            мы переосмысляем моду, соединяя прошлое и настоящее. Вдохновляйтесь
            вместе с нами и меняйте мир через стиль!`;
  const label: string = `Одежда "коллекция Свадебка"`;

  return (
    <>
      <Header />
      <Container className="flex flex-col gap-8 mt-3 px-3 lg:px-4 xl:px-0 text-stone-300">
        <Post title="О нас">
          <p className="text-2xl w-9/10 lg:w-3/5 text-center mx-auto ">
            {description}
          </p>
        </Post>
        <Post title="Каталог">
          <div className="flex flex-col gap-3">
            <h3 className="text-center text-3xl">{label}</h3>
            <ProductList products={products} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-center text-3xl">Блузки</h3>
            <ProductList products={blouses} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-center text-3xl">Головные уборы</h3>
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
