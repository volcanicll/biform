import type { Preview } from '@storybook/react';
import React, { ReactNode } from 'react';
import { PlatformProvider } from '../src/core/platform';
import '../src/theme/runtime.css';

/**
 * DualViewport decorator.
 *
 * Renders every story twice, side by side: a mobile frame (forced `mobile`)
 * and a PC frame (forced `pc`). This is the primary visual verification surface
 * for the "one API, two UIs" architecture — the same story props produce two
 * structurally different UIs.
 */
function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 390,
        height: 720,
        border: '8px solid #111827',
        borderRadius: 32,
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'top',
        background: '#f5f5f5',
      }}
    >
      <PlatformProvider platform="mobile">
        <div style={{ padding: 12, height: '100%', overflow: 'auto' }}>{children}</div>
      </PlatformProvider>
    </div>
  );
}

function PcFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 800,
        minHeight: 600,
        display: 'inline-block',
        verticalAlign: 'top',
        padding: 16,
        background: '#ffffff',
      }}
    >
      <PlatformProvider platform="pc">{children}</PlatformProvider>
    </div>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <MobileFrame>
          <Story />
        </MobileFrame>
        <PcFrame>
          <Story />
        </PcFrame>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
