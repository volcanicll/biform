import { cx } from '@/utils/classnames';
import {
  KEYBOARD_TYPE_TO_INPUT_MODE,
  RETURN_KEY_TO_HINT,
  type InputMobilePresentationProps,
} from '../types';
import styles from './Input.module.less';

const SIZE_CLASS = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

/**
 * Mobile presentation: larger 44px-tall field, always-visible clear (when filled),
 * count rendered below-right, keyboard type/return-key mapped to native hints,
 * press feedback instead of hover.
 */
export function MobileInput(props: InputMobilePresentationProps) {
  const {
    inputProps,
    inputRef,
    placeholder,
    size = 'md',
    status = 'default',
    disabled,
    readOnly,
    prefix,
    suffix,
    clearable,
    showCount,
    count,
    maxLength,
    filled,
    focused,
    clear,
    id,
    name,
    className,
    keyboardType = 'text',
    returnKeyType,
  } = props;

  const inputMode = KEYBOARD_TYPE_TO_INPUT_MODE[keyboardType];
  const enterKeyHint = returnKeyType ? RETURN_KEY_TO_HINT[returnKeyType] : undefined;
  const showClear = clearable && filled && !readOnly && !disabled;

  return (
    <div className={cx(styles.root, className)} data-status={status} data-lib-input="mobile">
      <div
        className={cx(
          styles.field,
          SIZE_CLASS[size],
          status === 'error' && styles.statusError,
          status === 'warning' && styles.statusWarning,
          focused && styles.focused,
          disabled && styles.disabled,
        )}
      >
        {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
        <input
          {...inputProps}
          ref={inputRef}
          id={id}
          name={name}
          placeholder={placeholder}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint as 'done' | 'go' | 'next' | 'search' | 'send' | undefined}
          className={styles.input}
        />
        {showClear ? (
          <button
            type="button"
            className={styles.clear}
            onClick={clear}
            aria-label="Clear"
            tabIndex={-1}
          >
            ✕
          </button>
        ) : null}
        {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </div>
      {showCount ? (
        <div className={styles.countRow}>
          <span className={styles.count}>
            {count}
            {maxLength ? `/${maxLength}` : ''}
          </span>
        </div>
      ) : null}
    </div>
  );
}
