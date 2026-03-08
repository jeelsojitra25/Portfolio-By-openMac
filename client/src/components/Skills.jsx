import { useIntersection } from '../hooks/useIntersection';

const SKILLS = [
  { category: 'Languages',   items: ['JavaScript', 'Java', 'Python', 'HTML', 'CSS'] },
  { category: 'Frontend',    items: ['React', 'jQuery', 'Responsive Design', 'WCAG / A11y', 'Figma'] },
  { category: 'Backend',     items: ['Node.js', 'Express.js', 'REST APIs', 'Groq AI API'] },
  { category: 'Databases',   items: ['PostgreSQL', 'MongoDB', 'MySQL', 'MS Access'] },
  { category: 'Tools',       items: ['Git / GitHub', 'VS Code', 'Lucid Chart', 'SharePoint', 'Microsoft 365'] },
  { category: 'Soft Skills', items: ['Agile / Scrum', 'Data Privacy', 'Technical Writing', 'Stakeholder Comms'] },
];

function SkillCard({ group, delay }) {
  const [ref, visible] = useIntersection();
  return (
    <div
      ref={ref}
      className="glass-card"
      style={{ padding:'1.75rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)', transition:`opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}
    >
      <p style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.8rem', letterSpacing:'0.15em', color:'#00FFB2', marginBottom:'1rem' }}>{group.category}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
        {group.items.map(item => (
          <span key={item} style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.72rem', color:'#E8EDF5', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'6px', padding:'0.3rem 0.65rem' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" style={{ padding:'8rem 8vw', background:'#030712' }} aria-label="Skills">
      <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(2rem,5vw,4rem)', color:'#E8EDF5', marginBottom:'4rem' }}>
        What I <span style={{ color:'#00FFB2' }}>Work With</span>
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1.25rem' }}>
        {SKILLS.map((g, i) => <SkillCard key={g.category} group={g} delay={i * 70} />)}
      </div>
    </section>
  );
}
