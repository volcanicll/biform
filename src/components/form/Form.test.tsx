import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Form } from './Form';
import { Input } from '@/components/input';
import { Checkbox } from '@/components/checkbox';
import { renderWithPlatform } from '@/test/renderWithPlatform';

const renderRegistration = (onSubmit: ReturnType<typeof vi.fn>, platform: 'pc' | 'mobile') =>
  renderWithPlatform(
    <Form onSubmit={onSubmit}>
      <Form.Item name="name" label="姓名" rules={[{ required: true, message: '必填' }]}>
        <Input placeholder="输入姓名" />
      </Form.Item>
      <Form.Item name="agree" label="同意" rules={[{ required: true, message: '请勾选' }]}>
        <Checkbox />
      </Form.Item>
      <button type="submit">提交</button>
    </Form>,
    platform,
  );

describe('Form — validation + wiring', () => {
  it('PC: surfaces required errors on submit and blocks onSubmit', () => {
    const onSubmit = vi.fn();
    const { container } = renderRegistration(onSubmit, 'pc');
    expect(container.querySelector('[data-lib-form="pc"]')).not.toBeNull();
    fireEvent.click(screen.getByText('提交'));
    expect(screen.getAllByText('必填').length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('PC: fills values then submits successfully', () => {
    const onSubmit = vi.fn();
    renderRegistration(onSubmit, 'pc');
    fireEvent.change(screen.getByPlaceholderText('输入姓名'), { target: { value: '张三' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('提交'));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: '张三', agree: true }));
  });

  it('mobile: renders the mobile shell', () => {
    const { container } = renderRegistration(vi.fn(), 'mobile');
    expect(container.querySelector('[data-lib-form="mobile"]')).not.toBeNull();
  });

  it('Form.Item wires value/onChange into the control (typing updates state)', () => {
    const onSubmit = vi.fn();
    renderRegistration(onSubmit, 'pc');
    const input = screen.getByPlaceholderText('输入姓名') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '李四' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText('提交'));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: '李四' }));
  });
});
