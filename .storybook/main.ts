import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'node:path';

const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
  ],
  docs: { autodocs: 'tag' },
  viteFinal: (cfg) => {
    cfg.css = {
      modules: { generateScopedName: '[name]_[local]_[hash:base64:3]' },
      preprocessorOptions: { less: { javascriptEnabled: true } },
    };
    cfg.resolve ||= {};
    cfg.resolve.alias = { ...cfg.resolve.alias, '@': resolve(process.cwd(), 'src') };
    return cfg;
  },
};

export default config;
