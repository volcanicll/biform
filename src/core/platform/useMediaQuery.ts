import { useEffect, useState } from 'react';
import { canUseDOM } from '@/utils/ssr';

/**
 * SSR-safe media-query matcher.
 *
 * Returns `false` during SSR AND during the first client render (state is seeded
 * `false`, never read from `window` in the initializer) so the hydrated output
 * matches the server output. The real match is read in an effect after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!canUseDOM || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
