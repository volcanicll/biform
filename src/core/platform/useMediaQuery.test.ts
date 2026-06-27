import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';
import { setViewportMatch } from '@/test/setup';

const MOBILE_QUERY = '(max-width: 767px)';

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Reset to PC (no match) before each case for deterministic isolation.
    setViewportMatch(null, MOBILE_QUERY);
  });

  it('returns false when there is no match', () => {
    const { result } = renderHook(() => useMediaQuery(MOBILE_QUERY));
    expect(result.current).toBe(false);
  });

  it('reads the real match on the first client render (no false placeholder)', () => {
    setViewportMatch(true, MOBILE_QUERY);
    const { result } = renderHook(() => useMediaQuery(MOBILE_QUERY));
    expect(result.current).toBe(true);
  });

  it('re-renders when the match changes', () => {
    const { result } = renderHook(() => useMediaQuery(MOBILE_QUERY));
    expect(result.current).toBe(false);

    act(() => setViewportMatch(true, MOBILE_QUERY));
    expect(result.current).toBe(true);

    act(() => setViewportMatch(false, MOBILE_QUERY));
    expect(result.current).toBe(false);
  });

  it('tracks independent queries separately', () => {
    const DESKTOP_QUERY = '(min-width: 1024px)';
    setViewportMatch(true, DESKTOP_QUERY);

    const { result: mobile } = renderHook(() => useMediaQuery(MOBILE_QUERY));
    const { result: desktop } = renderHook(() => useMediaQuery(DESKTOP_QUERY));

    expect(mobile.current).toBe(false);
    expect(desktop.current).toBe(true);
  });

  it('unsubscribes on unmount (no listener leak)', () => {
    const { result, unmount } = renderHook(() => useMediaQuery(MOBILE_QUERY));
    unmount();
    // Emitting after unmount must not throw or affect the torn-down hook.
    expect(() => act(() => setViewportMatch(true, MOBILE_QUERY))).not.toThrow();
    expect(result.current).toBe(false);
  });
});
