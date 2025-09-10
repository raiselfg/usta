import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
}

export const Post = ({ title, children, className }: Props) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <h2 className="mx-auto text-4xl">{title}</h2>
      {children}
    </div>
  );
};
