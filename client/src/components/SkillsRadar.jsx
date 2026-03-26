import { useIntersection } from '../hooks/useIntersection';

const CATEGORIES = [
  { label: 'Languages',  pct: 85 },
  { label: 'Frontend',   pct: 88 },
  { label: 'Backend',    pct: 78 },
  { label: 'Databases',  pct: 74 },
  { label: 'DevOps',     pct: 65 },
  { label: 'AI / ML',   pct: 72 },
];

const BAR_GRADIENT = 'linear-gradient(90deg, #14b8a6, #0891b2)';

function RadarRow({ label, pct, visible, delay }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr 48px',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.1rem',
      }}
    >
      {/* Category label */}
      <span
        style={{
          fontFamily: '"DM Mono",monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.06em',
          color: 'var(--ink-300)',
          textAlign: 'right',
        }}
      >
        {label}
      </span>

      {/* Bar track */}
      <div
        style={{
          height: '7px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          className="bar-fill"
          style={{
            background: BAR_GRADIENT,
            width: visible ? `${pct}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>

      {/* Percentage */}
      <span
        style={{
          fontFamily: '"DM Mono",monospace',
          fontSize: '0.68rem',
          color: '#14b8a6',
          opacity: visible ? 1 : 0,
          transition: `opacity 0.4s ease ${delay + 700}ms`,
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

export default function SkillsRadar() {
  const [ref, visible] = useIntersection();

  return (
    <section
      ref={ref}
      id="skillsradar"
      aria-label="Skill category overview"
      style={{
        padding: '6rem 8vw',
        background: 'rgba(0,0,0,0.15)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <p
        style={{
          fontFamily: '"Bebas Neue",sans-serif',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          color: 'var(--ink-500)',
          marginBottom: '0.75rem',
        }}
      >
        SKILL DOMAINS
      </p>
      <h2
        style={{
          fontFamily: '"Playfair Display",serif',
          fontSize: 'clamp(1.6rem,4vw,3rem)',
          color: 'var(--ink-100)',
          marginBottom: '3rem',
        }}
      >
        Capability <span style={{ color: '#14b8a6' }}>Overview</span>
      </h2>

      <div style={{ maxWidth: '640px' }}>
        {CATEGORIES.map(({ label, pct }, idx) => (
          <RadarRow
            key={label}
            label={label}
            pct={pct}
            visible={visible}
            delay={idx * 110}
          />
        ))}
      </div>
    </section>
  );
}
