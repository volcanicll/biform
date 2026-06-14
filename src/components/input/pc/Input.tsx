import { cx } from '@/utils/classnames';
import type { InputPcPresentationProps } from '../types';
import styles from './Input.module.less';

const SIZE_CLASS = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

/** PC presentation: compact single-line box, hover/focus affordances, inline count. */
export function PcInput(props: InputPcPresentationProps) {
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
    autoComplete,
    inputMode,
  } = props;

  const showClear = clearable && filled && !readOnly && !disabled;

  return (
    <div
      className={cx(
        styles.root,
        SIZE_CLASS[size],
        status === 'error' && styles.statusError,
        status === 'warning' && styles.statusWarning,
        focused && styles.focused,
        disabled && styles.disabled,
        className,
      )}
      data-status={status}
      data-lib-input="pc"
    >
      {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
      <input
        {...inputProps}
        ref={inputRef}
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
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
      {showCount ? (
        <span className={styles.count}>
          {count}
          {maxLength ? `/${maxLength}` : ''}
        </span>
      ) : null}
    </div>
  );
}
