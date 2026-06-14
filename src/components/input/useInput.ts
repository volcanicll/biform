import {
  useCallback,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { useControlled } from '@/hooks/useControlled';
import type { UseInputProps } from './types';

export interface UseInputReturn {
  /** Current value (controlled or internal). */
  value: string;
  /** True when there is a non-empty value. */
  filled: boolean;
  /** True while the input is focused. */
  focused: boolean;
  /** Current character count. */
  count: number;
  /** Forwarded maxLength (undefined when not set). */
  maxLength: number | undefined;
  /** Clear the value and refocus the input. */
  clear: () => void;
  /** Spread onto the <input> element (value, change, focus, blur, key, paste, a11y). */
  inputProps: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus: (event: FocusEvent<HTMLInputElement>) => void;
    onBlur: (event: FocusEvent<HTMLInputElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
    maxLength?: number;
    disabled: boolean;
    readOnly: boolean;
    'aria-invalid'?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
  };
}

/**
 * Headless input logic — platform-agnostic, written ONCE.
 *
 * Owns controlled/uncontrolled value sync, character counting, clear(), the
 * status→`aria-invalid` mapping, and Enter/focus/blur handling. Both the PC and
 * mobile presentations consume the returned bag and only differ in markup/CSS.
 *
 * @param inputRef ref to the underlying <input>, used to restore focus after clear().
 */
export function useInput(props: UseInputProps, inputRef: RefObject<HTMLInputElement>): UseInputReturn {
  const {
    value: valueProp,
    defaultValue = '',
    onChange,
    disabled = false,
    readOnly = false,
    maxLength,
    status,
    ariaLabel,
    ariaDescribedby,
    onFocus,
    onBlur,
    onPressEnter,
    onKeyDown,
    onPaste,
  } = props;

  const [valueRaw, setValue] = useControlled<string>({ controlled: valueProp, default: defaultValue });
  const value = valueRaw ?? '';
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setValue(next);
      onChange?.(next, event);
    },
    [onChange, setValue],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.key === 'Enter') {
        onPressEnter?.(event);
      }
    },
    [onKeyDown, onPressEnter],
  );

  const clear = useCallback(() => {
    setValue('');
    onChange?.('');
    inputRef.current?.focus();
  }, [onChange, setValue, inputRef]);

  return {
    value,
    filled: value.length > 0,
    focused,
    count: value.length,
    maxLength,
    clear,
    inputProps: {
      value,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onPaste,
      maxLength,
      disabled,
      readOnly,
      'aria-invalid': status === 'error' ? true : undefined,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
    },
  };
}
