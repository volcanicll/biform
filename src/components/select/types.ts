import type { ReactNode } from 'react';
import type { Size, Status } from '@/utils/types';
import type { UseSelectReturn } from './useSelect';

export interface SelectOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

/** PC-only presentation tweaks. Ignored when rendering the mobile UI. */
export interface SelectPcProps {
  /** Max height (px) of the dropdown list before it scrolls. Default 280. */
  maxHeight?: number;
  /** Virtualization toggle (reserved for v0.2; not yet implemented). */
  virtual?: boolean;
  placement?: 'bottom-start' | 'bottom-end';
}

/** Mobile-only presentation tweaks. Ignored when rendering the PC UI. */
export interface SelectMobileProps {
  /** Expand the bottom sheet to near full-screen height. */
  fullScreen?: boolean;
  /** Show a header with a Done button (useful for confirm-style flows). */
  showDoneBar?: boolean;
  /** Render with safe-area insets. */
  safeArea?: boolean;
  /** Optional sheet title. */
  title?: ReactNode;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  /** Fired with the new value (and the matched option when available). */
  onChange?: (value: string | undefined, option?: SelectOption) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  status?: Status;
  size?: Size;
  clearable?: boolean;
  /** Enable the search/filter input inside the open panel. */
  enableSearch?: boolean;
  searchPlaceholder?: string;
  id?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  onOpenChange?: (open: boolean) => void;
  /** PC-only presentation tweaks. Ignored on mobile. */
  pc?: SelectPcProps;
  /** Mobile-only presentation tweaks. Ignored on PC. */
  mobile?: SelectMobileProps;
  /** Per-component platform override. */
  platform?: 'pc' | 'mobile';
  className?: string;
}

/** Subset consumed by the headless hook (platform-agnostic). */
export type UseSelectProps = Pick<
  SelectProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'options'
  | 'clearable'
  | 'enableSearch'
  | 'ariaLabel'
  | 'ariaDescribedby'
  | 'onOpenChange'
>;

/** Props shared by both PC and mobile presentations. */
export interface SelectPresentationSharedProps extends UseSelectReturn {
  placeholder?: string;
  size?: Size;
  status?: Status;
  disabled?: boolean;
  clearable?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  id?: string;
  className?: string;
}

export interface SelectPcPresentationProps extends SelectPresentationSharedProps, SelectPcProps {}

export interface SelectMobilePresentationProps
  extends SelectPresentationSharedProps,
    SelectMobileProps {}
