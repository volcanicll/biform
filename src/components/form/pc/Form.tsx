import { cx } from '@/utils/classnames';
import type { FormShellProps } from '../types';
import styles from './Form.module.less';

/** PC form shell — `inline` lays items out in a row; otherwise a column stack. */
export function PcForm({ layout = 'horizontal', className, onSubmit, children }: FormShellProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cx(styles.form, layout === 'inline' && styles.inline, className)}
      data-lib-form="pc"
      noValidate
    >
      {children}
    </form>
  );
}
