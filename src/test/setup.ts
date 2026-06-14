import '@testing-library/jest-dom';

/**
 * jsdom does not implement `window.matchMedia`. Provide a controllable stub:
 * MQL instances are cached per media-query string so a component's listener can
 * be notified when {@link setViewportMatch} flips the match state.
 */
type MatchMediaListener = (e: MediaQueryListEvent) => void;

interface StubEntry {
  matches: boolean;
  listeners: Set<MatchMediaListener>;
}

const cache = new Map<string, StubEntry>();

function getEntry(query: string): StubEntry {
  let entry = cache.get(query);
  if (!entry) {
    entry = { matches: false, listeners: new Set() };
    cache.set(query, entry);
  }
  return entry;
}

function buildMatchMedia(query: string): MediaQueryList {
  const entry = getEntry(query);
  const api = {
    get matches() {
      return entry.matches;
    },
    get media() {
      return query;
    },
    onchange: null as MediaQueryList['onchange'],
    addEventListener: (_type: unknown, listener: MatchMediaListener | EventListenerObject) => {
      if (typeof listener === 'function') entry.listeners.add(listener as MatchMediaListener);
    },
    removeEventListener: (_type: unknown, listener: MatchMediaListener | EventListenerObject) => {
      if (typeof listener === 'function') entry.listeners.delete(listener as MatchMediaListener);
    },
    addListener: (cb: MatchMediaListener) => {
      entry.listeners.add(cb);
    },
    removeListener: (cb: MatchMediaListener) => {
      entry.listeners.delete(cb);
    },
    dispatchEvent: () => false,
  };
  return api as unknown as MediaQueryList;
}

window.matchMedia = ((query: string) => buildMatchMedia(query)) as typeof window.matchMedia;

// jsdom does not implement scrollIntoView; no-op it so overlay scroll effects don't throw.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

function emit(query: string, matches: boolean) {
  const entry = getEntry(query);
  entry.matches = matches;
  const evt = { media: query, matches } as unknown as MediaQueryListEvent;
  entry.listeners.forEach((listener) => listener(evt));
}

/**
 * Force the media-query match state used by auto platform detection, and notify
 * any subscribed listeners so components re-render. Pass `null` to reset to PC.
 */
export function setViewportMatch(matches: boolean | null, query = '(max-width: 767px)') {
  emit(query, matches ?? false);
}
