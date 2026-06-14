import { useCallback, type KeyboardEvent } from 'react';
import { useControlled } from '@/hooks/useControlled';
import type { UseSwitchProps } from './types';

export interface UseSwitchReturn {
  checked: boolean;
  loading: boolean;
  /** Effective disabled (disabled OR loading). */
  disabled: boolean;
  toggle: () => void;
  setChecked: (next: boolean) => void;
  /** Spread onto the switch root element (`role=switch`). */
  rootProps: {
    role: 'switch';
    'aria-checked': boolean;
    'aria-disabled': boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
  };
}

/**
 * Headless switch logic — platform-agnostic.
 *
 * Owns controlled/uncontrolled checked state, toggle, disabled/loading gating,
 * `role=switch` + `aria-checked`, and Space/Enter activation.
 */
export function useSwitch(props: UseSwitchProps): UseSwitchReturn {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onChange,
    disabled = false,
    loading = false,
    ariaLabel,
    ariaDescribedby,
  } = props;

  const [checkedRaw, setCheckedState] = useControlled<boolean>({
    controlled: checkedProp,
    default: defaultChecked,
  });
  const checked = checkedRaw ?? false;
  const effectiveDisabled = disabled || loading;

  const setChecked = useCallback(
    (next: boolean) => {
      if (effectiveDisabled) return;
      setCheckedState(next);
      onChange?.(next);
    },
    [effectiveDisabled, onChange, setCheckedState],
  );

  const toggle = useCallback(() => {
    setChecked(!checked);
  }, [checked, setChecked]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  return {
    checked,
    loading,
    disabled: effectiveDisabled,
    toggle,
    setChecked,
    rootProps: {
      role: 'switch',
      'aria-checked': checked,
      'aria-disabled': effectiveDisabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      tabIndex: effectiveDisabled ? -1 : 0,
      onClick: toggle,
      onKeyDown: handleKeyDown,
    },
  };
}
