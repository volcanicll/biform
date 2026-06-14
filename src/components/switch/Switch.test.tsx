import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';
import { renderWithPlatform } from '@/test/renderWithPlatform';

describe('Switch — adaptive rendering', () => {
  it('renders the PC presentation under a pc provider', () => {
    const { container } = renderWithPlatform(<Switch ariaLabel="notify" />, 'pc');
    expect(container.querySelector('[data-lib-switch="pc"]')).not.toBeNull();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders the mobile presentation under a mobile provider', () => {
    const { container } = renderWithPlatform(<Switch ariaLabel="notify" />, 'mobile');
    expect(container.querySelector('[data-lib-switch="mobile"]')).not.toBeNull();
  });

  it('toggles on click', () => {
    const onChange = vi.fn();
    renderWithPlatform(<Switch onChange={onChange} />, 'pc');
    const sw = screen.getByRole('switch');
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles on Space key', () => {
    const onChange = vi.fn();
    renderWithPlatform(<Switch onChange={onChange} />, 'pc');
    const sw = screen.getByRole('switch');
    fireEvent.keyDown(sw, { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('per-component platform prop overrides the provider', () => {
    const { container } = renderWithPlatform(<Switch platform="mobile" ariaLabel="x" />, 'pc');
    expect(container.querySelector('[data-lib-switch="mobile"]')).not.toBeNull();
    expect(container.querySelector('[data-lib-switch="pc"]')).toBeNull();
  });

  it('does not toggle when disabled', () => {
    const onChange = vi.fn();
    renderWithPlatform(<Switch disabled onChange={onChange} />, 'pc');
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
