import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';
import type { SelectOption } from './types';
import { renderWithPlatform } from '@/test/renderWithPlatform';

const options: SelectOption[] = [
  { label: 'Alpha', value: 'a' },
  { label: 'Bravo', value: 'b' },
];

describe('Select — adaptive rendering', () => {
  it('PC: opens a listbox on trigger click', () => {
    const { container } = renderWithPlatform(<Select options={options} placeholder="pick" />, 'pc');
    expect(container.querySelector('[data-lib-select="pc"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('PC: keyboard selects the first option', () => {
    const onChange = vi.fn();
    renderWithPlatform(
      <Select options={options} placeholder="pick" onChange={onChange} />,
      'pc',
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('a', expect.objectContaining({ value: 'a' }));
  });

  it('PC: Escape closes the listbox', () => {
    renderWithPlatform(<Select options={options} placeholder="pick" />, 'pc');
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('Mobile: opens a dialog (bottom sheet) on trigger click', () => {
    const { container } = renderWithPlatform(
      <Select options={options} placeholder="pick" />,
      'mobile',
    );
    expect(container.querySelector('[data-lib-select="mobile"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Mobile: tapping an option selects and dismisses the sheet', () => {
    const onChange = vi.fn();
    renderWithPlatform(
      <Select options={options} placeholder="pick" onChange={onChange} />,
      'mobile',
    );
    fireEvent.click(screen.getByRole('combobox'));
    const optionB = screen.getByText('Bravo').closest('[role="option"]');
    expect(optionB).not.toBeNull();
    fireEvent.mouseDown(optionB!);
    expect(onChange).toHaveBeenCalledWith('b', expect.objectContaining({ value: 'b' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('per-component platform prop overrides the provider', () => {
    const { container } = renderWithPlatform(
      <Select platform="mobile" options={options} placeholder="x" />,
      'pc',
    );
    expect(container.querySelector('[data-lib-select="mobile"]')).not.toBeNull();
    expect(container.querySelector('[data-lib-select="pc"]')).toBeNull();
  });
});
