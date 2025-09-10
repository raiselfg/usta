'use client';

import { cn } from '@/shared/lib/utils';
import { Container } from '../ui/container';
import { useBlockStore } from '@/shared/store/blocks';
import { Button } from '../ui/button';
import { useRef, useEffect } from 'react';
import Link from 'next/link';

const cats = [
  { id: 1, name: 'О нас', slug: 'about' },
  { id: 2, name: 'Каталог', slug: 'catalog' },
  { id: 3, name: 'Контакты', slug: 'contacts' },
];

export const Header = () => {
  const blockActiveId = useBlockStore((state) => state.activeId);
  const setActiveCategoryId = useBlockStore((state) => state.setActiveId);
  const headerRef = useRef<HTMLElement>(null);

  const handleScroll = (slug: string) => {
    const target = document.getElementById(slug);
    if (target && headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const extraOffset = 32;
      const elementPosition =
        target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - extraOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const blocks = document.querySelectorAll('[data-block-id]');
      let closestBlockId = 1;
      let minDistance = Infinity;

      blocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        const distance = Math.abs(rect.top - headerHeight);
        if (distance < minDistance) {
          minDistance = distance;
          closestBlockId = Number(block.getAttribute('data-block-id'));
        }
      });

      setActiveCategoryId(closestBlockId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveCategoryId]);

  return (
    <header ref={headerRef} className="top-6 sticky z-30">
      <Container className="py-2 px-4 h-auto flex flex-col sm:flex-row gap-6 items-center bg-red-900 w-max rounded-2xl text-background">
        <Link href={'/'}>
          <h1 className="text-4xl">УстА</h1>
        </Link>

        <section className="flex gap-1 text-xl">
          {cats.map(({ name, id, slug }) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() => handleScroll(slug)}
              className={cn(
                'transition-colors duration-250 hover:text-amber-600 text-xl',
                blockActiveId === id && 'text-amber-600'
              )}
            >
              {name}
            </Button>
          ))}
        </section>
      </Container>
    </header>
  );
};
