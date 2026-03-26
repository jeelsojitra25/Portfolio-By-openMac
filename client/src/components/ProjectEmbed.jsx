/**
 * ProjectEmbed — Secure sandboxed iframe for live project demos.
 *
 * Security decisions:
 *
 * 1. sandbox="allow-scripts allow-same-origin allow-forms"
 *    — allow-scripts   : needed for most live demos to function.
 *    — allow-same-origin: required so the demo's own fetch/XHR works.
 *    — allow-forms     : permits form submissions inside the demo.
 *    — DELIBERATELY OMITTED:
 *      • allow-top-navigation  — would let the iframe navigate the parent page.
 *      • allow-popups-to-escape-sandbox — would let popups break the sandbox.
 *      • allow-modals          — prevents alert/confirm/prompt dialogs.
 *
 * 2. referrerpolicy="no-referrer"
 *    Prevents the Referer header from being sent to the embedded origin,
 *    hiding the portfolio URL from third-party demo servers.
 *
 * 3. loading="lazy"
 *    Defers network requests until the iframe scrolls into the viewport,
 *    improving page performance and reducing bandwidth waste.
 *
 * 4. CSP recommendation for the parent page (add to <head> or server headers):
 *    Content-Security-Policy: frame-src https://applymate.onrender.com https://yourotherdemo.com;
 *    Using frame-src (or child-src) restricts which origins can be framed,
 *    providing a server-enforced allowlist independent of the sandbox attribute.
 *    Never use frame-src * — enumerate only the origins you control.
 *
 * 5. src validation
 *    The component validates that src begins with https:// so a misconfigured
 *    placeholder (e.g. "#") or an http:// origin never reaches the iframe.
 *    Plain "http://" embeds would be blocked by mixed-content rules in prod
 *    anyway, but rejecting early gives a clear developer-facing warning.
 */

import { useMemo } from 'react';

// ─── Prop Types ────────────────────────────────────────────────────────────────
/**
 * @param {object}  props
 * @param {string}  props.src          — HTTPS URL of the live demo.
 * @param {string}  props.title        — Accessible label for the iframe.
 * @param {number}  [props.height=600] — Height in pixels.
 * @param {boolean} [props.allowDemos=true] — Gates whether to render at all.
 */
export default function ProjectEmbed({ src, title, height = 600, allowDemos = true }) {
  // ── Determine which state to render ─────────────────────────────────────────
  const isValidSrc = useMemo(
    () => typeof src === 'string' && src.startsWith('https://'),
    [src]
  );

  const showPlaceholder = !allowDemos || !isValidSrc;

  // ── Styles (inline to keep the component self-contained) ─────────────────────
  const wrapperStyle = {
    position: 'relative',
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
  };

  const iframeStyle = {
    display: 'block',
    width: '100%',
    height: `${height}px`,
    border: 'none',
  };

  const bannerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 1rem',
    background: 'rgba(0,0,0,0.55)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontFamily: '"DM Mono", monospace',
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.45)',
    gap: '0.75rem',
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  };

  const dotStyle = {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#00FFB2',
    flexShrink: 0,
  };

  const linkStyle = {
    color: '#00FFB2',
    textDecoration: 'none',
    fontFamily: '"DM Mono", monospace',
    fontSize: '0.72rem',
    whiteSpace: 'nowrap',
  };

  const placeholderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: `${height}px`,
    gap: '0.75rem',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: '"DM Mono", monospace',
    fontSize: '0.85rem',
  };

  // ── Placeholder branch ────────────────────────────────────────────────────────
  if (showPlaceholder) {
    return (
      <div style={wrapperStyle} aria-label={`${title} — demo placeholder`}>
        <div style={placeholderStyle}>
          {/* Simple SVG monitor icon — no external asset needed */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          <span>Demo coming soon</span>
          {/* Provide an external link even when the iframe is suppressed,
              so users can always reach the project directly. */}
          {isValidSrc && (
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Open {title} in new tab
            </a>
          )}
        </div>
      </div>
    );
  }

  // ── Live iframe branch ────────────────────────────────────────────────────────
  return (
    <div style={wrapperStyle}>
      {/* Security notice + "Open in new tab" fallback — always visible */}
      <div style={bannerStyle} role="note" aria-label="Security information">
        <span style={badgeStyle}>
          <span style={dotStyle} aria-hidden="true" />
          Live demo running in sandboxed iframe
        </span>
        {/*
          Fallback link: shown unconditionally so visitors whose browsers block
          iframes (e.g. due to the demo's own X-Frame-Options header) can still
          reach the project. Opens in a new browsing context with no opener
          reference (rel="noopener noreferrer") to prevent reverse tabnapping.
        */}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          aria-label={`Open ${title} in new tab`}
        >
          Open in new tab ↗
        </a>
      </div>

      <iframe
        src={src}
        title={title}
        style={iframeStyle}
        height={height}
        /*
         * Minimal sandbox permissions — see file-level comment for rationale.
         * Do NOT add allow-top-navigation or allow-popups-to-escape-sandbox.
         */
        sandbox="allow-scripts allow-same-origin allow-forms"
        /*
         * Suppress the Referer header so the demo server does not learn
         * the visitor came from this portfolio URL.
         */
        referrerPolicy="no-referrer"
        /*
         * Lazy-load: the browser only fetches the iframe when it is about
         * to enter the viewport, keeping initial page load fast.
         */
        loading="lazy"
      />
    </div>
  );
}
