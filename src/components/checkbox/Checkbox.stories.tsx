import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: '我已阅读并同意服务条款' },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Indeterminate: Story = {
  args: { indeterminate: true, label: '部分选中（不确定态）' },
};

export const WithDescription: Story = {
  args: {
    label: '接收营销邮件',
    description: '我们将偶尔发送产品更新与优惠信息，可随时取消订阅。',
  },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="选项 A" defaultChecked />
      <Checkbox label="选项 B" />
      <Checkbox label="选项 C" />
      <Checkbox label="禁用项" disabled />
      <Checkbox label="禁用且选中" disabled defaultChecked />
    </div>
  ),
};
