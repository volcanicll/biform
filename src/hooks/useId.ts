import { useId as useReactId } from 'react';

/** Wrap React's useId with an optional prefix (e.g. `select`, `input`). */
export function useId(prefix = ''): string {
  const id = useReactId();
  return prefix ? `${prefix}-${id}` : id;
}
