import { act, renderHook } from '@testing-library/react';
import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useInput } from './useInput';

function makeRef(focus?: () => void): RefObject<HTMLInputElement> {
  return { current: focus ? ({ focus } as unknown as HTMLInputElement) : null };
}

const changeEvent = (value: string) =>
  ({ target: { value } }) as unknown as React.ChangeEvent<HTMLInputElement>;

describe('useInput', () => {
  it('seeds value from defaultValue (uncontrolled)', () => {
    const { result } = renderHook(() => useInput({ defaultValue: 'abc' }, makeRef()));
    expect(result.current.value).toBe('abc');
    expect(result.current.filled).toBe(true);
    expect(result.current.count).toBe(3);
  });

  it('updates value on change and calls onChange (uncontrolled)', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useInput({ defaultValue: '', onChange }, makeRef()));
    act(() => {
      result.current.inputProps.onChange(changeEvent('hello'));
    });
    expect(result.current.value).toBe('hello');
    expect(onChange).toHaveBeenCalledWith('hello', expect.anything());
  });

  it('is controlled: value prop wins over internal state', () => {
    const { result, rerender } = renderHook(({ value }) => useInput({ value }, makeRef()), {
      initialProps: { value: 'a' },
    });
    expect(result.current.value).toBe('a');
    act(() => {
      result.current.inputProps.onChange(changeEvent('b'));
    });
    // Controlled: internal change is ignored.
    expect(result.current.value).toBe('a');
    rerender({ value: 'c' });
    expect(result.current.value).toBe('c');
  });

  it('clear() empties value, fires onChange, and refocuses the input', () => {
    const focus = vi.fn();
    const onChange = vi.fn();
    const ref = makeRef(focus);
    const { result } = renderHook(() => useInput({ defaultValue: 'x', onChange }, ref));
    act(() => {
      result.current.clear();
    });
    expect(result.current.value).toBe('');
    expect(result.current.filled).toBe(false);
    expect(onChange).toHaveBeenCalledWith('');
    expect(focus).toHaveBeenCalled();
  });

  it('maps status="error" to aria-invalid', () => {
    const { result } = renderHook(() => useInput({ defaultValue: '', status: 'error' }, makeRef()));
    expect(result.current.inputProps['aria-invalid']).toBe(true);
  });

  it('leaves aria-invalid unset for non-error status', () => {
    const { result } = renderHook(() => useInput({ defaultValue: '', status: 'warning' }, makeRef()));
    expect(result.current.inputProps['aria-invalid']).toBeUndefined();
  });
});
