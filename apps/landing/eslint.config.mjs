import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  // 1. Глобальные игноры
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'public/**',
    'next-env.d.ts',
  ]),

  // 2. Конфиг Next.js (в него уже вшит jsx-a11y и react)
  ...nextVitals,

  // 3. Твои кастомные правила и плагины, которых нет в Next.js
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      // Регистрируем только то, чего НЕТ в стандартном конфиге Next
      perfectionist,
    },
    rules: {
      // Сортировка (perfectionist)
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          internalPattern: ['^@/.*'],
        },
      ],
      'perfectionist/sort-jsx-props': ['error', { type: 'natural' }],

      // Специфичные настройки
      'react/self-closing-comp': 'error',
      '@next/next/no-html-link-for-pages': 'error',

      // Мы НЕ добавляем jsx-a11y в plugins,
      // но можем переопределять его правила здесь, если нужно:
      // 'jsx-a11y/alt-text': 'error',
    },
  },

  // 4. Prettier (всегда последний)
  prettier,
);
