import { Fragment } from 'react';
import { Overlay } from '@/core/portal';
import { cx } from '@/utils/classnames';
import type { SelectMobilePresentationProps } from '../types';
import styles from './Select.module.less';

const SIZE_CLASS = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

/**
 * Mobile presentation: a taller trigger that opens a bottom-sheet picker with a
 * backdrop and large (56px) tap rows. The sheet is a focus-trapped dialog
 * (`role=dialog` `aria-modal`); selecting a row picks it and dismisses.
 */
export function MobileSelect(props: SelectMobilePresentationProps) {
  const {
    triggerProps,
    listboxProps,
    getOptionProps,
    filteredOptions,
    selectedOption,
    open,
    setOpen,
    clear,
    clearable,
    highlightedIndex,
    refs,
    placeholder,
    size = 'md',
    status = 'default',
    disabled,
    id,
    className,
    fullScreen,
    showDoneBar,
    title,
  } = props;

  const showClear = clearable && !!selectedOption && !disabled;

  return (
    <div className={cx(styles.root, className)}>
      <div
        {...triggerProps}
        id={id}
        tabIndex={disabled ? -1 : 0}
        className={cx(
          styles.trigger,
          SIZE_CLASS[size],
          status === 'error' && styles.statusError,
          open && styles.open,
          disabled && styles.disabled,
        )}
        data-status={status}
        data-lib-select="mobile"
      >
        <span className={styles.value}>
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className={styles.placeholder}>{placeholder ?? '请选择'}</span>
          )}
        </span>
        {showClear ? (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear"
            tabIndex={-1}
            onClick={(event) => {
              event.stopPropagation();
              clear();
            }}
          >
            ✕
          </button>
        ) : null}
        <span className={cx(styles.chevron, open && styles.chevronOpen)} aria-hidden>
          ▾
        </span>
      </div>

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        placement="mobile-bottom"
        trapFocus
        lockScroll
        outsideRefs={[refs.trigger]}
      >
        <Fragment>
          <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden />
          <div
            className={cx(styles.sheet, fullScreen && styles.fullScreen)}
            role="dialog"
            aria-modal="true"
            aria-label={title ? String(title) : '选择'}
          >
            {showDoneBar || title ? (
              <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                {showDoneBar ? (
                  <button type="button" className={styles.done} onClick={() => setOpen(false)}>
                    完成
                  </button>
                ) : null}
              </div>
            ) : null}
            <ul {...listboxProps} className={styles.list}>
              {filteredOptions.map((opt, i) => (
                <li
                  key={opt.value}
                  {...getOptionProps(i)}
                  className={cx(
                    styles.option,
                    highlightedIndex === i && styles.highlighted,
                    opt.value === selectedOption?.value && styles.selected,
                    opt.disabled && styles.optionDisabled,
                  )}
                >
                  <span className={styles.optionLabel}>{opt.label}</span>
                  {opt.value === selectedOption?.value ? (
                    <span className={styles.check} aria-hidden>
                      ✓
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      </Overlay>
    </div>
  );
}
