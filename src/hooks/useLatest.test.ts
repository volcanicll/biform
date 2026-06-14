import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLatest } from './useLatest';

describe('useLatest', () => {
  it('initializes with the first value', () => {
    const { result } = renderHook(() => useLatest('a'));
    expect(result.current.current).toBe('a');
  });

  it('updates the ref to the latest value after each render', () => {
    const { result, rerender } = renderHook(({ val }) => useLatest(val), {
      initialProps: { val: 1 },
    });
    expect(result.current.current).toBe(1);
    rerender({ val: 2 });
    expect(result.current.current).toBe(2);
    rerender({ val: 3 });
    expect(result.current.current).toBe(3);
  });

  it('keeps a stable ref identity across renders', () => {
    const { result, rerender } = renderHook(({ val }) => useLatest(val), {
      initialProps: { val: 1 },
    });
    const first = result.current;
    rerender({ val: 2 });
    expect(result.current).toBe(first);
  });

  it('handles object values by reference', () => {
    const a = { x: 1 };
    const b = { x: 2 };
    const { result, rerender } = renderHook(({ val }) => useLatest(val), {
      initialProps: { val: a },
    });
    expect(result.current.current).toBe(a);
    rerender({ val: b });
    expect(result.current.current).toBe(b);
  });
});
