import { useContext } from 'react';
import { PlatformContext, type Platform, type PlatformContextValue } from './PlatformContext';

/**
 * Read the resolved platform. Pass an `override` for the per-component escape
 * hatch (a single component can be forced to a platform regardless of context).
 *
 * Resolution precedence (handled by the consumer wrapper, not here):
 *   per-component `platform` prop  >  provider value  >  (none) safe default = PC.
 *
 * When no provider is mounted, returns a PC default with `unstable=true` so
 * components still render (graceful degradation).
 */
export function usePlatform(override?: Platform): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    return { platform: override ?? 'pc', breakpoint: 768, mode: 'auto', unstable: true };
  }
  if (override && override !== ctx.platform) {
    return { ...ctx, platform: override, mode: override };
  }
  return ctx;
}
