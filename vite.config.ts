import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { globSync } from 'glob';

/**
 * Multi-entry library build.
 *
 * Each component folder (`src/components/<name>/index.ts`) is its own entry so
 * subpath exports (`common-component/select`, etc.) resolve to a real file in
 * `dist/`. `preserveModules` keeps the dist tree mirroring `src/` — that is what
 * makes per-component subpath imports + tree-shaking work without manual chunking.
 *
 * Two output configs (es + cjs) emit `.js` and `.cjs` side by side for every module.
 */
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  ...Object.fromEntries(
    // Keep the trailing `/index` so the entry chunk lands at `dist/components/<name>/index.{js,cjs}`,
    // matching the per-file `.d.ts` produced by vite-plugin-dts (which mirrors `src/`).
    globSync('src/components/*/index.ts').map((f) => [
      f.replace(/^src\//, '').replace(/\.ts$/, ''),
      resolve(__dirname, f),
    ]),
  ),
  'core/platform/index': resolve(__dirname, 'src/core/platform/index.ts'),
};

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      outDir: 'dist',
      // Keep per-file `.d.ts` (mirroring src) so subpath exports have typed resolution.
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],
  css: {
    modules: {
      // Short hashed names in production builds; readable names during dev / storybook.
      generateScopedName:
        command === 'build' ? 'r_[hash:base64:5]' : '[name]_[local]_[hash:base64:3]',
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      less: {
        // Required for theme variable resolution / mixins using JS.
        javascriptEnabled: true,
        // Inject design tokens into every Less module so authors can use `@lib-*` vars freely.
        additionalData: `@import "${resolve(__dirname, 'src/theme/variables.less')}";`,
      },
    },
  },
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  build: {
    lib: { entry: entries },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: [
        {
          format: 'es',
          dir: 'dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
          assetFileNames: 'radiant.[ext]',
        },
        {
          format: 'cjs',
          dir: 'dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          assetFileNames: 'radiant.[ext]',
        },
      ],
    },
    sourcemap: true,
  },
}));
