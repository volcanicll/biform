import { cx } from '@/utils/classnames';
import type { FormItemViewProps } from '../types';
import styles from './FormItem.module.less';

/** PC field layout: label in a fixed-width left column, control + error right. */
export function PcFormItem({
  label,
  required,
  error,
  errorId,
  help,
  layout = 'horizontal',
  className,
  children,
}: FormItemViewProps) {
  const vertical = layout === 'vertical';
  return (
    <div
      className={cx(styles.item, vertical ? styles.vertical : styles.horizontal, className)}
      data-lib-formitem="pc"
    >
      {label != null ? (
        <div className={styles.label}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden>
              *
            </span>
          ) : null}
        </div>
      ) : (
        <div className={styles.label} aria-hidden />
      )}
      <div className={styles.control}>
        {children}
        {error ? (
          <div id={errorId} className={styles.error} role="alert">
            {error}
          </div>
        ) : help ? (
          <div className={styles.help}>{help}</div>
        ) : null}
      </div>
    </div>
  );
}
