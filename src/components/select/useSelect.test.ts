import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSelect } from './useSelect';
import type { SelectOption } from './types';

const options: SelectOption[] = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
];

const keyEvent = (key: string) => ({ key, preventDefault: () => {} }) as unknown as KeyboardEvent;
const clickEvent = () => ({}) as unknown as MouseEvent;

describe('useSelect', () => {
  it('opens on trigger click and closes again', () => {
    const { result } = renderHook(() => useSelect({ options }));
    expect(result.current.open).toBe(false);
    act(() => result.current.triggerProps.onClick(clickEvent()));
    expect(result.current.open).toBe(true);
    act(() => result.current.triggerProps.onClick(clickEvent()));
    expect(result.current.open).toBe(false);
  });

  it('ArrowDown moves highlight; Enter selects and closes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSelect({ options, onChange }));
    act(() => result.current.triggerProps.onClick(clickEvent()));
    act(() => result.current.triggerProps.onKeyDown(keyEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(0);
    act(() => result.current.triggerProps.onKeyDown(keyEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(1);
    act(() => result.current.triggerProps.onKeyDown(keyEvent('Enter')));
    expect(result.current.value).toBe('b');
    expect(result.current.selectedOption?.value).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b', expect.objectContaining({ value: 'b' }));
    expect(result.current.open).toBe(false);
  });

  it('Escape closes without selecting', () => {
    const { result } = renderHook(() => useSelect({ options }));
    act(() => result.current.triggerProps.onClick(clickEvent()));
    act(() => result.current.triggerProps.onKeyDown(keyEvent('Escape')));
    expect(result.current.open).toBe(false);
    expect(result.current.value).toBeUndefined();
  });

  it('ArrowDown wraps from last to first', () => {
    const { result } = renderHook(() => useSelect({ options }));
    act(() => result.current.triggerProps.onClick(clickEvent()));
    act(() => result.current.triggerProps.onKeyDown(keyEvent('End')));
    expect(result.current.highlightedIndex).toBe(2);
    act(() => result.current.triggerProps.onKeyDown(keyEvent('ArrowDown')));
    expect(result.current.highlightedIndex).toBe(0);
  });

  it('clear() empties the value and fires onChange(undefined)', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSelect({ options, defaultValue: 'a', onChange }));
    act(() => result.current.clear());
    expect(result.current.value).toBeUndefined();
    expect(onChange).toHaveBeenCalledWith(undefined, undefined);
  });

  it('enableSearch filters options by label', () => {
    const { result } = renderHook(() => useSelect({ options, enableSearch: true }));
    act(() => result.current.setSearchValue('ban'));
    expect(result.current.filteredOptions.map((o) => o.value)).toEqual(['b']);
  });

  it('controlled value wins and resolves selectedOption', () => {
    const { result } = renderHook(() => useSelect({ options, value: 'c' }));
    expect(result.current.value).toBe('c');
    expect(result.current.selectedOption?.value).toBe('c');
  });

  it('opening sets highlight to the currently-selected option', () => {
    const { result } = renderHook(() => useSelect({ options, defaultValue: 'b' }));
    act(() => result.current.triggerProps.onClick(clickEvent()));
    expect(result.current.highlightedIndex).toBe(1);
  });
});
