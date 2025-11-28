import 'reflect-metadata';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const swcPlugin = swc.vite({
  sourceMaps: true,
  jsc: {
    parser: {
      syntax: 'typescript',
      decorators: true,
      dynamicImport: true,
    },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
    },
    target: 'es2023',
    keepClassNames: true,
  },
  module: { type: 'es6' },
  minify: false,
});

const resolveAlias = {
  alias: {
    $domains: path.resolve(dirname, 'src/domains'),
    $shared: path.resolve(dirname, 'src/shared'),
  },
};

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [swcPlugin],
        resolve: resolveAlias,
        test: {
          name: 'unit',
          globals: true,
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        plugins: [swcPlugin],
        resolve: resolveAlias,
        test: {
          name: 'e2e',
          globals: true,
          environment: 'node',
          include: ['src/**/*.spec.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'json', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.dto.ts',
        'src/**/index.ts',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/main.ts',
        'src/**/*.module.ts',
      ],
    },
  },

  resolve: resolveAlias,
});
