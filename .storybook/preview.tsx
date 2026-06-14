import type { Preview } from '@storybook/react';
import React, { ReactNode } from 'react';
import { PlatformProvider } from '../src/core/platform';
import { MobileFrame } from './MobileFrame';
import '../src/theme/runtime.css';

function Caption({ label, meta }: { label: string; meta: string }) {
  return (
    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{label}</span>
      <span style={{ fontSize: 11, color: '#6b7280' }}>{meta}</span>
    </div>
  );
}

function PcFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flex: '1 1 520px',
        minWidth: 0,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
        padding: 24,
        minHeight: 560,
        overflow: 'auto',
      }}
    >
      <PlatformProvider platform="pc">{children}</PlatformProvider>
    </div>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 32,
          background: '#f3f4f6',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 40,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '0 0 auto' }}>
            <Caption label="Mobile" meta="390 × 780 · iframe 模拟真机" />
            <MobileFrame>
              <Story />
            </MobileFrame>
          </div>
          <div style={{ flex: '1 1 520px', minWidth: 320 }}>
            <Caption label="PC" meta="桌面端 · auto" />
            <PcFrame>
              <Story />
            </PcFrame>
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { default: 'canvas', values: [{ name: 'canvas', value: '#f3f4f6' }] },
  },
};

export default preview;
