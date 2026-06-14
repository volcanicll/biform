/** True when running in a browser DOM environment. False on the server / prerender. */
export const canUseDOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

/** Inverse of {@link canUseDOM}. */
export const isServer: boolean = !canUseDOM;
