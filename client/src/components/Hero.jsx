import { useEffect, useMemo, useRef, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

// Mouse state shared across the animation loop (not React state — no re-renders needed)
const mouse = { x: 0, y: 0, active: false };

const ROLES = [
  'Full-Stack Developer',
  'CS Student @ UWinnipeg',
  'AI Integration Enthusiast',
  'Open to Internships',
  'React · Node · Postgres',
];

// Per-role accent colors matched by index to ROLES array
const ROLE_COLORS = [
  '#14b8a6', // Full-Stack Developer  → teal
  '#3b82f6', // CS Student            → blue
  '#a855f7', // AI Integration        → purple
  '#f97316', // Open to Internships   → orange
  '#14b8a6', // React · Node · Postgres → teal
];

export default function Hero() {
  const mountRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const parallaxRaf = useRef(null);
  const parallaxTarget = useRef({ x: 0, y: 0 });
  const parallaxCurrent = useRef({ x: 0, y: 0 });

  const { displayed, currentIndex } = useTypewriter(ROLES);
  const roleColor = ROLE_COLORS[currentIndex] ?? '#14b8a6';

  // Brief opacity flicker when switching roles so color change feels like a fade swap
  const [roleVisible, setRoleVisible] = useState(true);
  const prevIndexRef = useRef(currentIndex);
  useEffect(() => {
    if (currentIndex !== prevIndexRef.current) {
      prevIndexRef.current = currentIndex;
      setRoleVisible(false);
      const t = setTimeout(() => setRoleVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, [currentIndex]);

  const socialLinks = useMemo(
    () => [
      { label: 'GitHub', href: 'https://github.com/jeelsojitra25' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/jeelsojitra' },
      { label: 'Email', href: 'mailto:Jeelsojitra2512@gmail.com' },
    ],
    []
  );

  useEffect(() => {
    let renderer;
    let raf;
    let cleanupScroll = () => {};
    let cleanupResize = () => {};
    let cleanupMouse = () => {};
    let cleanupMouseLeave = () => {};

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth < 768;

    if (prefersReducedMotion || isSmallScreen) {
      return () => {
        cleanupScroll();
        cleanupResize();
        if (raf) cancelAnimationFrame(raf);
        if (renderer) renderer.dispose();
      };
    }

    let isMounted = true;

    const init = async () => {
      const THREE = await import('three');
      if (!isMounted || !mountRef.current) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      mountRef.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 80;

      const COUNT = window.innerWidth > 1400 ? 90 : 65;
      const positions = Array.from({ length: COUNT }, () => {
        const ox = (Math.random() - 0.5) * 190;
        const oy = (Math.random() - 0.5) * 120;
        return {
          x: ox,
          y: oy,
          z: (Math.random() - 0.5) * 50,
          ox,      // original x — spring target
          oy,      // original y — spring target
          vx: (Math.random() - 0.5) * 0.03,
          vy: (Math.random() - 0.5) * 0.03,
        };
      });

      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(COUNT * 3);
      positions.forEach((p, i) => {
        pos[i * 3] = p.x;
        pos[i * 3 + 1] = p.y;
        pos[i * 3 + 2] = p.z;
      });
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const points = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: 0xffaf61,
          size: 0.75,
          transparent: true,
          opacity: 0.5,
        })
      );
      scene.add(points);

      // Pre-allocate a large buffer for dynamic line drawing (max possible pairs = COUNT*(COUNT-1)/2)
      const MAX_LINE_VERTS = COUNT * (COUNT - 1); // each pair = 2 verts
      const lineBuffer = new Float32Array(MAX_LINE_VERTS * 3);
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineBuffer, 3));
      const lineMesh = new THREE.LineSegments(
        lineGeometry,
        new THREE.LineBasicMaterial({ color: 0xffaf61, transparent: true, opacity: 0.08 })
      );
      scene.add(lineMesh);

      let scrollY = 0;
      const onScroll = () => {
        scrollY = window.scrollY;
      };
      const onResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      // Convert screen-space mouse coords to Three.js world-space units.
      // Camera is at z=80 with FOV 60 — at z=0 plane: visible half-height = tan(30deg)*80 ≈ 46.19
      const onMouseMove = (e) => {
        const hw = window.innerWidth / 2;
        const hh = window.innerHeight / 2;
        const aspect = window.innerWidth / window.innerHeight;
        const visibleH = Math.tan((60 / 2) * (Math.PI / 180)) * 80;
        const visibleW = visibleH * aspect;
        mouse.x = ((e.clientX - hw) / hw) * visibleW;
        mouse.y = -((e.clientY - hh) / hh) * visibleH;
        mouse.active = true;
      };
      const onMouseLeave = () => { mouse.active = false; };

      cleanupScroll = () => window.removeEventListener('scroll', onScroll);
      cleanupResize = () => window.removeEventListener('resize', onResize);
      cleanupMouse = () => window.removeEventListener('mousemove', onMouseMove);
      cleanupMouseLeave = () => window.removeEventListener('mouseleave', onMouseLeave);

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave);

      const animate = () => {
        raf = requestAnimationFrame(animate);

        if (document.hidden) return;

        const attr = geo.attributes.position;
        const REPULSE_RADIUS = 120;   // world-space units (~px equivalent at this camera distance)
        const REPULSE_STRENGTH = 0.28;
        const SPRING_STIFFNESS = 0.04; // lerp factor toward origin when mouse is away

        positions.forEach((pt, i) => {
          if (mouse.active) {
            const dx = pt.x - mouse.x;
            const dy = pt.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < REPULSE_RADIUS && dist > 0.01) {
              // Force proportional to 1/distance, capped so close particles don't fly off-screen
              const force = Math.min(REPULSE_STRENGTH * (REPULSE_RADIUS / dist), 3.5);
              pt.vx += (dx / dist) * force;
              pt.vy += (dy / dist) * force;
            }
          } else {
            // Spring back toward original position
            pt.vx += (pt.ox - pt.x) * SPRING_STIFFNESS;
            pt.vy += (pt.oy - pt.y) * SPRING_STIFFNESS;
          }

          // Dampen velocity so particles settle
          pt.vx *= 0.88;
          pt.vy *= 0.88;

          pt.x += pt.vx;
          pt.y += pt.vy;

          // Soft boundary bounce
          if (Math.abs(pt.x) > 95) { pt.vx *= -0.6; pt.x = Math.sign(pt.x) * 95; }
          if (Math.abs(pt.y) > 60) { pt.vy *= -0.6; pt.y = Math.sign(pt.y) * 60; }

          attr.array[i * 3] = pt.x;
          attr.array[i * 3 + 1] = pt.y;
        });
        attr.needsUpdate = true;

        // Rebuild line pairs based on current particle positions
        let lineIdx = 0;
        const lineAttr = lineGeometry.attributes.position;
        for (let i = 0; i < COUNT; i += 1) {
          for (let j = i + 1; j < COUNT; j += 1) {
            const dx = positions[i].x - positions[j].x;
            const dy = positions[i].y - positions[j].y;
            if (Math.sqrt(dx * dx + dy * dy) < 34) {
              lineAttr.array[lineIdx * 3]     = positions[i].x;
              lineAttr.array[lineIdx * 3 + 1] = positions[i].y;
              lineAttr.array[lineIdx * 3 + 2] = positions[i].z;
              lineIdx += 1;
              lineAttr.array[lineIdx * 3]     = positions[j].x;
              lineAttr.array[lineIdx * 3 + 1] = positions[j].y;
              lineAttr.array[lineIdx * 3 + 2] = positions[j].z;
              lineIdx += 1;
            }
          }
        }
        // Zero out unused slots and set draw range
        lineGeometry.setDrawRange(0, lineIdx);
        lineAttr.needsUpdate = true;

        camera.position.y = -scrollY * 0.003;
        renderer.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      isMounted = false;
      cleanupScroll();
      cleanupResize();
      cleanupMouse();
      cleanupMouseLeave();
      mouse.active = false;
      if (raf) cancelAnimationFrame(raf);
      if (renderer) {
        renderer.dispose();
        const canvas = renderer.domElement;
        if (mountRef.current?.contains(canvas)) {
          mountRef.current.removeChild(canvas);
        }
      }
    };
  }, []);

  // I17 — mouse parallax depth on hero name (desktop only)
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const onMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      parallaxTarget.current = {
        x: (e.clientX - cx) / cx,   // -1 … 1
        y: (e.clientY - cy) / cy,
      };
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const tick = () => {
      // Lerp toward target for buttery smoothness
      parallaxCurrent.current.x += (parallaxTarget.current.x - parallaxCurrent.current.x) * 0.08;
      parallaxCurrent.current.y += (parallaxTarget.current.y - parallaxCurrent.current.y) * 0.08;

      const { x, y } = parallaxCurrent.current;

      if (firstNameRef.current) {
        // "JEEL" follows the mouse — 8px depth layer
        firstNameRef.current.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      }
      if (lastNameRef.current) {
        // "SOJITRA" moves opposite — 4px depth layer (creates depth illusion)
        lastNameRef.current.style.transform = `translate(${-x * 4}px, ${-y * 4}px)`;
      }

      parallaxRaf.current = requestAnimationFrame(tick);
    };

    parallaxRaf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (parallaxRaf.current) cancelAnimationFrame(parallaxRaf.current);
    };
  }, []);

  return (
    <section id="hero" className="hero-section" aria-label="Hero">
      <div className="hero-grid" aria-hidden="true" />
      <div ref={mountRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-kicker">COMPUTER SCIENCE · UNIVERSITY OF WINNIPEG · 2026</p>

        <h1 className="hero-heading">
          <span ref={firstNameRef} className="hero-first-name" style={{ display: 'block', willChange: 'transform' }}>JEEL</span>
          <span ref={lastNameRef} className="hero-last-name" style={{ display: 'block', willChange: 'transform' }}>SOJITRA</span>
        </h1>

        <p className="hero-role" aria-live="polite">
          <span
            style={{
              color: roleColor,
              opacity: roleVisible ? 1 : 0,
              transition: 'color 0.35s ease, opacity 0.18s ease',
            }}
          >
            {displayed}
          </span>
          <span className="hero-caret" aria-hidden="true" />
        </p>

        <div className="hero-cta-row">
          <a href="#projects" className="hero-btn hero-btn-solid">
            See My Work
          </a>
          <a href="mailto:Jeelsojitra2512@gmail.com" className="hero-btn hero-btn-outline">
            Get In Touch
          </a>
        </div>

        <div className="hero-social-row">
          {socialLinks.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hero-social-link">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span>SCROLL</span>
        <div />
      </div>
    </section>
  );
}
