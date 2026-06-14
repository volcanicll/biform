import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';
import { renderWithPlatform } from '@/test/renderWithPlatform';

describe('Checkbox — adaptive rendering', () => {
  it('renders the PC presentation under a pc provider', () => {
    const { container } = renderWithPlatform(<Checkbox ariaLabel="agree" />, 'pc');
    expect(container.querySelector('[data-lib-checkbox="pc"]')).not.toBeNull();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders the mobile presentation under a mobile provider', () => {
    const { container } = renderWithPlatform(<Checkbox ariaLabel="agree" />, 'mobile');
    expect(container.querySelector('[data-lib-checkbox="mobile"]')).not.toBeNull();
  });

  it('toggles on click and updates aria-checked', () => {
    const onChange = vi.fn();
    renderWithPlatform(<Checkbox onChange={onChange} />, 'pc');
    const cb = screen.getByRole('checkbox');
    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(cb).toHaveAttribute('aria-checked', 'true');
  });

  it('shows aria-checked="mixed" when indeterminate', () => {
    renderWithPlatform(<Checkbox indeterminate ariaLabel="x" />, 'pc');
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('per-component platform prop overrides the provider', () => {
    const { container } = renderWithPlatform(<Checkbox platform="mobile" ariaLabel="x" />, 'pc');
    expect(container.querySelector('[data-lib-checkbox="mobile"]')).not.toBeNull();
    expect(container.querySelector('[data-lib-checkbox="pc"]')).toBeNull();
  });
});
