import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UpdateProductBodySchema,
  type ProductWithProductCategory,
  type UpdateProductDTO,
} from '@usta/types/products';
import { Button } from '@usta/ui/components/button';
import { Checkbox } from '@usta/ui/components/checkbox';
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
import { Field, FieldError, FieldLabel } from '@usta/ui/components/field';
import { Input } from '@usta/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@usta/ui/components/select';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { productCategories } from '@/products/lib/product-categories';
import { products } from '@/products/lib/products';

interface Props {
  product: ProductWithProductCategory;
}

export const EditProductForm = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productCategories.getCategories(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateProductDTO>({
    resolver: zodResolver(UpdateProductBodySchema),
    defaultValues: {
      name: product.name || '',
      description: product.description,
      is_active: product.is_active,
      product_category_id: product.product_category_id,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductDTO) =>
      products.updateProduct(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsOpen(false);
      toast.success('Товар успешно обновлен');
    },
    onError: () => {
      toast.error('Ошибка при обновлении товара');
    },
  });

  const onSubmit = (data: UpdateProductDTO) => {
    updateMutation.mutate(data);
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Редактировать</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
          <DialogDescription>
            Внесите изменения в данные товара. Нажмите сохранить, когда
            закончите.
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-product-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <Field>
            <FieldLabel>Название</FieldLabel>
            <Input {...register('name')} />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field>
            <FieldLabel>Описание</FieldLabel>
            <Input {...register('description')} />
            {errors.description && <FieldError errors={[errors.description]} />}
          </Field>

          <Field>
            <FieldLabel>Категория</FieldLabel>
            <Controller
              control={control}
              name="product_category_id"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.product_category_id && (
              <FieldError errors={[errors.product_category_id]} />
            )}
          </Field>

          <Field
            orientation="horizontal"
            className="items-center justify-between"
          >
            <FieldLabel>Активен</FieldLabel>
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button
            type="submit"
            form="edit-product-form"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
