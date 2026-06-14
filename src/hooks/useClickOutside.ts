import { useEffect, type RefObject } from 'react';
import { useLatest } from './useLatest';

/**
 * Fire `handler` on a pointer-down that lands outside all `refs`.
 *
 * The `refs` array is read at event time via a ref, so callers may pass an
 * inline array (e.g. `[...outsideRefs, contentRef]`) without forcing the
 * document listeners to detach and re-attach on every render — the contained
 * ref objects are stable, so their `.current` is always fresh. Used by
 * {@link Overlay} and popovers.
 *
 * @param doc which document to attach listeners to (defaults to the main document;
 *            overridden with the iframe document inside the Storybook device frame).
 */
export function useClickOutside(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  handler: (event: MouseEvent | TouchEvent) => void,
  active = true,
  doc: Document = document,
): void {
  const handlerRef = useLatest(handler);
  const refsRef = useLatest(refs);

  useEffect(() => {
    if (!active) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (refsRef.current.some((ref) => ref.current?.contains(target))) return;
      handlerRef.current(event);
    };
    doc.addEventListener('mousedown', listener);
    doc.addEventListener('touchstart', listener);
    return () => {
      doc.removeEventListener('mousedown', listener);
      doc.removeEventListener('touchstart', listener);
    };
    // handlerRef/refsRef hold stable identities; listing them satisfies
    // exhaustive-deps without causing re-subscription.
  }, [active, doc, handlerRef, refsRef]);
}
