import { createContext } from 'react';

/** The two rendering targets of every adaptive component. */
export type Platform = 'pc' | 'mobile';

/** Provider intent: auto-detect or force one platform. */
export type PlatformMode = 'auto' | Platform;

export interface PlatformContextValue {
  /** Resolved platform — the value components read to pick a presentation. */
  platform: Platform;
  /** Configured breakpoint in px (for debugging / stories). */
  breakpoint: number;
  /** Raw provider intent. */
  mode: PlatformMode;
  /**
   * True only while in `auto` mode before the first client-side media-query
   * measurement has run. Components gate the presentation flip on this so the
   * first client paint matches the server render (no hydration mismatch).
   */
  unstable: boolean;
}

/**
 * null means "no provider mounted"; {@link usePlatform} falls back to a safe
 * default (PC) in that case.
 */
export const PlatformContext = createContext<PlatformContextValue | null>(null);
