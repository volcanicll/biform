import { useCallback, useRef, useState, type SetStateAction } from 'react';

export interface UseControlledParams<T> {
  /** The controlled value. When defined, the component is fully controlled. */
  controlled: T | undefined;
  /** The default (uncontrolled) value used until the consumer takes over. */
  default: T | undefined;
  /** Component name, surfaced in dev warnings for controlled/uncontrolled misuse. */
  name?: string;
}

/**
 * Controlled / uncontrolled value bridge.
 *
 * - If `controlled` is provided, the hook always returns it (controlled mode).
 * - Otherwise it keeps internal state seeded from `default` (uncontrolled mode).
 *
 * Returns a `[value, setValue]` tuple where `setValue` is a no-op in controlled mode
 * (the consumer is responsible for updating `controlled`).
 */
export function useControlled<T>({ controlled, default: defaultValue }: UseControlledParams<T>) {
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValueState] = useState<T | undefined>(defaultValue);
  const value = isControlled ? controlled : valueState;

  const setValue = useCallback(
    (next: SetStateAction<T | undefined>) => {
      if (!isControlled) {
        setValueState(next);
      }
    },
    [isControlled],
  );

  return [value, setValue] as const;
}
