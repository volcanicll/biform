import { useEffect, useState } from 'react';
import { Overlay } from '@/core/portal';
import { cx } from '@/utils/classnames';
import type { SelectPcPresentationProps } from '../types';
import styles from './Select.module.less';

const SIZE_CLASS = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

interface PopoverPos {
  top: number;
  left: number;
  width: number;
}

/**
 * PC presentation: a combobox trigger that opens an anchored popover listbox.
 * Focus stays on the trigger (WAI-ARIA combobox pattern with
 * `aria-activedescendant`); keyboard navigation is handled by the headless hook.
 */
export function PcSelect(props: SelectPcPresentationProps) {
  const {
    triggerProps,
    listboxProps,
    getOptionProps,
    filteredOptions,
    selectedOption,
    open,
    setOpen,
    clear,
    searchValue,
    setSearchValue,
    enableSearch,
    searchPlaceholder,
    highlightedIndex,
    refs,
    idBase,
    placeholder,
    size = 'md',
    status = 'default',
    disabled,
    clearable,
    id,
    className,
    maxHeight = 280,
  } = props;

  const [pos, setPos] = useState<PopoverPos | null>(null);

  // Position the popover under the trigger whenever it opens.
  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const el = refs.trigger.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX, width: rect.width });
  }, [open, refs]);

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    document.getElementById(`${idBase}-option-${highlightedIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, highlightedIndex, idBase]);

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
          status === 'warning' && styles.statusWarning,
          open && styles.open,
          disabled && styles.disabled,
        )}
        data-status={status}
        data-lib-select="pc"
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
        placement="pc-anchor"
        lockScroll={false}
        trapFocus={false}
        returnFocus={false}
        outsideRefs={[refs.trigger]}
      >
        {pos ? (
          <div
            className={styles.popover}
            style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
            role="presentation"
          >
            {enableSearch ? (
              <div className={styles.search}>
                <input
                  className={styles.searchInput}
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={searchPlaceholder ?? '搜索'}
                  aria-label="搜索选项"
                />
              </div>
            ) : null}
            <ul {...listboxProps} className={styles.list} style={{ maxHeight }}>
              {filteredOptions.length === 0 ? (
                <li className={styles.empty} role="presentation">
                  无匹配项
                </li>
              ) : (
                filteredOptions.map((opt, i) => (
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
                    {opt.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}
      </Overlay>
    </div>
  );
}
