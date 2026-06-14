import { usePlatform } from '@/core/platform';
import { useSelect } from './useSelect';
import type { SelectProps } from './types';
import { PcSelect } from './pc';
import { MobileSelect } from './mobile';

/**
 * Adaptive Select — resolves the platform (SSR-gated), runs the headless hook
 * ONCE, and delegates to the PC popover dropdown or the mobile bottom-sheet.
 * Same `<Select value onChange options>` API, two structurally different UIs.
 */
export function Select(props: SelectProps) {
  const {
    platform: override,
    pc,
    mobile,
    placeholder,
    size,
    status,
    disabled,
    clearable,
    searchPlaceholder,
    id,
    className,
    ...rest
  } = props;

  const { platform, unstable } = usePlatform(override);
  const effective = unstable ? 'pc' : platform;
  const bag = useSelect(rest);

  const common = {
    ...bag,
    placeholder,
    size,
    status,
    disabled,
    clearable,
    enableSearch: rest.enableSearch,
    searchPlaceholder,
    id,
    className,
  };

  if (effective === 'mobile') {
    return <MobileSelect {...common} {...mobile} />;
  }
  return <PcSelect {...common} {...pc} />;
}

Select.displayName = 'Select';
