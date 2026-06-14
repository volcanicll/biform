import { usePlatform } from '@/core/platform';
import { useSwitch } from './useSwitch';
import type { SwitchProps } from './types';
import { PcSwitch } from './pc';
import { MobileSwitch } from './mobile';

/** Adaptive Switch — resolves platform (SSR-gated), runs the hook once, delegates. */
export function Switch(props: SwitchProps) {
  const { platform: override, size, label, className, ...rest } = props;
  const { platform, unstable } = usePlatform(override);
  const effective = unstable ? 'pc' : platform;
  const bag = useSwitch(rest);
  const common = { ...bag, size, label, className };

  if (effective === 'mobile') {
    return <MobileSwitch {...common} />;
  }
  return <PcSwitch {...common} />;
}

Switch.displayName = 'Switch';
