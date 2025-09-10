import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: Props) => {
  return (
    <div className={cn('max-w-7xl mx-auto w-full', className)}>{children}</div>
  );
};
