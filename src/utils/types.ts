import type { ForwardedRef, ReactElement } from 'react';

/** Unified size scale across all components. */
export type Size = 'sm' | 'md' | 'lg';

/** Validation/visual status shared by form components. */
export type Status = 'default' | 'error' | 'warning';

/** Convenience type for a forwardRef component function. */
export interface ForwardRefComponent<T, P> {
  (props: P, ref: ForwardedRef<T>): ReactElement | null;
  displayName?: string;
}
