import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { canUseDOM } from '@/utils/ssr';

export interface PortalProps {
  children: ReactNode;
  /** Render target; defaults to document.body. */
  container?: HTMLElement;
}

/**
 * Render children into a DOM node outside the current tree (default: body).
 *
 * SSR-safe: renders nothing on the server / before mount, so overlay markup is
 * never serialized into SSR HTML (overlays only open post-interaction anyway).
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !canUseDOM) return null;
  const target = container ?? document.body;
  return createPortal(children, target);
}
