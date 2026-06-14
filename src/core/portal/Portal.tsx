import { useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { canUseDOM } from '@/utils/ssr';
import { PortalContext } from './PortalContext';

export interface PortalProps {
  children: ReactNode;
  /** Render target; defaults to the PortalContext container, then document.body. */
  container?: HTMLElement;
}

/**
 * Render children into a DOM node outside the current tree (default: body).
 *
 * SSR-safe: renders nothing on the server / before mount, so overlay markup is
 * never serialized into SSR HTML (overlays only open post-interaction anyway).
 *
 * When a {@link PortalContext} is provided (e.g. the Storybook mobile device
 * frame), portals into that container instead of the main document.body — keeping
 * overlays scoped to the simulated device.
 */
export function Portal({ children, container }: PortalProps) {
  const ctx = useContext(PortalContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !canUseDOM) return null;
  const target = container ?? ctx?.container ?? document.body;
  return createPortal(children, target);
}
