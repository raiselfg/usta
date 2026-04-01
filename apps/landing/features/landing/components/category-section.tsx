import { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

export const CategorySection = ({ label, children }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-center text-3xl">{label}</h3>
      {children}
    </div>
  );
};
