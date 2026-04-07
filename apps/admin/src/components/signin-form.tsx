import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@usta/ui/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@usta/ui/components/field';
import { Input } from '@usta/ui/components/input';
import { Spinner } from '@usta/ui/components/spinner';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { errorMessages, signIn } from '@/lib/auth-client';
import { signInSchema, type signInSchemaType } from '@/schema/signin-shema';

export const SignInForm = () => {
  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(formData: signInSchemaType) {
    const { error } = await signIn.email({
      email: formData.email,
      password: formData.password,
      rememberMe: true,
      callbackURL: '/dashboard',
    });

    if (error) {
      const errorCode = error.code as keyof typeof errorMessages;
      const message =
        (error.code && errorMessages[errorCode]?.ru) || error.message;
      toast.error(message);
      return;
    }

    toast.success('Вы успешно вошли в систему');
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-col gap-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Почта</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@mail.ru"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="******"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting ? (
            <span>Войти</span>
          ) : (
            <div className="flex items-center gap-2">
              <Spinner />
              <span>Вход...</span>
            </div>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};
