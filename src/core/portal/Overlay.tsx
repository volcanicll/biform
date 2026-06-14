import { useContext, useRef, type ReactNode, type RefObject } from 'react';
import { Portal } from './Portal';
import { PortalContext } from './PortalContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export type OverlayPlacement = 'pc-anchor' | 'mobile-bottom';
export type OverlayCloseReason = 'escape' | 'outside';

export interface OverlayProps {
  /** Whether the overlay is currently shown. */
  open: boolean;
  /** Called when the overlay should close (esc / outside-click). */
  onClose: (reason: OverlayCloseReason) => void;
  /**
   * Where the overlay sits. Picked by the PRESENTATION, not the overlay —
   * the overlay is pure plumbing (`pc-anchor` = anchored popover,
   * `mobile-bottom` = bottom sheet). Forwarded as a data attribute for styling.
   */
  placement?: OverlayPlacement;
  /** Lock body scroll while open. Default true. */
  lockScroll?: boolean;
  /** Trap focus within the overlay (WAI-ARIA dialog). Default true. */
  trapFocus?: boolean;
  /** Restore focus to the previously-focused element on close. Default true. */
  returnFocus?: boolean;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
  /** Close on outside click. Default true. */
  closeOnOutside?: boolean;
  /** Refs treated as "inside" for outside-click (e.g. the trigger + content). */
  outsideRefs?: ReadonlyArray<RefObject<HTMLElement | null>>;
  /** Extra className applied to the overlay wrapper. */
  className?: string;
  children: ReactNode;
}

/**
 * Shared overlay primitive: portal + click-outside + escape + scroll-lock +
 * focus-trap. Both the PC dropdown and the mobile bottom-sheet render their
 * content through this; only placement + markup differ.
 *
 * The overlay itself is platform-agnostic — it does not decide PC vs mobile.
 */
export function Overlay({
  open,
  onClose,
  placement = 'pc-anchor',
  lockScroll = true,
  trapFocus = true,
  returnFocus = true,
  closeOnEscape = true,
  closeOnOutside = true,
  outsideRefs = [],
  className,
  children,
}: OverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const ctx = useContext(PortalContext);
  const doc = ctx?.doc ?? document;

  useScrollLock(open && lockScroll, doc);
  useEscapeKey(() => onClose('escape'), open && closeOnEscape, doc);
  useClickOutside([...outsideRefs, contentRef], () => onClose('outside'), open && closeOnOutside, doc);
  useFocusTrap(contentRef, open && trapFocus, returnFocus, doc);

  if (!open) return null;

  return (
    <Portal>
      <div ref={contentRef} className={className} data-lib-overlay="" data-placement={placement}>
        {children}
      </div>
    </Portal>
  );
}
