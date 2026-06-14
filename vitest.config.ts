import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Self-contained Vitest config.
 *
 * It deliberately does NOT merge `vite.config.ts` (which is a callback form for
 * production CSS-module scoping, and `mergeConfig` cannot merge callbacks).
 * Test runs don't need library packaging — only React/JSX, the `@` alias, Less
 * token injection, and stable class names.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${resolve(__dirname, 'src/theme/variables.less')}";`,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    coverage: {
      include: ['src/components/**', 'src/core/**'],
      exclude: ['**/*.stories.*', '**/*.test.*'],
    },
  },
});
