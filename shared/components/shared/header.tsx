import { cn } from '@/shared/lib/utils';
import { Container } from '../ui/container';

const cats = [
  { id: 1, name: 'О нас' },
  { id: 2, name: 'Каталог' },
  { id: 3, name: 'Контакты' },
];

export const Header = () => {
  return (
    <header className="top-6 sticky z-30">
      <Container className="py-2 px-4 h-auto flex flex-col sm:flex-row gap-6 items-center bg-red-900 w-max rounded-2xl text-background">
        <h1 className="text-4xl cursor-pointer">УстА</h1>
        <section className="flex gap-3 text-xl">
          {cats.map(({ name, id }, index) => (
            <p
              key={index}
              className={cn(
                'cursor-pointer transition-colors duration-250 hover:text-amber-600'
              )}
            >
              {name}
            </p>
          ))}
        </section>
      </Container>
    </header>
  );
};
