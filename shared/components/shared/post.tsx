import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

interface Props {
  title: string;
  slug: string;
  children: ReactNode;
  blockId: number;
  className?: string;
}

export const Post = ({ title, slug, children, className, blockId }: Props) => {
  return (
    <div
      id={slug}
      data-block-id={blockId}
      className={cn('flex flex-col gap-4', className)}
    >
      <h2 className="mx-auto text-4xl">{title}</h2>
      {children}
    </div>
  );
};
