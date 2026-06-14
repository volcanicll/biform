import { cx } from '@/utils/classnames';
import type { FormShellProps } from '../types';
import styles from './Form.module.less';

/** Mobile form shell — always a vertical stack (layout prop is ignored). */
export function MobileForm({ className, onSubmit, children }: FormShellProps) {
  return (
    <form onSubmit={onSubmit} className={cx(styles.form, className)} data-lib-form="mobile" noValidate>
      {children}
    </form>
  );
}
