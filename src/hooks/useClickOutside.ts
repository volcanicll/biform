import { useEffect, useRef, type RefObject } from 'react';

/**
 * Fire `handler` on a pointer-down that lands outside all `refs`.
 *
 * Caller should pass a stable `refs` array (memoized) so listeners aren't
 * re-attached each render. Used by {@link Overlay} and popovers.
 */
export function useClickOutside(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  handler: (event: MouseEvent | TouchEvent) => void,
  active = true,
): void {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!active) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      handlerRef.current(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [active, refs]);
}
