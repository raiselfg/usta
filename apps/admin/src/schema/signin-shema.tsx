import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Введите пароль длиной не менее 6 символов'),
});

export type signInSchemaType = z.infer<typeof signInSchema>;
