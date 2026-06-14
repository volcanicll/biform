import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { PlatformProvider } from '@/core/platform';
import type { Platform } from '@/core/platform';

/**
 * Render a component under a forced-platform PlatformProvider so component tests
 * can assert both the PC and mobile presentations deterministically.
 */
export function renderWithPlatform(
  ui: ReactElement,
  platform: Platform,
  options?: RenderOptions,
) {
  return render(ui, {
    wrapper: ({ children }) => <PlatformProvider platform={platform}>{children}</PlatformProvider>,
    ...options,
  });
}
