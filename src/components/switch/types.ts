import type { ReactNode } from 'react';
import type { Size } from '@/utils/types';
import type { UseSwitchReturn } from './useSwitch';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event?: unknown) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: Size;
  label?: ReactNode;
  ariaLabel?: string;
  ariaDescribedby?: string;
  /** Per-component platform override. */
  platform?: 'pc' | 'mobile';
  className?: string;
}

export type UseSwitchProps = Pick<
  SwitchProps,
  'checked' | 'defaultChecked' | 'onChange' | 'disabled' | 'loading' | 'ariaLabel' | 'ariaDescribedby'
>;

export interface SwitchPresentationSharedProps extends UseSwitchReturn {
  size?: Size;
  label?: ReactNode;
  className?: string;
}
