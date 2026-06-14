import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Text input with **one API, two UIs**. The same `<Input>` renders a compact 32px PC field ' +
          'on the right and a 44px mobile field on the left (see the dual-viewport decorator). ' +
          'Platform is auto-detected; set `platform` to force one.',
      },
    },
  },
  args: { placeholder: '请输入内容' },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Basic: Story = {};

export const Clearable: Story = {
  args: { clearable: true, defaultValue: '可清除的内容' },
};

export const WithCount: Story = {
  args: { showCount: true, maxLength: 20, defaultValue: '计数演示' },
};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <Input status="error" defaultValue="错误状态" />
      <Input status="warning" defaultValue="警告状态" />
      <Input disabled defaultValue="禁用状态" />
      <Input readOnly defaultValue="只读状态" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <Input size="sm" placeholder="small" />
      <Input size="md" placeholder="medium" />
      <Input size="lg" placeholder="large" />
    </div>
  ),
};

function ControlledInput() {
  const [value, setValue] = useState('hello');
  return <Input value={value} onChange={setValue} clearable />;
}

export const Controlled: Story = {
  render: () => <ControlledInput />,
};

export const MobileKeyboard: Story = {
  args: { placeholder: '邮箱', mobile: { keyboardType: 'email', returnKeyType: 'done' } },
};
