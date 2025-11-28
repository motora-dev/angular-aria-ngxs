import { baseConfig } from '@monorepo/eslint-config';

/**
 * ESLint configuration for NestJS server application.
 *
 * @type {import("eslint").Linter.Config}
 * */
export default [
  ...baseConfig,
  {
    ignores: ['*.config.cjs', '*.config.mjs'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index', 'object'], 'type'],
          pathGroups: [
            {
              pattern: '${domains,modules,shared}/**',
              group: 'internal',
            },
          ],
          alphabetize: { order: 'asc', caseInsensitive: true, orderImportKind: 'asc' },
          'newlines-between': 'always',
        },
      ],
    },
  },
];
