import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useCheckbox } from './useCheckbox';

const keyEvent = (key: string) => ({ key, preventDefault: () => {} }) as unknown as KeyboardEvent;

describe('useCheckbox', () => {
  it('toggles on click (uncontrolled)', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCheckbox({ onChange }));
    expect(result.current.checked).toBe(false);
    act(() => result.current.rootProps.onClick());
    expect(result.current.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('reports aria-checked="mixed" when indeterminate', () => {
    const { result } = renderHook(() => useCheckbox({ indeterminate: true }));
    expect(result.current.rootProps['aria-checked']).toBe('mixed');
  });

  it('indeterminate resolves to checked on activation', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCheckbox({ indeterminate: true, onChange }));
    act(() => result.current.rootProps.onClick());
    expect(result.current.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCheckbox({ disabled: true, onChange }));
    act(() => result.current.rootProps.onClick());
    expect(result.current.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('toggles on Space and Enter', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCheckbox({ onChange }));
    act(() => result.current.rootProps.onKeyDown(keyEvent(' ')));
    expect(result.current.checked).toBe(true);
    act(() => result.current.rootProps.onKeyDown(keyEvent('Enter')));
    expect(result.current.checked).toBe(false);
  });

  it('is controlled: checked prop wins', () => {
    const { result, rerender } = renderHook(({ checked }) => useCheckbox({ checked }), {
      initialProps: { checked: false },
    });
    act(() => result.current.rootProps.onClick());
    expect(result.current.checked).toBe(false);
    rerender({ checked: true });
    expect(result.current.checked).toBe(true);
  });
});
