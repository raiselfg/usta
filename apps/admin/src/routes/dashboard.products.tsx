import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@usta/ui/components/button';

export const Route = createFileRoute('/dashboard/products')({
  component: DashboardProductsContent,
});

function DashboardProductsContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Button>Добавить товар</Button>
      </div>

      <div className="bg-muted flex min-h-[400px] items-center justify-center rounded-xl">
        Здесь будет таблица товаров
      </div>
    </div>
  );
}
