import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@usta/ui/components/button';

export const Route = createFileRoute('/dashboard/product-categories')({
  component: DashboardProductCategoriesContent,
});

function DashboardProductCategoriesContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Категории товаров</h1>
        <Button>Добавить категорию</Button>
      </div>
      <div className="bg-muted flex min-h-[400px] items-center justify-center rounded-xl">
        Здесь будет таблица категорий
      </div>
    </div>
  );
}
