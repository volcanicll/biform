import { cx } from '@/utils/classnames';
import type { FormItemViewProps } from '../types';
import styles from './FormItem.module.less';

/** Mobile field layout: label above control, full width, error with an icon. */
export function MobileFormItem({
  label,
  required,
  error,
  errorId,
  help,
  className,
  children,
}: FormItemViewProps) {
  return (
    <div className={cx(styles.item, className)} data-lib-formitem="mobile">
      {label != null ? (
        <div className={styles.label}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden>
              *
            </span>
          ) : null}
        </div>
      ) : null}
      <div className={styles.control}>
        {children}
        {error ? (
          <div id={errorId} className={styles.error} role="alert">
            <span aria-hidden>⚠</span>
            {error}
          </div>
        ) : help ? (
          <div className={styles.help}>{help}</div>
        ) : null}
      </div>
    </div>
  );
}
