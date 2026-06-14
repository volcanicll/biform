import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
} from 'react';
import type { Size, Status } from '@/utils/types';
import type { UseInputReturn } from './useInput';

export type InputKeyboardType = 'text' | 'number' | 'decimal' | 'email' | 'tel' | 'url' | 'search';
export type InputReturnKeyType = 'done' | 'go' | 'next' | 'search' | 'send';

/** PC-only presentation tweaks. Ignored when rendering the mobile UI. */
export interface InputPcProps {
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
}

/** Mobile-only presentation tweaks. Ignored when rendering the PC UI. */
export interface InputMobileProps {
  keyboardType?: InputKeyboardType;
  returnKeyType?: InputReturnKeyType;
}

export interface InputProps {
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Fired with the new string value (and the originating event when available). */
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  status?: Status;
  size?: Size;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Show a clear (✕) affordance. */
  clearable?: boolean;
  maxLength?: number;
  /** Show a `count / maxLength` indicator. */
  showCount?: boolean;
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  /** PC-only presentation tweaks. Ignored on mobile. */
  pc?: InputPcProps;
  /** Mobile-only presentation tweaks. Ignored on PC. */
  mobile?: InputMobileProps;
  /** Per-component platform override. */
  platform?: 'pc' | 'mobile';
  className?: string;
}

/** Subset of props the headless hook consumes (platform-agnostic). */
export type UseInputProps = Pick<
  InputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'disabled'
  | 'readOnly'
  | 'maxLength'
  | 'status'
  | 'ariaLabel'
  | 'ariaDescribedby'
  | 'onFocus'
  | 'onBlur'
  | 'onPressEnter'
  | 'onKeyDown'
  | 'onPaste'
>;

/** Keyboard map for mobile `keyboardType` → native `inputMode`. */
export const KEYBOARD_TYPE_TO_INPUT_MODE: Record<InputKeyboardType, InputPcProps['inputMode']> = {
  text: 'text',
  number: 'numeric',
  decimal: 'decimal',
  email: 'email',
  tel: 'tel',
  url: 'url',
  search: 'search',
};

/** Mobile `returnKeyType` → native `enterKeyHint`. */
export const RETURN_KEY_TO_HINT: Record<InputReturnKeyType, string> = {
  done: 'done',
  go: 'go',
  next: 'next',
  search: 'search',
  send: 'send',
};

/**
 * Props shared by both PC and mobile presentations.
 *
 * Both presentations accept the headless {@link UseInputReturn} bag (spread) plus
 * the common presentational props the wrapper threads through. Platform-specific
 * extras are layered on by each presentation (see {@link InputPcPresentationProps}
 * / {@link InputMobilePresentationProps}).
 */
export interface InputPresentationSharedProps extends UseInputReturn {
  inputRef: Ref<HTMLInputElement>;
  placeholder?: string;
  size?: Size;
  status?: Status;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  showCount?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export interface InputPcPresentationProps extends InputPresentationSharedProps, InputPcProps {}

export interface InputMobilePresentationProps extends InputPresentationSharedProps, InputMobileProps {}

