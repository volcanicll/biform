import { useEffect } from 'react';
import { useLatest } from './useLatest';

/** Invoke `handler` on Escape keydown while `active` (on `doc`, default the main document). */
export function useEscapeKey(handler: () => void, active = true, doc: Document = document): void {
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handlerRef.current();
    };
    doc.addEventListener('keydown', onKeyDown);
    return () => doc.removeEventListener('keydown', onKeyDown);
    // handlerRef holds a stable identity; listing it satisfies exhaustive-deps.
  }, [active, doc, handlerRef]);
}
