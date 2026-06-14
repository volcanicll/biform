import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import type { SelectOption } from './types';

const fruits: SelectOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '芒果', value: 'mango' },
  { label: '西瓜', value: 'watermelon' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Single-select with **one API, two UIs**. PC renders an anchored dropdown with full keyboard ' +
          'navigation; mobile renders a bottom-sheet picker. Open the panel in each frame to see both.',
      },
    },
  },
  args: { options: fruits, placeholder: '请选择水果' },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Basic: Story = {};

export const Clearable: Story = {
  args: { clearable: true, defaultValue: 'apple' },
};

export const DefaultValue: Story = {
  args: { defaultValue: 'banana' },
};

export const WithSearch: Story = {
  args: { enableSearch: true, searchPlaceholder: '搜索水果' },
};

export const MobileSheet: Story = {
  args: { mobile: { showDoneBar: true, title: '选择水果' } },
};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <Select options={fruits} status="error" placeholder="错误状态" />
      <Select options={fruits} status="warning" placeholder="警告状态" />
      <Select options={fruits} disabled placeholder="禁用状态" />
    </div>
  ),
};
