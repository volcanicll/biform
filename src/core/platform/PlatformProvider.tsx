import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PlatformContext, type Platform, type PlatformContextValue, type PlatformMode } from './PlatformContext';
import { useMediaQuery } from './useMediaQuery';

export interface PlatformProviderProps {
  /**
   * How to resolve the platform.
   * - `auto` (default): detect via media query, defaulting to PC until measured.
   * - `pc` / `mobile`: force one platform (stable from first paint — no flip).
   */
  platform?: PlatformMode;
  /** Viewport width at/below which `auto` resolves to mobile. Default 768. */
  breakpoint?: number;
  children: ReactNode;
}

/**
 * Provides the resolved platform to all descendant adaptive components.
 *
 * SSR / hydration strategy: in `auto` mode the first render (server + first
 * client paint) resolves to PC and exposes `unstable=true`; adaptive wrappers
 * render their PC presentation during that window so the DOM matches the server.
 * After mount the real media-query value is applied and `unstable` flips false.
 */
export function PlatformProvider({
  platform = 'auto',
  breakpoint = 768,
  children,
}: PlatformProviderProps) {
  const isMobile = useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const value = useMemo<PlatformContextValue>(() => {
    const detected: Platform = isMobile ? 'mobile' : 'pc';
    const resolved: Platform = platform === 'auto' ? detected : platform;
    const unstable = platform === 'auto' && !hydrated;
    return { platform: resolved, breakpoint, mode: platform, unstable };
  }, [platform, breakpoint, isMobile, hydrated]);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}
