import { usePlatform } from '@/core/platform';
import { useCheckbox } from './useCheckbox';
import type { CheckboxProps } from './types';
import { PcCheckbox } from './pc';
import { MobileCheckbox } from './mobile';

/** Adaptive Checkbox — resolves platform (SSR-gated), runs the hook once, delegates. */
export function Checkbox(props: CheckboxProps) {
  const { platform: override, size, label, description, className, ...rest } = props;
  const { platform, unstable } = usePlatform(override);
  const effective = unstable ? 'pc' : platform;
  const bag = useCheckbox(rest);
  const common = { ...bag, size, label, description, className };

  if (effective === 'mobile') {
    return <MobileCheckbox {...common} />;
  }
  return <PcCheckbox {...common} />;
}

Checkbox.displayName = 'Checkbox';
