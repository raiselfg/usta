import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  AWS_ENDPOINT: z.url(),
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY: z.string().min(1),
  AWS_SECRET_KEY: z.string().min(1),
  AWS_BUCKET: z.string().min(1),
  REVALIDATION_TOKEN: z.string().min(1),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      'Invalid environment variables:',
      z.treeifyError(parsed.error),
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

// Lazy-параметры: валидируем переменные окружения при первом обращении
// (во время запроса), а не на этапе сборки Next.js.
export const env = new Proxy({} as Env, {
  get(_target, prop) {
    if (!cached) cached = loadEnv();
    return cached[prop as keyof Env];
  },
});
