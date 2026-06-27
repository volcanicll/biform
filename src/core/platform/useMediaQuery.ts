import { useCallback, useSyncExternalStore } from 'react';
import { canUseDOM } from '@/utils/ssr';

/**
 * SSR-safe media-query matcher backed by `useSyncExternalStore`.
 *
 * The server render (and the client hydration pass) resolves to `false`; once
 * mounted on the client the real match is read synchronously from
 * `MediaQueryList.matches`, and React re-renders whenever the list fires a
 * `change` event.
 *
 * This is the React-recommended external-store subscription pattern. Compared to
 * the previous `useState` + `useEffect` pair it is:
 * - **concurrent-safe** — no tearing under concurrent rendering;
 * - **stricter for SSR** — `getServerSnapshot` is the single source of truth
 *   during hydration, so the hydrated DOM is guaranteed to match the server;
 * - **flash-free on client-only apps** — the first client render already reads
 *   the real match instead of a placeholder `false` that flips after mount.
 *
 * Returns `false` when `matchMedia` is unavailable (SSR / non-DOM environment).
 */
export function useMediaQuery(query: string): boolean {
  // Stable per-query subscription: React re-subscribes only when `query` changes.
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!canUseDOM || typeof window.matchMedia !== 'function') return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  // Reads a primitive, so referential stability is not required.
  const getSnapshot = useCallback(() => {
    if (!canUseDOM || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server / pre-hydration value: never touch `window`.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
