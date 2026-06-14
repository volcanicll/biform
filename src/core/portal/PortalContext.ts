import { createContext } from 'react';

/**
 * The document + portal target a tree renders into.
 *
 * Defaults to the main `document` / `document.body`. The Storybook mobile device
 * frame overrides this with the inner iframe's document so overlays (Select
 * dropdown, bottom sheet, focus trap, scroll lock) stay scoped to the simulated
 * device instead of escaping to the outer canvas.
 */
export interface PortalContainer {
  doc: Document;
  container: HTMLElement;
}

export const PortalContext = createContext<PortalContainer | null>(null);
