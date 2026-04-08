import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndexContent,
});

function DashboardIndexContent() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Главная панель</h1>
      <div className="grid grid-cols-3 gap-4">
        <Link
          to="/dashboard/products"
          className="bg-muted flex min-h-[100px] items-center justify-center rounded-xl"
        >
          Товары
        </Link>
        <Link
          to="/dashboard/categories"
          className="bg-muted flex min-h-[100px] items-center justify-center rounded-xl"
        >
          Категории
        </Link>
      </div>
    </div>
  );
}
