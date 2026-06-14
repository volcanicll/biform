import { useEffect } from 'react';

/**
 * Lock body scroll while `active`, compensating for scrollbar width to avoid
 * layout shift. Restores prior styles on cleanup.
 */
export function useScrollLock(active = true): void {
  useEffect(() => {
    if (!active) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}
