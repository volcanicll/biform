import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { PlatformProvider } from '../src/core/platform';
import { PortalContext } from '../src/core/portal';

const STYLE_MARK = 'data-cc-frame-style';

/** A stable signature for a stylesheet node, used to detect changes. */
function styleSignature(node: Element): string {
  const tag = node.tagName;
  if (tag === 'LINK') return `link:${node.getAttribute('href') ?? ''}`;
  return `style:${node.textContent ?? ''}`;
}

/**
 * Mirror the canvas document's stylesheets into the iframe document.
 *
 * Incremental and idempotent: sheets already mirrored (by signature) are left
 * alone, only new/changed sheets are cloned, and mirrors whose source vanished
 * are removed. This avoids the FOUC/flash that a full teardown+rebuild would
 * cause on every HMR-triggered head mutation.
 */
function syncStyles(srcDoc: Document, destDoc: Document): void {
  const sources = new Map<string, Element>();
  srcDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    sources.set(styleSignature(node), node);
  });

  // Remove mirrors whose source no longer exists.
  destDoc.querySelectorAll(`[${STYLE_MARK}]`).forEach((mirror) => {
    if (!sources.has(styleSignature(mirror))) mirror.remove();
  });

  // Track what's already mirrored so we don't re-clone / re-append.
  const existing = new Set<string>();
  destDoc.querySelectorAll(`[${STYLE_MARK}]`).forEach((mirror) => {
    existing.add(styleSignature(mirror));
  });

  sources.forEach((node, sig) => {
    if (existing.has(sig)) return;
    const clone = node.cloneNode(true) as HTMLElement;
    clone.setAttribute(STYLE_MARK, '');
    destDoc.head.appendChild(clone);
  });
}

export interface MobileFrameProps {
  children: ReactNode;
  /** Logical device width in px (iPhone-ish default). */
  width?: number;
  height?: number;
}

/**
 * A real `<iframe>` rendered as a phone mockup.
 *
 * Rendering the story inside an isolated document means overlays (Select
 * bottom-sheet, focus trap, scroll lock) are scoped to the device — they no
 * longer escape to the outer canvas. Stylesheets are mirrored from the canvas
 * (and kept in sync on HMR) so the components look identical.
 *
 * `platform` is forced to `mobile` here (the parent window is always desktop,
 * so auto-detection via `matchMedia` would resolve to PC).
 */
export function MobileFrame({ children, width = 390, height = 780 }: MobileFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [doc, setDoc] = useState<Document | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const init = () => {
      const innerDoc = iframe.contentDocument;
      if (!innerDoc) return;
      innerDoc.documentElement.style.height = '100%';
      innerDoc.documentElement.style.background = '#ffffff';
      const { body: innerBody } = innerDoc;
      innerBody.style.margin = '0';
      innerBody.style.height = '100%';
      innerBody.style.overflowY = 'auto';
      innerBody.style.padding = '30px 14px 24px'; // top room for the notch / status area
      innerBody.style.boxSizing = 'border-box';
      innerBody.style.background = '#ffffff';
      innerBody.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      innerBody.style.fontSize = '14px';
      innerBody.style.color = '#1f2937';
      syncStyles(document, innerDoc);
      setDoc(innerDoc);
      setBody(innerBody);
    };

    iframe.addEventListener('load', init);
    init();

    // Mirror stylesheet changes (HMR, theme switch) into the device document.
    const observer = new MutationObserver(() => {
      if (iframe.contentDocument) syncStyles(document, iframe.contentDocument);
    });
    observer.observe(document.head, { childList: true });

    return () => {
      iframe.removeEventListener('load', init);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        display: 'inline-block',
        padding: 10,
        background: '#1f2937',
        borderRadius: 46,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width,
          height,
          background: '#ffffff',
          borderRadius: 36,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 24,
            background: '#1f2937',
            borderRadius: 14,
            zIndex: 5,
          }}
          aria-hidden
        />
        <iframe
          ref={iframeRef}
          title="mobile preview"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: '#ffffff' }}
        />
        {doc && body
          ? createPortal(
              <PortalContext.Provider value={{ doc, container: body }}>
                <PlatformProvider platform="mobile">{children}</PlatformProvider>
              </PortalContext.Provider>,
              body,
            )
          : null}
      </div>
    </div>
  );
}
