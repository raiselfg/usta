import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  // 1. Игнорируем папки сборки
  {
    ignores: ['dist', 'node_modules', '.vite', 'coverage', 'build'],
  },

  // 2. Базовые правила JavaScript (всегда стабильны)
  js.configs.recommended,

  // 3. Настройка для самого нового TypeScript и React
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node, // Чтобы не ругался на __dirname в конфигах
      },
      parser: tseslint.parser,
      parserOptions: {
        // Указываем пути к твоим tsconfig
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      // Подключаем плагины как объекты, чтобы избежать ошибок импорта
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      'jsx-a11y': jsxA11y,
      perfectionist,
    },
    rules: {
      // --- TypeScript: используем только безопасные правила ---
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',

      // ФИКС: Мы НЕ включаем @typescript-eslint/no-unused-expressions, так как оно падает на TS 5.9.
      // Используем стандартное правило ESLint вместо него:
      'no-unused-expressions': 'off',
      'no-undef': 'off', // В TS проектах это правило не нужно (TS сам всё проверит)

      // --- React 17+ (Modern JSX) ---
      ...reactHooks.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off', // Убирает ошибку "React must be in scope"
      'react/self-closing-comp': 'error',

      // --- Доступность и Сортировка ---
      ...jsxA11y.flatConfigs.recommended.rules,
      'perfectionist/sort-imports': ['error', { type: 'natural' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // 4. Prettier — всегда последний, чтобы подавить конфликты форматирования
  prettier,
);
