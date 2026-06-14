import { useEffect, useRef, type MutableRefObject } from 'react';

/**
 * Return a ref whose `.current` always holds the latest `value`.
 *
 * Consolidates the "keep the newest callback/value in a ref so a stable DOM
 * listener reads fresh data without re-subscribing" pattern used across the
 * portal hooks ({@link useEscapeKey}, {@link useClickOutside},
 * {@link useEventListener}) and the headless component hooks. The ref is
 * updated in a layout-less effect every commit, so reads from event handlers
 * fire with the most recent value while the listener itself subscribes once.
 */
export function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
