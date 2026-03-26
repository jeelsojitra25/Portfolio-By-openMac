import { useIntersection } from '../hooks/useIntersection';

const TIMELINE_EVENTS = [
  {
    year: '2022',
    title: 'Started Computer Science',
    detail: 'Enrolled at the University of Winnipeg, began building foundations in algorithms, data structures, and web development.',
    accent: '#00FFB2',
  },
  {
    year: '2024',
    title: 'AI Chat Translation Prototype',
    detail: 'Designed and shipped a Figma-based multilingual chat interface prototype applying WCAG accessibility standards and user-centred design.',
    accent: '#00FFB2',
  },
  {
    year: '2025',
    title: 'Government of Manitoba — STEP Placement',
    detail: 'Handled secure data classification, access control, and documentation for the Governance and Policy Branch under least-privilege security principles.',
    accent: '#FF6B35',
  },
  {
    year: '2026',
    title: 'ApplyMate — Full-Stack AI App',
    detail: 'Built a production full-stack job application tracker integrating Groq AI for resume scoring, cover letters, and follow-up automation.',
    accent: '#00FFB2',
  },
  {
    year: '2026',
    title: 'University of Winnipeg — Expected Graduation',
    detail: 'On track to complete Bachelor of Science in Computer Science with a focus on full-stack engineering and AI integration.',
    accent: '#00FFB2',
  },
];

function TimelineItem({ event, delay, isLast }) {
  const [ref, visible] = useIntersection();

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        gap: '2rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {/* Spine */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: 12,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: event.accent,
            boxShadow: `0 0 10px ${event.accent}99`,
            marginTop: 4,
            flexShrink: 0,
          }}
        />
        {!isLast && (
          <div
            style={{
              width: 1,
              flex: 1,
              background: `linear-gradient(to bottom, ${event.accent}33, transparent)`,
              marginTop: 6,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="glass-card" style={{ flex: 1, padding: '1.5rem', marginBottom: '1.25rem' }}>
        <p
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            color: event.accent,
            marginBottom: '0.35rem',
          }}
        >
          {event.year}
        </p>
        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1rem',
            color: 'var(--ink-100)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          {event.title}
        </h3>
        <p
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.76rem',
            color: 'var(--ink-300)',
            lineHeight: 1.75,
            opacity: 0.8,
          }}
        >
          {event.detail}
        </p>
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <section
      id="timeline"
      style={{ padding: '8rem 8vw', background: 'var(--bg-900)' }}
      aria-label="Career timeline"
    >
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: 'var(--ink-100)',
          marginBottom: '4rem',
        }}
      >
        My <span style={{ color: 'var(--accent)' }}>Journey</span>
      </h2>

      <div style={{ maxWidth: 760 }}>
        {TIMELINE_EVENTS.map((event, i) => (
          <TimelineItem
            key={event.year + event.title}
            event={event}
            delay={i * 100}
            isLast={i === TIMELINE_EVENTS.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
