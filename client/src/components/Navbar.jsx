import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Contact',    href: '#contact' },
];

export default function Navbar() {
  const [visible,    setVisible]    = useState(false);
  const [active,     setActive]     = useState('');
  const [menuOpen,   setMenuOpen]   = useState(false);
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  // Show nav after scrolling 100px
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 100);
      // Close mobile menu on scroll
      if (window.scrollY > 10) setMenuOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  const hamburgerLineStyle = (transform) => ({
    display: 'block',
    width: '20px',
    height: '2px',
    background: '#E8EDF5',
    borderRadius: '2px',
    transition: 'transform 0.25s ease, opacity 0.25s ease',
    ...transform,
  });

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(3,7,18,0.75)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s ease',
      }}
    >
      {/* Desktop / top bar */}
      <div
        style={{
          padding: '0.75rem 8vw',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.1rem', color: '#E8EDF5', textDecoration: 'none', fontWeight: 700 }}
        >
          JS<span style={{ color: '#00FFB2' }}>.</span>
        </a>

        {/* Desktop nav links */}
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', flexWrap: 'wrap', alignItems: 'center', margin: 0, padding: 0 }}
            className="nav-desktop-links">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                style={{
                  fontFamily: '"DM Mono",monospace', fontSize: '0.78rem',
                  color: active === href.slice(1) ? '#00FFB2' : '#E8EDF5',
                  textDecoration: 'none', letterSpacing: '0.04em',
                  transition: 'color 0.2s',
                  opacity: active === href.slice(1) ? 1 : 0.7,
                }}
              >
                {label}
              </a>
            </li>
          ))}
          {/* Resume button — desktop */}
          <li>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"DM Mono",monospace', fontSize: '0.75rem',
                color: '#00FFB2', textDecoration: 'none', letterSpacing: '0.06em',
                border: '1px solid rgba(0,255,178,0.5)', borderRadius: '5px',
                padding: '0.3rem 0.85rem',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,255,178,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Resume
            </a>
          </li>

          {/* Theme toggle — desktop */}
          <li>
            <button
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              style={{
                background: 'none',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'}`,
                borderRadius: '8px',
                padding: '0.28rem 0.55rem',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: 1,
                color: 'var(--ink-100)',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isDark ? '\u2609' : '\u263D'}
            </button>
          </li>
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
          style={{
            display: 'none',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
            flexDirection: 'column', gap: '5px',
          }}
          className="nav-hamburger"
        >
          <span style={hamburgerLineStyle(menuOpen ? { transform: 'translateY(7px) rotate(45deg)' } : {})} />
          <span style={hamburgerLineStyle(menuOpen ? { opacity: 0 } : {})} />
          <span style={hamburgerLineStyle(menuOpen ? { transform: 'translateY(-7px) rotate(-45deg)' } : {})} />
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: menuOpen ? '400px' : '0',
          transition: 'max-height 0.3s ease',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
        className="nav-mobile-menu"
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: '0.75rem 8vw 1.25rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={handleLinkClick}
                style={{
                  display: 'block',
                  fontFamily: '"DM Mono",monospace', fontSize: '0.9rem',
                  color: active === href.slice(1) ? '#00FFB2' : '#E8EDF5',
                  textDecoration: 'none', letterSpacing: '0.04em',
                  padding: '0.65rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  opacity: active === href.slice(1) ? 1 : 0.75,
                }}
              >
                {label}
              </a>
            </li>
          ))}
          {/* Resume — mobile */}
          <li style={{ marginTop: '1rem' }}>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              style={{
                display: 'inline-block',
                fontFamily: '"DM Mono",monospace', fontSize: '0.85rem',
                color: '#00FFB2', textDecoration: 'none', letterSpacing: '0.06em',
                border: '1px solid rgba(0,255,178,0.5)', borderRadius: '5px',
                padding: '0.45rem 1.2rem',
              }}
            >
              Resume
            </a>
          </li>
        </ul>
      </div>

      {/* Responsive styles injected via a style tag */}
      <style>{`
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger     { display: flex !important; }
          .nav-mobile-menu   { display: block; }
        }
        @media (min-width: 768px) {
          .nav-hamburger   { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
