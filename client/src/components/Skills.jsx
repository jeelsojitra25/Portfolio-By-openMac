import { useIntersection } from '../hooks/useIntersection';

// Proficiency bars for key named skills shown inside each category card
const SKILL_BARS = {
  Languages:   [
    { name: 'Python',      pct: 78 },
    { name: 'Java',        pct: 70 },
    { name: 'JavaScript',  pct: 85 },
    { name: 'HTML / CSS',  pct: 90 },
  ],
  Frontend:    [
    { name: 'React',       pct: 88 },
    { name: 'TypeScript',  pct: 72 },
    { name: 'Three.js',    pct: 65 },
    { name: 'Responsive',  pct: 84 },
  ],
  Backend:     [
    { name: 'Node.js',     pct: 82 },
    { name: 'Express.js',  pct: 80 },
    { name: 'REST APIs',   pct: 85 },
    { name: 'Groq AI API', pct: 68 },
  ],
  Databases:   [
    { name: 'PostgreSQL',  pct: 75 },
    { name: 'MongoDB',     pct: 70 },
    { name: 'MySQL',       pct: 72 },
  ],
  Tools:       [
    { name: 'Git / GitHub',pct: 88 },
    { name: 'Docker',      pct: 68 },
    { name: 'VS Code',     pct: 92 },
  ],
  'Soft Skills': [
    { name: 'Agile/Scrum', pct: 80 },
    { name: 'Tech Writing',pct: 78 },
    { name: 'Stakeholder', pct: 74 },
  ],
};

const BAR_GRADIENT = 'linear-gradient(90deg, #14b8a6, #0891b2)';

function SkillBar({ name, pct, visible, delay }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
        <span style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.7rem', color: '#E8EDF5', opacity: 0.8 }}>
          {name}
        </span>
        <span style={{
          fontFamily: '"DM Mono",monospace',
          fontSize: '0.68rem',
          color: '#14b8a6',
          opacity: visible ? 1 : 0,
          transition: `opacity 0.4s ease ${delay + 600}ms`,
        }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          className="bar-fill"
          style={{
            background: BAR_GRADIENT,
            width: visible ? `${pct}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

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
  const bars = SKILL_BARS[group.category] || [];

  return (
    <div
      ref={ref}
      className="glass-card"
      style={{
        padding: '1.75rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.8rem', letterSpacing: '0.15em', color: '#00FFB2', marginBottom: '1rem' }}>
        {group.category}
      </p>

      {/* Animated proficiency bars */}
      <div style={{ marginBottom: bars.length ? '1rem' : 0 }}>
        {bars.map((bar, idx) => (
          <SkillBar
            key={bar.name}
            name={bar.name}
            pct={bar.pct}
            visible={visible}
            delay={delay + idx * 80}
          />
        ))}
      </div>

      {/* Remaining tag badges for items not represented by bars */}
      {(() => {
        const barNames = new Set(bars.map(b => b.name.toLowerCase()));
        const extra = group.items.filter(item => !barNames.has(item.toLowerCase()));
        return extra.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {extra.map(item => (
              <span
                key={item}
                style={{
                  fontFamily: '"DM Mono",monospace',
                  fontSize: '0.72rem',
                  color: '#E8EDF5',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.65rem',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        ) : null;
      })()}
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" style={{ padding: '8rem 8vw', background: '#030712' }} aria-label="Skills">
      <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(2rem,5vw,4rem)', color: '#E8EDF5', marginBottom: '4rem' }}>
        What I <span style={{ color: '#00FFB2' }}>Work With</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '1.25rem' }}>
        {SKILLS.map((g, i) => <SkillCard key={g.category} group={g} delay={i * 70} />)}
      </div>
    </section>
  );
}
