import { ReactNode } from 'react';

import { cn } from '@usta/ui/lib/utils';

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
}

export const LandingSection = ({ title, children, className }: Props) => {
  return (
    <section className={cn('flex flex-col gap-7', className)}>
      <h2 className="text-center text-4xl">{title}</h2>
      {children}
    </section>
  );
};
