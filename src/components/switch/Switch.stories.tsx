import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: '通知' },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Basic: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch size="sm" label="Small" />
      <Switch size="md" label="Medium" />
      <Switch size="lg" label="Large" />
    </div>
  ),
};

function ControlledSwitch() {
  const [on, setOn] = useState(false);
  return <Switch checked={on} onChange={setOn} label={on ? '已开启' : '已关闭'} />;
}

export const Controlled: Story = {
  render: () => <ControlledSwitch />,
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch disabled label="禁用 - 关" />
      <Switch disabled defaultChecked label="禁用 - 开" />
    </div>
  ),
};
