import { useEffect, useState } from 'react';

/**
 * Full-viewport loading screen shown for 1.2 s on first visit per browser session.
 * Uses sessionStorage so it only appears once — not on every navigate.
 * Animation sequence:
 *   0 ms       → screen mounts, logo fades in
 *   800 ms     → logo fully visible, hold
 *   1000 ms    → sweep-out begins (slides up off-screen)
 *   1350 ms    → animation done, component unmounts from DOM
 */
const HOLD_MS = 1000;     // when sweep-out starts
const SWEEP_MS = 350;     // duration of the upward sweep

export default function LoadingScreen() {
  const [phase, setPhase] = useState('idle'); // idle | visible | sweeping | done

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem('portfolio_loaded')) {
      setPhase('done');
      return;
    }

    // Tick through animation phases
    setPhase('visible');

    const sweepTimer = setTimeout(() => setPhase('sweeping'), HOLD_MS);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem('portfolio_loaded', '1');
      setPhase('done');
    }, HOLD_MS + SWEEP_MS);

    return () => {
      clearTimeout(sweepTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') return null;

  const isSweeping = phase === 'sweeping';

  return (
    <>
      <style>{`
        @keyframes ls-logo-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ls-bar-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: '#090b14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          // Sweep upward when done
          transform: isSweeping ? 'translateY(-100%)' : 'translateY(0)',
          transition: isSweeping ? `transform ${SWEEP_MS}ms cubic-bezier(0.76, 0, 0.24, 1)` : 'none',
          pointerEvents: isSweeping ? 'none' : 'all',
        }}
      >
        {/* "JS." watermark logo — fades and rises in */}
        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '3rem',
            fontWeight: 900,
            color: 'var(--ink-100, #f6f4ef)',
            letterSpacing: '-0.02em',
            margin: 0,
            animation: 'ls-logo-in 0.55s cubic-bezier(0.22,1,0.36,1) forwards',
            opacity: 0,
          }}
        >
          JS<span style={{ color: 'var(--accent, #00FFB2)' }}>.</span>
        </p>

        {/* Slim progress bar */}
        <div
          style={{
            width: 100,
            height: 1,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'var(--accent, #00FFB2)',
              borderRadius: 1,
              animation: `ls-bar-fill ${HOLD_MS}ms cubic-bezier(0.22,1,0.36,1) forwards`,
            }}
          />
        </div>
      </div>
    </>
  );
}
