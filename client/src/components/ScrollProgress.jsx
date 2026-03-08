import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 2000,
        height: '2px',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #00FFB2, #FF6B35)',
        transition: 'width 0.1s linear',
        boxShadow: '0 0 8px rgba(0,255,178,0.6)',
        pointerEvents: 'none',
      }}
    />
  );
}
