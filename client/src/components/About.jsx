import { useIntersection } from '../hooks/useIntersection';

export default function About() {
  const [ref, visible] = useIntersection();

  return (
    <section id="about" style={{ padding:'8rem 8vw', background:'#030712', position:'relative', overflow:'hidden' }} aria-label="About">
      {/* Watermark */}
      <span style={{ position:'absolute', left:'4vw', top:'50%', transform:'translateY(-50%)', fontFamily:'"Playfair Display",serif', fontSize:'clamp(7rem,18vw,20rem)', color:'rgba(0,255,178,0.025)', fontWeight:900, pointerEvents:'none', userSelect:'none', lineHeight:1 }} aria-hidden="true">JS</span>

      <div
        ref={ref}
        style={{ maxWidth:'620px', marginLeft:'auto', opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(40px)', transition:'opacity 0.8s ease, transform 0.8s ease' }}
      >
        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2.5rem' }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#00FFB2', boxShadow:'0 0 10px rgba(0,255,178,0.8)' }} />
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
        </div>

        <p style={body}>
          I'm a third-year Computer Science student at the University of Winnipeg, graduating in 2026. I build full-stack applications with a focus on clean architecture, AI integration, and accessibility.
        </p>
        <p style={body}>
          My work spans from building AI-powered job trackers that integrate Groq APIs to assisting the Government of Manitoba with secure data governance — giving me a rare combination of production engineering experience and institutional discipline.
        </p>
        <p style={body}>
          I'm fluent in English, Hindi, and Gujarati, with beginner French — something that quietly shapes how I think about internationalization and inclusive design.
        </p>

        {/* Education card */}
        <div className="glass-card" style={{ padding:'1.5rem', marginTop:'2.5rem', display:'flex', gap:'1.5rem', alignItems:'flex-start' }}>
          <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'2.5rem', color:'#00FFB2', fontWeight:900, lineHeight:1, flexShrink:0 }}>26</div>
          <div>
            <p style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.75rem', letterSpacing:'0.15em', color:'#3A4A5C', marginBottom:'0.3rem' }}>EDUCATION</p>
            <p style={{ fontFamily:'"Playfair Display",serif', fontSize:'1rem', color:'#E8EDF5', fontWeight:700 }}>Bachelor of Science, Computer Science</p>
            <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.75rem', color:'#3A4A5C', marginTop:'0.25rem' }}>The University of Winnipeg · Winnipeg, MB · Class of 2026</p>
            <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.7rem', color:'#3A4A5C', marginTop:'0.5rem', lineHeight:1.7, opacity:0.8 }}>
              DSA · Algorithm Analysis · PostgreSQL · MongoDB · Node/Express · Software Architecture · Computer Architecture
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const body = {
  fontFamily:'"DM Mono",monospace', fontSize:'0.88rem', lineHeight:1.95,
  color:'#E8EDF5', opacity:0.78, marginBottom:'1.25rem',
};
