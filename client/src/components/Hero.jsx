import { useEffect, useRef } from 'react';
import * as THREE from 'three';
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

  useEffect(() => {
    const W = window.innerWidth, H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current?.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 80;

    const COUNT = 100;
    const positions = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 120,
      z: (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 0.03,
      vy: (Math.random() - 0.5) * 0.03,
    }));

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    positions.forEach((p, i) => { pos[i*3]=p.x; pos[i*3+1]=p.y; pos[i*3+2]=p.z; });
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x00FFB2, size: 0.7, transparent: true, opacity: 0.6 })));

    const lp = [];
    for (let i = 0; i < COUNT; i++)
      for (let j = i + 1; j < COUNT; j++) {
        const dx = positions[i].x - positions[j].x, dy = positions[i].y - positions[j].y;
        if (Math.sqrt(dx*dx + dy*dy) < 38) {
          lp.push(positions[i].x,positions[i].y,positions[i].z,positions[j].x,positions[j].y,positions[j].z);
        }
      }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3));
    scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x00FFB2, transparent: true, opacity: 0.06 })));

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const p = geo.attributes.position;
      positions.forEach((pt, i) => {
        pt.x += pt.vx; pt.y += pt.vy;
        if (Math.abs(pt.x) > 100) pt.vx *= -1;
        if (Math.abs(pt.y) > 60)  pt.vy *= -1;
        p.array[i*3] = pt.x; p.array[i*3+1] = pt.y;
      });
      p.needsUpdate = true;
      camera.position.y = -scrollY * 0.003;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="hero" style={{ position:'relative', height:'100vh', display:'flex', alignItems:'center', overflow:'hidden', background:'#030712' }} aria-label="Hero">
      <div ref={mountRef} style={{ position:'absolute', inset:0, zIndex:0 }} aria-hidden="true" />

      <div style={{ position:'relative', zIndex:1, padding:'0 8vw' }}>
        <p style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.85rem', color:'#3A4A5C', letterSpacing:'0.25em', marginBottom:'0.75rem' }}>
          COMPUTER SCIENCE · UNIVERSITY OF WINNIPEG · 2026
        </p>

        <h1 style={{ lineHeight:0.88, marginBottom:'1.75rem' }}>
          <span style={{ display:'block', fontFamily:'"Playfair Display",serif', fontSize:'clamp(4.5rem,16vw,18rem)', color:'#00FFB2', fontWeight:900 }}>
            JEEL
          </span>
          <span style={{ display:'block', fontFamily:'"Playfair Display",serif', fontSize:'clamp(3rem,11vw,13rem)', fontWeight:700, WebkitTextFillColor:'transparent', WebkitTextStroke:'2px #FF6B35', marginLeft:'8vw' }}>
            SOJITRA
          </span>
        </h1>

        {/* Typewriter */}
        <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'clamp(0.85rem,1.4vw,1.05rem)', color:'#E8EDF5', maxWidth:'480px', lineHeight:1.8, marginBottom:'2.5rem', minHeight:'2rem' }}>
          <span style={{ opacity:0.85 }}>{typed}</span>
          <span style={{ display:'inline-block', width:'2px', height:'1.1em', background:'#00FFB2', verticalAlign:'middle', marginLeft:'2px', animation:'blink 0.9s step-end infinite' }} aria-hidden="true" />
          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </p>

        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          <a href="#projects" style={pill('#00FFB2','#030712')}>See My Work</a>
          <a href="mailto:Jeelsojitra2512@gmail.com" style={pillGhost}>Get In Touch</a>
        </div>

        {/* Social row */}
        <div style={{ display:'flex', gap:'1.25rem', marginTop:'2.5rem', alignItems:'center' }}>
          {[
            { label:'GitHub',   href:'https://github.com/jeelsojitra25' },
            { label:'LinkedIn', href:'https://linkedin.com/in/jeelsojitra' },
            { label:'Email',    href:'mailto:Jeelsojitra2512@gmail.com' },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.72rem', letterSpacing:'0.08em', color:'#3A4A5C', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#00FFB2'}
              onMouseLeave={e => e.target.style.color='#3A4A5C'}
            >{label}</a>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position:'absolute', bottom:'2rem', right:'8vw', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem' }}>
        <span style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.65rem', letterSpacing:'0.2em', color:'#3A4A5C', writingMode:'vertical-rl' }}>SCROLL</span>
        <div style={{ width:1, height:48, background:'linear-gradient(to bottom, #3A4A5C, transparent)' }} />
      </div>
    </section>
  );
}

const pill = (bg, color) => ({
  fontFamily:'"DM Mono",monospace', fontSize:'0.85rem', letterSpacing:'0.05em',
  padding:'0.75rem 1.75rem', borderRadius:'999px',
  background: bg, color, fontWeight:500, textDecoration:'none',
  transition:'transform 0.2s, box-shadow 0.2s',
});
const pillGhost = {
  fontFamily:'"DM Mono",monospace', fontSize:'0.85rem', letterSpacing:'0.05em',
  padding:'0.75rem 1.75rem', borderRadius:'999px',
  background:'transparent', color:'#00FFB2', fontWeight:500, textDecoration:'none',
  border:'1.5px solid rgba(0,255,178,0.4)', transition:'transform 0.2s',
};
