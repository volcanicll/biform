import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';
import { renderWithPlatform } from '@/test/renderWithPlatform';

describe('Input — adaptive rendering', () => {
  it('renders the PC presentation under a pc provider', () => {
    const { container } = renderWithPlatform(<Input placeholder="pc hint" />, 'pc');
    expect(screen.getByPlaceholderText('pc hint')).toBeInTheDocument();
    expect(container.querySelector('[data-lib-input="pc"]')).not.toBeNull();
  });

  it('renders the mobile presentation under a mobile provider', () => {
    const { container } = renderWithPlatform(<Input placeholder="mobile hint" />, 'mobile');
    expect(screen.getByPlaceholderText('mobile hint')).toBeInTheDocument();
    expect(container.querySelector('[data-lib-input="mobile"]')).not.toBeNull();
  });

  it('per-component platform prop overrides the provider', () => {
    const { container } = renderWithPlatform(
      <Input platform="mobile" placeholder="forced" />,
      'pc',
    );
    expect(container.querySelector('[data-lib-input="mobile"]')).not.toBeNull();
    expect(container.querySelector('[data-lib-input="pc"]')).toBeNull();
  });

  it('fires onChange with the new value', () => {
    const onChange = vi.fn();
    renderWithPlatform(<Input placeholder="t" onChange={onChange} />, 'pc');
    fireEvent.change(screen.getByPlaceholderText('t'), { target: { value: 'hi' } });
    expect(onChange).toHaveBeenCalledWith('hi', expect.anything());
  });

  it('shows a clear button when clearable and filled', () => {
    renderWithPlatform(<Input clearable defaultValue="abc" />, 'pc');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('hides the clear button when empty', () => {
    renderWithPlatform(<Input clearable defaultValue="" />, 'pc');
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });
});
