import { useIntersection } from '../hooks/useIntersection';

const PROJECTS = [
  {
    id: '01',
    name: 'ApplyMate',
    tagline: 'AI-Powered Job Application Tracker',
    year: '2026',
    status: 'Live',
    description:
      "Built this because tracking job applications in a spreadsheet was driving me insane. ApplyMate logs every application — from applied to offer — and uses Groq AI to generate resume match scores, tailored cover letters, and follow-up emails on the fly. Cuts application prep time significantly.",
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Groq AI'],
    links: [
      { label: 'Live Demo', href: 'https://applymate.jeelsojitra.tech', primary: true },
      { label: 'GitHub', href: 'https://github.com/jeelsojitra25/ApplyMate', primary: false },
    ],
    accent: '#00FFB2',
    featured: true,
  },
  {
    id: '02',
    name: 'AI Chat Translation',
    tagline: 'Multilingual Chat Interface Prototype',
    year: '2024',
    status: 'Prototype',
    description:
      "A Figma prototype for a real-time AI chat translation interface. Designed around WCAG accessibility standards and cross-language UX patterns, built iteratively using agile methodology.",
    stack: ['JavaScript', 'HTML', 'CSS', 'Figma'],
    links: [],
    accent: '#FF6B35',
    featured: false,
  },
];

function FeaturedCard({ project }) {
  const [ref, visible] = useIntersection();

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(0,255,178,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(0,255,178,0.18)',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '1.75rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      {/* top glow line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, #00FFB2 40%, transparent 100%)' }} />

      <div style={{ padding: '2.75rem 3rem' }}>
        {/* header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.7rem', letterSpacing: '0.22em', color: '#3A4A5C' }}>
            {project.id} / {project.year}
          </span>
          <span style={{
            fontFamily: '"DM Mono",monospace', fontSize: '0.64rem', letterSpacing: '0.08em',
            color: '#00FFB2', background: 'rgba(0,255,178,0.1)', border: '1px solid rgba(0,255,178,0.28)',
            borderRadius: '4px', padding: '0.18rem 0.55rem',
          }}>
            ● {project.status}
          </span>
        </div>

        {/* two-column body */}
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* left: text */}
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <h3 style={{
              fontFamily: '"Playfair Display",serif',
              fontSize: 'clamp(2rem,4vw,3rem)',
              color: '#E8EDF5', fontWeight: 700, margin: '0 0 0.4rem',
            }}>
              {project.name}
            </h3>
            <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.82rem', color: project.accent, marginBottom: '1.5rem', letterSpacing: '0.02em' }}>
              {project.tagline}
            </p>
            <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.82rem', color: '#E8EDF5', opacity: 0.62, lineHeight: 1.9, margin: 0 }}>
              {project.description}
            </p>
          </div>

          {/* right: stack + links */}
          <div style={{ flex: '0 0 auto', minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#3A4A5C', marginBottom: '0.75rem' }}>STACK</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {project.stack.map(tech => (
                  <span key={tech} style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.74rem', color: '#E8EDF5', opacity: 0.6 }}>
                    — {tech}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {project.links.map(({ label, href, primary }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: '"DM Mono",monospace', fontSize: '0.76rem',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1rem', borderRadius: '8px',
                    background: primary ? 'rgba(0,255,178,0.1)' : 'transparent',
                    border: primary ? '1px solid rgba(0,255,178,0.3)' : '1px solid rgba(255,255,255,0.07)',
                    color: primary ? '#00FFB2' : '#E8EDF5',
                    opacity: primary ? 1 : 0.55,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {label} {primary ? '↗' : '→'}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, delay }) {
  const [ref, visible] = useIntersection();

  return (
    <div
      ref={ref}
      className="glass-card"
      style={{
        padding: '2.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', color: '#3A4A5C' }}>
          {project.id} / {project.year}
        </span>
        <span style={{
          fontFamily: '"DM Mono",monospace', fontSize: '0.62rem', letterSpacing: '0.06em',
          color: project.accent, background: `${project.accent}12`,
          border: `1px solid ${project.accent}30`, borderRadius: '4px', padding: '0.15rem 0.5rem',
        }}>
          {project.status}
        </span>
      </div>

      <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(1.4rem,3vw,1.8rem)', color: '#E8EDF5', fontWeight: 700, margin: '0 0 0.3rem' }}>
        {project.name}
      </h3>
      <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.78rem', color: project.accent, marginBottom: '1.25rem' }}>
        {project.tagline}
      </p>

      <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.79rem', color: '#E8EDF5', opacity: 0.62, lineHeight: 1.85, marginBottom: '1.75rem' }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.75rem' }}>
        {project.stack.map(tech => (
          <span key={tech} style={{
            fontFamily: '"DM Mono",monospace', fontSize: '0.68rem', color: '#E8EDF5',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '6px', padding: '0.25rem 0.6rem', opacity: 0.65,
          }}>
            {tech}
          </span>
        ))}
      </div>

      {project.links.length === 0 && (
        <span style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.72rem', color: '#3A4A5C' }}>Design prototype — no repo</span>
      )}
    </div>
  );
}

export default function Projects() {
  const featured = PROJECTS.filter(p => p.featured);
  const rest = PROJECTS.filter(p => !p.featured);

  return (
    <section id="projects" style={{ padding: '8rem 8vw', background: '#030712' }} aria-label="Projects">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(2rem,5vw,4rem)', color: '#E8EDF5', margin: 0 }}>
          Things I've <span style={{ color: '#00FFB2' }}>Built</span>
        </h2>
        <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.72rem', letterSpacing: '0.22em', color: '#3A4A5C' }}>
          {String(PROJECTS.length).padStart(2, '0')} PROJECTS
        </span>
      </div>

      {featured.map(p => <FeaturedCard key={p.name} project={p} />)}

      {rest.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.75rem' }}>
          {rest.map((p, i) => <ProjectCard key={p.name} project={p} delay={i * 120} />)}
        </div>
      )}
    </section>
  );
}
