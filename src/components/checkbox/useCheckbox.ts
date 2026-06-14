import { useCallback, type KeyboardEvent } from 'react';
import { useControlled } from '@/hooks/useControlled';
import type { UseCheckboxProps } from './types';

export interface UseCheckboxReturn {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  toggle: () => void;
  setChecked: (next: boolean) => void;
  /** Spread onto the checkbox root element (`role=checkbox`). */
  rootProps: {
    role: 'checkbox';
    'aria-checked': boolean | 'mixed';
    'aria-disabled': boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
  };
}

/**
 * Headless checkbox logic — platform-agnostic.
 *
 * Owns controlled/uncontrolled checked state, indeterminate handling (visual
 * only; activating an indeterminate box resolves it to checked), `role=checkbox`
 * with `aria-checked` reflecting `'mixed'` when indeterminate, and Space/Enter.
 */
export function useCheckbox(props: UseCheckboxProps): UseCheckboxReturn {
  const {
    checked: checkedProp,
    defaultChecked = false,
    indeterminate = false,
    onChange,
    disabled = false,
    ariaLabel,
    ariaDescribedby,
  } = props;

  const [checkedRaw, setCheckedState] = useControlled<boolean>({
    controlled: checkedProp,
    default: defaultChecked,
  });
  const checked = checkedRaw ?? false;

  const setChecked = useCallback(
    (next: boolean) => {
      if (disabled) return;
      setCheckedState(next);
      onChange?.(next);
    },
    [disabled, onChange, setCheckedState],
  );

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = indeterminate ? true : !checked;
    setCheckedState(next);
    onChange?.(next);
  }, [checked, disabled, indeterminate, onChange, setCheckedState]);

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
    indeterminate,
    disabled,
    toggle,
    setChecked,
    rootProps: {
      role: 'checkbox',
      'aria-checked': indeterminate ? 'mixed' : checked,
      'aria-disabled': disabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      tabIndex: disabled ? -1 : 0,
      onClick: toggle,
      onKeyDown: handleKeyDown,
    },
  };
}
