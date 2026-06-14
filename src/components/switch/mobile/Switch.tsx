import { cx } from '@/utils/classnames';
import type { SwitchPresentationSharedProps } from '../types';
import styles from './Switch.module.less';

const SIZE_CLASS = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

/** Mobile presentation: larger track/knob, full-row tap target (min 44px). */
export function MobileSwitch(props: SwitchPresentationSharedProps) {
  const { rootProps, checked, disabled, size = 'md', label, className } = props;

  return (
    <div
      {...rootProps}
      className={cx(styles.wrap, disabled && styles.disabled, className)}
      data-lib-switch="mobile"
    >
      {label ? <span className={styles.label}>{label}</span> : null}
      <span
        className={cx(
          styles.track,
          SIZE_CLASS[size],
          checked && styles.checked,
          disabled && styles.trackDisabled,
        )}
      >
        <span className={styles.knob} />
      </span>
    </div>
  );
}
