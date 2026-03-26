/**
 * SkillSphere — Three.js rotating tag-cloud sphere.
 *
 * Skills rendered as canvas-texture THREE.Sprite objects distributed across a
 * sphere using the Fibonacci / golden-angle algorithm for even spacing.
 *
 * Interactions:
 *   - Auto-rotates on Y axis
 *   - Mouse drag rotates on both axes
 *   - Hover: sprite scales up 1.2× and glows teal; tooltip appears
 *
 * Graceful fallback: if WebGL is unavailable, a flat flex-wrap tag list renders.
 */

import { useEffect, useRef, useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';

// ---------------------------------------------------------------------------
// Skill metadata: name → brief tooltip note
// ---------------------------------------------------------------------------
const SKILLS = [
  { name: 'React',       note: 'UI component library for declarative interfaces' },
  { name: 'Node.js',     note: 'Server-side JavaScript runtime' },
  { name: 'PostgreSQL',  note: 'Relational database with strong ACID guarantees' },
  { name: 'Python',      note: 'Scripting, ML pipelines, and automation' },
  { name: 'Java',        note: 'OOP and Spring Boot microservices' },
  { name: 'Spring Boot', note: 'Java framework for production-grade REST APIs' },
  { name: 'Docker',      note: 'Containerization and reproducible deployments' },
  { name: 'Three.js',    note: '3D graphics on the web via WebGL' },
  { name: 'TypeScript',  note: 'Typed superset of JavaScript' },
  { name: 'Express',     note: 'Lightweight Node.js web framework' },
  { name: 'Redis',       note: 'In-memory data store for caching and pub/sub' },
  { name: 'Git',         note: 'Version control and collaborative workflows' },
  { name: 'TailwindCSS', note: 'Utility-first CSS for rapid UI building' },
  { name: 'Vite',        note: 'Next-generation frontend build tooling' },
  { name: 'REST APIs',   note: 'Stateless HTTP service design' },
  { name: 'JWT',         note: 'Stateless authentication tokens' },
  { name: 'Groq AI',     note: 'Ultra-fast LLM inference API' },
  { name: 'Claude AI',   note: 'Anthropic\'s AI assistant API integration' },
  { name: 'SQL',         note: 'Querying and modeling relational data' },
  { name: 'Linux',       note: 'Shell scripting and server administration' },
];

// ---------------------------------------------------------------------------
// Detect WebGL support
// ---------------------------------------------------------------------------
function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Build a canvas-texture sprite for a given skill label.
// Returns a THREE.Sprite with userData.name and userData.note set.
// ---------------------------------------------------------------------------
function createTagSprite(THREE, skill, isHighlighted = false) {
  const canvas = document.createElement('canvas');
  const dpr    = Math.min(window.devicePixelRatio, 2);
  const W      = 256;
  const H      = 64;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Background pill
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = isHighlighted ? 'rgba(20,184,166,0.22)' : 'rgba(255,255,255,0.07)';
  ctx.strokeStyle = isHighlighted ? '#14b8a6' : 'rgba(255,255,255,0.18)';
  ctx.lineWidth = isHighlighted ? 2 : 1;
  const r = 12;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(W - r, 0);
  ctx.quadraticCurveTo(W, 0, W, r);
  ctx.lineTo(W, H - r);
  ctx.quadraticCurveTo(W, H, W - r, H);
  ctx.lineTo(r, H);
  ctx.quadraticCurveTo(0, H, 0, H - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Label text
  ctx.fillStyle = isHighlighted ? '#14b8a6' : '#e2e8f0';
  ctx.font = `${isHighlighted ? 'bold ' : ''}15px "DM Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isHighlighted) {
    ctx.shadowColor = '#14b8a6';
    ctx.shadowBlur  = 12;
  }

  ctx.fillText(skill.name, W / 2, H / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.6, 0.4, 1);
  sprite.userData = { name: skill.name, note: skill.note };
  return sprite;
}

// ---------------------------------------------------------------------------
// Fibonacci sphere: evenly distribute n points on a unit sphere surface.
// Returns array of {x, y, z}.
// ---------------------------------------------------------------------------
function fibonacciSphere(n, radius) {
  const points = [];
  const goldenAngle = Math.PI * (1 + Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / n);
    const theta = goldenAngle * i;
    points.push({
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SkillSphere() {
  const [sectionRef, visible] = useIntersection(0.1);
  const mountRef    = useRef(null);
  const frameRef    = useRef(null);
  const sceneRef    = useRef(null); // holds { sprites, scene }

  const [webglOk, setWebglOk]   = useState(true);
  const [tooltip, setTooltip]   = useState(null); // { name, note, x, y }
  const [hoveredName, setHoveredName] = useState(null);

  // Drag state (plain refs — no re-render needed)
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0, rotX: 0, rotY: 0 });

  useEffect(() => {
    if (!visible) return;
    if (!hasWebGL()) { setWebglOk(false); return; }
    if (!mountRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isMounted = true;

    const init = async () => {
      const THREE = await import('three');
      if (!isMounted || !mountRef.current) return;

      const container = mountRef.current;
      const W = container.clientWidth;
      const H = 420;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      container.appendChild(renderer.domElement);

      // Scene & Camera
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
      camera.position.z = 5.5;

      // Wireframe shell
      const shellGeo  = new THREE.SphereGeometry(2.3, 28, 18);
      const shellWire = new THREE.WireframeGeometry(shellGeo);
      scene.add(
        new THREE.LineSegments(
          shellWire,
          new THREE.LineBasicMaterial({
            color: 0x14b8a6,
            transparent: true,
            opacity: 0.05,
          })
        )
      );

      // Distribute sprites using Fibonacci sphere
      const positions = fibonacciSphere(SKILLS.length, 2.2);
      const sprites   = [];

      SKILLS.forEach((skill, i) => {
        const sprite = createTagSprite(THREE, skill, false);
        sprite.position.set(positions[i].x, positions[i].y, positions[i].z);
        scene.add(sprite);
        sprites.push(sprite);
      });

      sceneRef.current = { sprites, THREE };

      // Raycaster for hover detection
      const raycaster = new THREE.Raycaster();
      const mouse     = new THREE.Vector2(-999, -999);

      // ---------------------------------------------------------------------------
      // Event handlers
      // ---------------------------------------------------------------------------
      const onMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const nx   = ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
        const ny   = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
        mouse.set(nx, ny);

        // Drag
        if (dragRef.current.active) {
          const dx = e.clientX - dragRef.current.lastX;
          const dy = e.clientY - dragRef.current.lastY;
          dragRef.current.rotY += dx * 0.005;
          dragRef.current.rotX += dy * 0.005;
          dragRef.current.lastX = e.clientX;
          dragRef.current.lastY = e.clientY;
        }
      };

      const onMouseDown = (e) => {
        dragRef.current.active = true;
        dragRef.current.lastX  = e.clientX;
        dragRef.current.lastY  = e.clientY;
        container.style.cursor = 'grabbing';
      };

      const onMouseUp = () => {
        dragRef.current.active = false;
        container.style.cursor = 'grab';
      };

      const onMouseLeave = () => {
        mouse.set(-999, -999);
        dragRef.current.active = false;
        container.style.cursor = 'grab';
        setTooltip(null);
        setHoveredName(null);
      };

      container.addEventListener('mousemove', onMouseMove, { passive: true });
      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('mouseup',   onMouseUp);
      container.addEventListener('mouseleave', onMouseLeave);

      // Resize
      const onResize = () => {
        const nW = container.clientWidth;
        camera.aspect = nW / H;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, H);
      };
      window.addEventListener('resize', onResize);

      // ---------------------------------------------------------------------------
      // Animation loop
      // ---------------------------------------------------------------------------
      let autoRotY = 0;
      let prevHovered = null;

      const animate = () => {
        if (!isMounted) return;
        frameRef.current = requestAnimationFrame(animate);

        if (document.hidden) return;

        // Auto-rotate
        if (!prefersReduced) {
          autoRotY += 0.003;
        }

        scene.rotation.y = autoRotY + dragRef.current.rotY;
        scene.rotation.x = dragRef.current.rotX;

        // Hover detection
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(sprites);
        const hitSprite = hits.length > 0 ? hits[0].object : null;

        if (hitSprite !== prevHovered) {
          // Reset previous
          if (prevHovered) {
            const prevSkill = SKILLS.find((s) => s.name === prevHovered.userData.name);
            if (prevSkill) {
              const fresh = createTagSprite(THREE, prevSkill, false);
              prevHovered.material.map = fresh.material.map;
              prevHovered.material.needsUpdate = true;
              prevHovered.scale.set(1.6, 0.4, 1);
            }
          }

          if (hitSprite) {
            // Highlight new
            const skill = SKILLS.find((s) => s.name === hitSprite.userData.name);
            if (skill) {
              const highlighted = createTagSprite(THREE, skill, true);
              hitSprite.material.map = highlighted.material.map;
              hitSprite.material.needsUpdate = true;
              hitSprite.scale.set(1.6 * 1.2, 0.4 * 1.2, 1);
              setHoveredName(skill.name);
              // Project sprite position to screen for tooltip placement
              const projected = hitSprite.position.clone().project(camera);
              const rect = container.getBoundingClientRect();
              const tx = ((projected.x + 1) / 2) * rect.width;
              const ty = ((-projected.y + 1) / 2) * rect.height;
              setTooltip({ name: skill.name, note: skill.note, x: tx, y: ty });
            }
          } else {
            setTooltip(null);
            setHoveredName(null);
          }

          prevHovered = hitSprite;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Return cleanup
      return () => {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('mouseup',   onMouseUp);
        container.removeEventListener('mouseleave', onMouseLeave);
        window.removeEventListener('resize', onResize);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        renderer.dispose();
        const canvas = renderer.domElement;
        if (container.contains(canvas)) container.removeChild(canvas);
      };
    };

    let cleanup = () => {};
    init().then((fn) => { if (fn) cleanup = fn; });

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [visible]);

  return (
    <section
      id="skill-sphere"
      ref={sectionRef}
      style={{
        padding: '8rem 8vw',
        background: 'var(--bg-800, #030712)',
      }}
      aria-label="Tech Universe — 3D Skill Sphere"
    >
      {/* Heading */}
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: 'var(--ink-100, #E8EDF5)',
          marginBottom: '0.5rem',
        }}
      >
        Tech <span style={{ color: 'var(--accent, #14b8a6)' }}>Universe</span>
      </h2>
      <p
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.82rem',
          color: 'var(--ink-500, #6b7280)',
          marginBottom: '2.5rem',
          letterSpacing: '0.04em',
        }}
      >
        {webglOk
          ? 'Drag to spin — hover a tag to learn more about each technology.'
          : 'Technologies I work with daily.'}
      </p>

      {/* 3D canvas mount + tooltip overlay */}
      {webglOk && (
        <div
          style={{ position: 'relative', width: '100%', maxWidth: '900px' }}
        >
          {/* Three.js mount point */}
          <div
            ref={mountRef}
            style={{
              width: '100%',
              height: '420px',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'grab',
              border: '1px solid rgba(20,184,166,0.08)',
            }}
            aria-hidden="true"
          />

          {/* Tooltip */}
          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: Math.min(tooltip.x + 12, 620),
                top: Math.max(tooltip.y - 48, 8),
                background: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(20,184,166,0.4)',
                borderRadius: '8px',
                padding: '0.55rem 0.9rem',
                pointerEvents: 'none',
                zIndex: 10,
                maxWidth: '220px',
                boxShadow: '0 0 18px rgba(20,184,166,0.2)',
              }}
            >
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '0.75rem',
                  color: '#14b8a6',
                  fontWeight: '600',
                  marginBottom: '0.2rem',
                }}
              >
                {tooltip.name}
              </p>
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '0.68rem',
                  color: '#9ca3af',
                  lineHeight: '1.4',
                }}
              >
                {tooltip.note}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Flat tag fallback — always rendered for screen readers and no-WebGL */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginTop: webglOk ? '1.5rem' : '0',
        }}
        aria-label="Skill tags"
        // Hide from sighted users when 3D is active (they use the sphere)
        aria-hidden={webglOk ? 'true' : undefined}
      >
        {SKILLS.map(({ name }, i) => (
          <span
            key={name}
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.72rem',
              color:
                name === hoveredName
                  ? '#14b8a6'
                  : i % 5 === 0
                  ? 'var(--accent, #14b8a6)'
                  : 'var(--ink-300, #d1d5db)',
              background: 'var(--glass, rgba(255,255,255,0.05))',
              border: `1px solid ${
                name === hoveredName
                  ? 'rgba(20,184,166,0.5)'
                  : 'rgba(255,255,255,0.07)'
              }`,
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
