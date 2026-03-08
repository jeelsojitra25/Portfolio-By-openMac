import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Contact',    href: '#contact' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [active, setActive]   = useState('');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        padding:'0.75rem 8vw', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(3,7,18,0.75)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s ease',
      }}
    >
      <a href="#" style={{ fontFamily:'"Playfair Display",serif', fontSize:'1.1rem', color:'#E8EDF5', textDecoration:'none', fontWeight:700 }}>
        JS<span style={{ color:'#00FFB2' }}>.</span>
      </a>
      <ul style={{ display:'flex', gap:'2rem', listStyle:'none', flexWrap:'wrap' }}>
        {LINKS.map(({ label, href }) => (
          <li key={href}>
            <a href={href} style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.78rem', color: active === href.slice(1) ? '#00FFB2' : '#E8EDF5', textDecoration:'none', letterSpacing:'0.04em', transition:'color 0.2s', opacity: active === href.slice(1) ? 1 : 0.7 }}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
