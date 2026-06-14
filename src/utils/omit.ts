/** Return a shallow copy of `obj` without the given keys. */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: ReadonlyArray<K>,
): Omit<T, K> {
  const next = { ...obj };
  for (const k of keys) {
    delete next[k];
  }
  return next;
}

/** Return a shallow copy of `obj` keeping only the given keys. */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: ReadonlyArray<K>,
): Pick<T, K> {
  const next = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) next[k] = obj[k];
  }
  return next;
}
