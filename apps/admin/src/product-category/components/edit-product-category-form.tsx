import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UpdateProductCategorySchema,
  type ProductCategoryWithProducts,
  type UpdateProductCategoryDTO,
} from '@usta/types/product-categories.js';
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
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { categoryQueries } from '@/shared/lib/query-options';

import { productCategories } from '../lib/product-categories';

interface Props {
  category: ProductCategoryWithProducts;
}

export const EditProductCategoryForm = ({ category }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateProductCategoryDTO>({
    resolver: zodResolver(UpdateProductCategorySchema),
    defaultValues: {
      name: category.name,
      is_active: category.is_active,
      color: category.color,
    },
    mode: 'all',
  });

  const selectedColor = watch('color');

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductCategoryDTO) =>
      productCategories.updateCategory(category.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.all });
      setIsOpen(false);
      toast.success('Категория успешно обновлена');
    },
    onError: () => {
      toast.error('Ошибка при обновлении категории');
    },
  });

  const onSubmit = (data: UpdateProductCategoryDTO) => {
    updateMutation.mutate(data);
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button variant='outline'>
          <SquarePen /> Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogDescription>
            Внесите изменения в данные категории. Нажмите сохранить, когда
            закончите.
          </DialogDescription>
        </DialogHeader>
        <form
          id='edit-product-category-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5 py-4'
        >
          <Field>
            <FieldLabel htmlFor='edit-product-category-name'>
              Название
            </FieldLabel>
            <Input
              id='edit-product-category-name'
              type='text'
              placeholder='Категория 1'
              required
              {...register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field orientation='horizontal'>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='edit-product-category-is_active'>
                Отображать на сайте
              </FieldLabel>
              <Controller
                control={control}
                name='is_active'
                render={({ field }) => (
                  <Checkbox
                    id='edit-product-category-is_active'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor='edit-product-category-color'>Цвет</FieldLabel>

            <div className='flex w-full flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <input
                  type='color'
                  id='edit-product-category-color-picker'
                  value={selectedColor?.toUpperCase() || '#000000'}
                  className='border-input h-10 w-10 cursor-pointer rounded border bg-transparent p-0'
                  onChange={e => {
                    setValue('color', e.target.value.toUpperCase(), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />

                <Input
                  id='edit-product-category-color'
                  type='text'
                  placeholder='#FFFFFF'
                  maxLength={7}
                  required
                  className='w-30'
                  {...register('color', {
                    required: 'Это поле обязательно',

                    onChange: e => {
                      setValue('color', e.target.value.toUpperCase(), {
                        shouldValidate: true,
                      });
                    },
                  })}
                />
              </div>

              {errors.color && <FieldError errors={[errors.color]} />}
            </div>
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Отмена</Button>
          </DialogClose>
          <Button
            type='submit'
            form='edit-product-category-form'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
