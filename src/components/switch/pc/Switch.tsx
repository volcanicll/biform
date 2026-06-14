import { cx } from '@/utils/classnames';
import type { SwitchPresentationSharedProps } from '../types';
import styles from './Switch.module.less';

const SIZE_CLASS = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

/** PC presentation: compact toggle with hover halo and keyboard focus ring. */
export function PcSwitch(props: SwitchPresentationSharedProps) {
  const { rootProps, checked, disabled, size = 'md', label, className } = props;

  return (
    <div
      {...rootProps}
      className={cx(styles.wrap, disabled && styles.disabled, className)}
      data-lib-switch="pc"
    >
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
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
