import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateProductFormSchema,
  type CreateProductFormDTO,
} from '@usta/types/products';
import { Button } from '@usta/ui/components/button';
import { Checkbox } from '@usta/ui/components/checkbox';
import {
  Dialog,
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
import { Upload, Loader2, CircleX } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';

import { products } from '@/products/lib/products';

import { productCategories } from '../lib/product-categories';

export const CreateProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
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
    setValue,
  } = useForm<CreateProductFormDTO>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
      product_category_id: '',
      file: undefined,
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue('file', file, { shouldValidate: true });
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif'] },
    maxFiles: 1,
    multiple: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateProductFormDTO) => {
      const imageUrl = await products.uploadImage(data.file);

      if (!imageUrl) {
        toast.error('Не удалось загрузить изображение');
        throw new Error('Не удалось загрузить изображение');
      }

      return products.createProduct({
        name: data.name,
        description: data.description,
        is_active: data.is_active,
        product_category_id: data.product_category_id,
        image: imageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleClose();
      toast.success('Товар успешно создан');
    },
    onError: () => toast.error('Ошибка при создании товара'),
  });

  const resetPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    resetPreview();
  };

  const onSubmit = (data: CreateProductFormDTO) => createMutation.mutate(data);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => (!val ? handleClose() : setIsOpen(true))}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Создать товар</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-110">
        <DialogHeader>
          <DialogTitle>Новый товар</DialogTitle>
          <DialogDescription>
            Добавьте новый товар заполнив форму.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-product-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 py-4"
        >
          <Field>
            <FieldLabel>Название</FieldLabel>
            <Input {...register('name')} />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field>
            <FieldLabel>Описание</FieldLabel>
            <Input {...register('description')} />
          </Field>

          <Field>
            <FieldLabel>Фото</FieldLabel>
            <div
              {...getRootProps()}
              className={`flex min-h-35 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all ${isDragActive ? 'border-primary bg-primary/5' : 'border-stone-800'} ${errors.file ? 'border-red-900' : 'hover:border-stone-700'} `}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-32 rounded object-contain"
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Перетащите фото сюда</p>
                </div>
              )}
            </div>
            {preview && (
              <Button
                variant={'destructive'}
                size={'icon'}
                className="flex items-center gap-2"
                type="button"
                onClick={resetPreview}
              >
                <span>Удалить изображение</span>
                <CircleX />
              </Button>
            )}
            {errors.file && (
              <p className="mt-1 text-xs text-red-500">
                {errors.file.message as string}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Категория</FieldLabel>
            <Controller
              control={control}
              name="product_category_id"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="flex items-center gap-2 rounded-lg p-3">
            <span className="text-sm font-medium">Отображать на сайте</span>
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
          </div>
        </form>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            type="submit"
            form="create-product-form"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
