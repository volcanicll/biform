import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Switch } from '@/components/switch';
import { Checkbox } from '@/components/checkbox';

const fruits = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
];

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form orchestration with validation — **one API, two layouts**. PC lays fields out horizontally ' +
          '(label column + control); mobile stacks them vertically with larger spacing. Submit empty to see errors.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

const RegistrationForm = (
  <Form
    initialValues={{ fruit: 'apple' }}
    onSubmit={(values) => window.alert(JSON.stringify(values))}
  >
    <Form.Item
      name="email"
      label="邮箱"
      rules={[{ required: true, message: '请输入邮箱' }, { pattern: /@/, message: '邮箱格式不正确' }]}
    >
      <Input placeholder="you@example.com" />
    </Form.Item>
    <Form.Item
      name="password"
      label="密码"
      rules={[{ required: true }, { min: 6, message: '至少 6 位' }]}
    >
      <Input placeholder="至少 6 位" />
    </Form.Item>
    <Form.Item name="fruit" label="喜好" rules={[{ required: true, message: '请选择' }]}>
      <Select options={fruits} placeholder="选择水果" />
    </Form.Item>
    <Form.Item name="subscribe" label="订阅">
      <Switch />
    </Form.Item>
    <Form.Item name="agree" label="同意条款" rules={[{ required: true, message: '请同意条款' }]}>
      <Checkbox />
    </Form.Item>
    <Form.Item name="submit">
      <button type="submit" style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        提交
      </button>
    </Form.Item>
  </Form>
);

export const Registration: Story = {
  render: () => RegistrationForm,
};

export const VerticalLayout: Story = {
  render: () => <Form layout="vertical" onSubmit={() => {}}>{RegistrationForm.props.children}</Form>,
};

export const InlineLayout: Story = {
  render: () => (
    <Form layout="inline" onSubmit={() => {}}>
      <Form.Item name="q" label="搜索">
        <Input placeholder="关键词" />
      </Form.Item>
      <Form.Item name="submit">
        <button type="submit">搜索</button>
      </Form.Item>
    </Form>
  ),
};
