import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const cursorAllowed =
      window.matchMedia('(pointer:fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!cursorAllowed) {
      dot.style.display = 'none';
      return;
    }

    const move = (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const expand = () => dot.classList.add('expanded');
    const shrink = () => dot.classList.remove('expanded');

    const attachHoverListeners = (el) => {
      el.addEventListener('mouseenter', expand);
      el.addEventListener('mouseleave', shrink);
    };

    const detachHoverListeners = (el) => {
      el.removeEventListener('mouseenter', expand);
      el.removeEventListener('mouseleave', shrink);
    };

    const bindAll = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(attachHoverListeners);
    };

    const unbindAll = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(detachHoverListeners);
    };

    window.addEventListener('mousemove', move, { passive: true });
    bindAll();

    const obs = new MutationObserver(() => {
      unbindAll();
      bindAll();
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      obs.disconnect();
      unbindAll();
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
