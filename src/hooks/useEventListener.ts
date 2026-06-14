import { useEffect, type RefObject } from 'react';
import { useLatest } from './useLatest';

type EventTarget = Window | Document | HTMLElement | RefObject<HTMLElement | null>;

/**
 * Attach a DOM event listener with a stable handler identity.
 *
 * The latest `handler` is kept in a ref so listeners are never re-attached on
 * every render — only when `eventName` / `element` / `options` change.
 */
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: EventTarget = window,
  options?: AddEventListenerOptions,
): void {
  const savedHandler = useLatest(handler);

  useEffect(() => {
    const target =
      element && typeof element === 'object' && 'current' in element ? element.current : element;
    if (!target?.addEventListener) return;

    const listener = (event: Event) => savedHandler.current(event);
    target.addEventListener(eventName, listener, options);
    return () => target.removeEventListener(eventName, listener, options);
    // savedHandler holds a stable identity; listing it satisfies exhaustive-deps.
  }, [eventName, element, options, savedHandler]);
}
