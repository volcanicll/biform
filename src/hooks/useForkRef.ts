import { useMemo, type MutableRefObject, type Ref } from 'react';

/**
 * Merge multiple refs (callback or object) into one callback ref so several
 * consumers can observe the same DOM node.
 */
export function useForkRef<T>(...refs: Array<Ref<T> | undefined | null>) {
  return useMemo(() => {
    return (instance: T | null) => {
      for (const ref of refs) {
        if (!ref) continue;
        if (typeof ref === 'function') {
          ref(instance);
        } else {
          (ref as MutableRefObject<T | null>).current = instance;
        }
      }
    };
    // refs are stable identity (object refs) or change together; eslint can't see inside the rest tuple.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
