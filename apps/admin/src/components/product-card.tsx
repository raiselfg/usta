import type { Product } from '@usta/database';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@usta/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@usta/ui/components/dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { products } from '@/lib/products';

export const ProductCard = ({ product }: { product: Product }) => {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => products.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      setIsOpenDelete(false);
      toast.success('Товар успешно удален');
    },
    onError: () => {
      toast.error('Ошибка при удалении товара');
    },
  });

  // const editMutation = useMutation({
  //   mutationFn: (data: Partial<Product>) =>
  //     products.updateProduct(product.id, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['products'] });
  //     setIsOpenEdit(false);
  //     toast.success('Товар успешно обновлен');
  //   },
  //   onError: () => {
  //     toast.error('Ошибка при обновлении товара');
  //   },
  // });

  return (
    <div
      key={product.id}
      className="flex flex-col items-center justify-center gap-1 overflow-hidden"
    >
      <img
        src={product.image}
        alt={product.name || 'Товар'}
        className="h-64 w-48 object-cover"
      />
      <span className="text-lg font-bold">{product.name}</span>
      <div className="flex w-full max-w-48 items-center justify-between">
        <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <DialogTrigger asChild>
            <Button variant={'outline'}>Редактировать</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Форма редактирования товара</DialogTitle>
              <DialogDescription>
                Заполните поля ниже для изменения данных о товаре
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex items-center justify-between">
              <DialogClose>
                <Button variant={'outline'}>Отмена</Button>
              </DialogClose>

              <Button>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
          <DialogTrigger asChild>
            <Button variant={'destructive'} size={'icon'}>
              <Trash2 />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Вы уверены что хотите удалить этот товар?
              </DialogTitle>
              <DialogDescription>
                Это действие необратимо. Оно приведет к безвозвратному удалению
                данного продукта и данных с сервера.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex items-center justify-between">
              <DialogClose>
                <Button variant={'outline'}>Отмена</Button>
              </DialogClose>

              <Button
                variant={'destructive'}
                onClick={() => deleteMutation.mutate(product.id)}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
