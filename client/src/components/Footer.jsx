import { useRef, useEffect, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Confetti helper (original Easter egg — keep intact)
// ---------------------------------------------------------------------------
function spawnConfetti(el) {
  const colors = ['#00FFB2', '#FF6B35', '#E8EDF5'];
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = `left:${rect.left + rect.width / 2 + (Math.random() - 0.5) * 80}px;top:${rect.top}px;background:${colors[Math.floor(Math.random() * colors.length)]};animation-delay:${Math.random() * 0.3}s;animation-duration:${0.6 + Math.random() * 0.4}s;`;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

// ---------------------------------------------------------------------------
// Konami code sequence
// ---------------------------------------------------------------------------
const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

// ---------------------------------------------------------------------------
// Terminal modal lines
// ---------------------------------------------------------------------------
const TERMINAL_LINES = [
  { prompt: '> whoami',       delay: 0 },
  { prompt: 'Jeel Sojitra — Full-Stack Developer', delay: 600, indent: true },
  { prompt: '> skills --list', delay: 1300 },
  { prompt: 'React, Node.js, PostgreSQL, Python, Three.js, Docker', delay: 1900, indent: true },
  { prompt: '> contact',      delay: 2600 },
  { prompt: 'Available at: Jeelsojitra2512@gmail.com', delay: 3200, indent: true },
  { prompt: '> exit',         delay: 4000 },
];
const CLOSE_AFTER_EXIT_MS = 900;

// ---------------------------------------------------------------------------
// Terminal modal
// ---------------------------------------------------------------------------
function TerminalModal({ onClose }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRefs = useRef([]);

  // Reveal lines progressively
  useEffect(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    TERMINAL_LINES.forEach((line, i) => {
      const t = setTimeout(() => setVisibleCount(i + 1), line.delay);
      timerRefs.current.push(t);
    });

    // Auto-close after "exit" types out
    const closeTimer = setTimeout(
      onClose,
      TERMINAL_LINES[TERMINAL_LINES.length - 1].delay + CLOSE_AFTER_EXIT_MS
    );
    timerRefs.current.push(closeTimer);

    return () => timerRefs.current.forEach(clearTimeout);
  }, [onClose]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes terminal-cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 1em;
          vertical-align: middle;
          background: #00FF41;
          margin-left: 3px;
          animation: terminal-cursor-blink 0.9s step-end infinite;
        }
        @keyframes terminal-line-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .terminal-line {
          animation: terminal-line-in 0.18s ease forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9500,
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Terminal window — stop click propagation so clicking inside doesn't close */}
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Terminal Easter egg"
          aria-modal="true"
          style={{
            background: '#0d1117',
            border: '1px solid rgba(0,255,65,0.25)',
            borderRadius: '10px',
            width: 'min(560px, 92vw)',
            fontFamily: '"DM Mono", "Courier New", monospace',
            color: '#00FF41',
            boxShadow: '0 0 48px rgba(0,255,65,0.12), 0 24px 64px rgba(0,0,0,0.7)',
            overflow: 'hidden',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              background: '#161b22',
              borderBottom: '1px solid rgba(0,255,65,0.1)',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <span
              style={{
                marginLeft: '0.5rem',
                fontSize: '0.7rem',
                color: 'rgba(0,255,65,0.45)',
                letterSpacing: '0.1em',
              }}
            >
              jeel@portfolio ~ bash
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: '1.25rem 1.5rem 1.5rem', minHeight: '220px' }}>
            {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => (
              <div
                key={i}
                className="terminal-line"
                style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.75,
                  color: line.indent ? 'rgba(0,255,65,0.7)' : '#00FF41',
                  paddingLeft: line.indent ? '1.2rem' : '0',
                }}
              >
                {line.prompt}
              </div>
            ))}

            {/* Blinking cursor after last visible line */}
            {visibleCount < TERMINAL_LINES.length && (
              <span className="terminal-cursor" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export default function Footer() {
  const nameRef = useRef(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const konamiBuffer = useRef([]);

  // Listen for Konami code globally
  useEffect(() => {
    const onKey = (e) => {
      konamiBuffer.current.push(e.key);
      // Keep only the last N keys (length of KONAMI sequence)
      if (konamiBuffer.current.length > KONAMI.length) {
        konamiBuffer.current.shift();
      }
      if (
        konamiBuffer.current.length === KONAMI.length &&
        konamiBuffer.current.every((k, i) => k === KONAMI[i])
      ) {
        konamiBuffer.current = [];
        setShowTerminal(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeTerminal = useCallback(() => setShowTerminal(false), []);

  return (
    <>
      {showTerminal && <TerminalModal onClose={closeTerminal} />}

      <footer
        style={{
          padding: '3rem 8vw',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
        role="contentinfo"
      >
        <div>
          <p style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.25rem', color: '#E8EDF5', fontWeight: 700 }}>
            Jeel{' '}
            <span
              ref={nameRef}
              onMouseEnter={() => spawnConfetti(nameRef.current)}
              style={{ color: '#00FFB2', cursor: 'pointer', userSelect: 'none' }}
              title="Made with care"
            >
              Sojitra
            </span>
          </p>
          <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.68rem', color: '#3A4A5C', marginTop: '0.3rem' }}>
            © {new Date().getFullYear()} · Winnipeg, MB · Open to opportunities
          </p>
        </div>

        <nav aria-label="Footer links">
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub',   href: 'https://github.com/jeelsojitra25' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/jeelsojitra' },
              { label: 'Email',    href: 'mailto:Jeelsojitra2512@gmail.com' },
              { label: 'Website',  href: 'https://jeelsojitra.tech' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.75rem', color: '#3A4A5C', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.target.style.color = '#00FFB2')}
                  onMouseLeave={e => (e.target.style.color = '#3A4A5C')}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </>
  );
}
