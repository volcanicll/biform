import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSwitch } from './useSwitch';

const keyEvent = (key: string) => ({ key, preventDefault: () => {} }) as unknown as KeyboardEvent;

describe('useSwitch', () => {
  it('toggles on click (uncontrolled)', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSwitch({ onChange }));
    expect(result.current.checked).toBe(false);
    act(() => result.current.rootProps.onClick());
    expect(result.current.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('seeds from defaultChecked', () => {
    const { result } = renderHook(() => useSwitch({ defaultChecked: true }));
    expect(result.current.checked).toBe(true);
  });

  it('is controlled: checked prop wins', () => {
    const { result, rerender } = renderHook(({ checked }) => useSwitch({ checked }), {
      initialProps: { checked: false },
    });
    act(() => result.current.rootProps.onClick());
    expect(result.current.checked).toBe(false);
    rerender({ checked: true });
    expect(result.current.checked).toBe(true);
  });

  it('does not toggle when disabled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSwitch({ disabled: true, onChange }));
    act(() => result.current.rootProps.onClick());
    expect(result.current.checked).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.rootProps.tabIndex).toBe(-1);
  });

  it('toggles on Space and Enter', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSwitch({ onChange }));
    act(() => result.current.rootProps.onKeyDown(keyEvent(' ')));
    expect(result.current.checked).toBe(true);
    act(() => result.current.rootProps.onKeyDown(keyEvent('Enter')));
    expect(result.current.checked).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('exposes role=switch and aria-checked', () => {
    const { result } = renderHook(() => useSwitch({ defaultChecked: true }));
    expect(result.current.rootProps.role).toBe('switch');
    expect(result.current.rootProps['aria-checked']).toBe(true);
  });
});
