import type { ReactNode } from 'react';
import type { Size } from '@/utils/types';
import type { UseCheckboxReturn } from './useCheckbox';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Visual-only indeterminate state. Activating resolves it to checked. */
  indeterminate?: boolean;
  onChange?: (checked: boolean, event?: unknown) => void;
  disabled?: boolean;
  size?: Size;
  label?: ReactNode;
  description?: ReactNode;
  ariaLabel?: string;
  ariaDescribedby?: string;
  /** Per-component platform override. */
  platform?: 'pc' | 'mobile';
  className?: string;
}

export type UseCheckboxProps = Pick<
  CheckboxProps,
  'checked' | 'defaultChecked' | 'indeterminate' | 'onChange' | 'disabled' | 'ariaLabel' | 'ariaDescribedby'
>;

export interface CheckboxPresentationSharedProps extends UseCheckboxReturn {
  size?: Size;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
}
