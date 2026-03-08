import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let x = 0, y = 0;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.left = x + 'px';
      dot.style.top  = y + 'px';
    };

    const expand = () => dot.classList.add('expanded');
    const shrink = () => dot.classList.remove('expanded');

    window.addEventListener('mousemove', move, { passive: true });
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', expand);
      el.addEventListener('mouseleave', shrink);
    });

    // Re-bind on DOM changes via MutationObserver
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', expand);
        el.addEventListener('mouseleave', shrink);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      obs.disconnect();
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
