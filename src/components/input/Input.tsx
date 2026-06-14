import { forwardRef, useRef } from 'react';
import { usePlatform } from '@/core/platform';
import { useForkRef } from '@/hooks/useForkRef';
import { useInput } from './useInput';
import type { InputProps } from './types';
import { PcInput } from './pc';
import { MobileInput } from './mobile';

/**
 * Adaptive Input — the only place `usePlatform` is consulted at the component
 * layer. Resolves the platform (SSR-gated), runs the headless hook ONCE, then
 * delegates to the matching presentation.
 *
 * The `unstable` gate forces the PC presentation during the first client paint
 * (matching the server render) to avoid hydration mismatch; the real platform
 * applies after mount.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    platform: override,
    pc,
    mobile,
    placeholder,
    size,
    prefix,
    suffix,
    clearable,
    showCount,
    id,
    name,
    className,
    ...rest
  } = props;

  const { platform, unstable } = usePlatform(override);
  const effective = unstable ? 'pc' : platform;

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useForkRef(ref, inputRef);
  const bag = useInput(rest, inputRef);

  const common = {
    ...bag,
    inputRef: mergedRef,
    placeholder,
    size,
    status: rest.status,
    disabled: rest.disabled,
    readOnly: rest.readOnly,
    prefix,
    suffix,
    clearable,
    showCount,
    id,
    name,
    className,
  };

  if (effective === 'mobile') {
    return <MobileInput {...common} {...mobile} />;
  }
  return <PcInput {...common} {...pc} />;
});

Input.displayName = 'Input';
