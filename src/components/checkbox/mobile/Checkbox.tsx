import { cx } from '@/utils/classnames';
import type { CheckboxPresentationSharedProps } from '../types';
import styles from './Checkbox.module.less';

const SIZE_CLASS = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

/** Mobile presentation: larger 22px box, full-width tap row (min 44px), press feedback. */
export function MobileCheckbox(props: CheckboxPresentationSharedProps) {
  const { rootProps, checked, indeterminate, disabled, size = 'md', label, description, className } = props;

  return (
    <div
      {...rootProps}
      className={cx(styles.wrap, disabled && styles.disabled, className)}
      data-lib-checkbox="mobile"
    >
      <span
        className={cx(
          styles.box,
          SIZE_CLASS[size],
          checked && styles.checked,
          indeterminate && styles.indeterminate,
        )}
      >
        {indeterminate ? '–' : checked ? '✓' : null}
      </span>
      {label || description ? (
        <span className={styles.text}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      ) : null}
    </div>
  );
}
