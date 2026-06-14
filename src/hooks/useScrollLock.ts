import { useEffect } from 'react';

/**
 * Lock body scroll while `active`, compensating for scrollbar width to avoid
 * layout shift. Restores prior styles on cleanup. Operates on `doc` (default
 * the main document; the iframe document inside the Storybook device frame).
 */
export function useScrollLock(active = true, doc: Document = document): void {
  useEffect(() => {
    if (!active) return;
    const { overflow, paddingRight } = doc.body.style;
    const scrollbarWidth =
      (doc.defaultView?.innerWidth ?? 0) - doc.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      doc.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    doc.body.style.overflow = 'hidden';
    return () => {
      doc.body.style.overflow = overflow;
      doc.body.style.paddingRight = paddingRight;
    };
  }, [active, doc]);
}
