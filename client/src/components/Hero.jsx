import { useEffect, useMemo, useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const ROLES = [
  'Full-Stack Developer',
  'CS Student @ UWinnipeg',
  'AI Integration Enthusiast',
  'Open to Internships',
  'React · Node · Postgres',
];

export default function Hero() {
  const mountRef = useRef(null);
  const typed = useTypewriter(ROLES);
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
      const positions = Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 190,
        y: (Math.random() - 0.5) * 120,
        z: (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
      }));

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

      const linePairs = [];
      for (let i = 0; i < COUNT; i += 1) {
        for (let j = i + 1; j < COUNT; j += 1) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < 34) {
            linePairs.push(
              positions[i].x,
              positions[i].y,
              positions[i].z,
              positions[j].x,
              positions[j].y,
              positions[j].z
            );
          }
        }
      }

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePairs), 3));
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

      cleanupScroll = () => window.removeEventListener('scroll', onScroll);
      cleanupResize = () => window.removeEventListener('resize', onResize);

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      const animate = () => {
        raf = requestAnimationFrame(animate);

        if (document.hidden) return;

        const attr = geo.attributes.position;
        positions.forEach((pt, i) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          if (Math.abs(pt.x) > 95) pt.vx *= -1;
          if (Math.abs(pt.y) > 60) pt.vy *= -1;

          attr.array[i * 3] = pt.x;
          attr.array[i * 3 + 1] = pt.y;
        });
        attr.needsUpdate = true;

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

  return (
    <section id="hero" className="hero-section" aria-label="Hero">
      <div className="hero-grid" aria-hidden="true" />
      <div ref={mountRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-kicker">COMPUTER SCIENCE · UNIVERSITY OF WINNIPEG · 2026</p>

        <h1 className="hero-heading">
          <span className="hero-first-name">JEEL</span>
          <span className="hero-last-name">SOJITRA</span>
        </h1>

        <p className="hero-role" aria-live="polite">
          <span>{typed}</span>
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
