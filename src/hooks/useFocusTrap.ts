import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Trap keyboard focus inside `containerRef` while `active` (WAI-ARIA dialog pattern):
 *  - focuses the first focusable element on activation,
 *  - cycles Tab / Shift+Tab within the container,
 *  - restores focus to the previously-focused element on deactivation (unless
 *    `restoreFocus` is false).
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  active = true,
  restoreFocus = true,
): void {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    // Defer initial focus a tick so children mount (e.g. overlay content).
    const raf = requestAnimationFrame(() => {
      getFocusables()[0]?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = getFocusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey) {
        if (first && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else if (last && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('keydown', onKeyDown);
      if (restoreFocus) previouslyFocused?.focus?.();
    };
  }, [active, containerRef, restoreFocus]);
}
