import { useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';

function calcDuration(startYear, startMonth, endYear, endMonth) {
  let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs > 0 && mos > 0) return `${yrs} yr ${mos} mo`;
  if (yrs > 0) return `${yrs} yr`;
  return `${mos} mo`;
}

const JOBS = [
  {
    role: 'Technical Records Clerk',
    company: 'Government of Manitoba',
    startLabel: 'May 2024',
    endLabel: 'Aug 2025',
    duration: calcDuration(2024, 5, 2025, 8),
    type: 'Government',
    bullets: [
      'Digitized pre-1990 student microfiche records into structured digital archives.',
      'Built PDF processing tools in Python to automate document extraction and indexing.',
      'Maintained and queried Oracle EIS database to support records management workflows.',
      'Created automated overlap detection system to identify duplicate and conflicting records.',
    ],
  },
  {
    role: 'Department Supervisor',
    company: 'The Home Depot',
    startLabel: 'Jun 2022',
    endLabel: 'Apr 2024',
    duration: calcDuration(2022, 6, 2024, 4),
    type: 'Retail',
    bullets: [
      'Led department team of 8 associates, coordinating daily assignments and performance.',
      'Managed inventory and stock replenishment to maintain optimal product availability.',
      'Trained new team members on systems and procedures, reducing onboarding time.',
      'Handled POS transactions, returns, and exchanges efficiently under high-traffic conditions.',
    ],
  },
];

function AccordionJobCard({ job, delay, isOpen, onToggle }) {
  const [ref, visible] = useIntersection();

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        gap: '2rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {/* Timeline spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: isOpen ? '#00FFB2' : '#1a2d3a',
            boxShadow: isOpen ? '0 0 10px rgba(0,255,178,0.7)' : '0 0 6px rgba(0,255,178,0.25)',
            border: '2px solid #00FFB2',
            marginTop: 4,
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
            flexShrink: 0,
          }}
        />
        <div style={{ width: 1, flex: 1, background: 'rgba(0,255,178,0.12)', marginTop: 4 }} />
      </div>

      {/* Card */}
      <div className="glass-card" style={{ flex: 1, marginBottom: '1.5rem', overflow: 'hidden' }}>
        {/* Collapsed header — always visible, acts as accordion trigger */}
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '0.5rem',
            textAlign: 'left',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div>
                <h3
                  style={{
                    fontFamily: '"Playfair Display",serif',
                    fontSize: '1.05rem',
                    color: '#E8EDF5',
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {job.role}
                </h3>
                <p
                  style={{
                    fontFamily: '"DM Mono",monospace',
                    fontSize: '0.75rem',
                    color: '#00FFB2',
                    marginTop: '0.2rem',
                    marginBottom: 0,
                  }}
                >
                  {job.company}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: '"Bebas Neue",sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    color: '#3A4A5C',
                    border: '1px solid rgba(58,74,92,0.4)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                  }}
                >
                  {job.type}
                </span>

                <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.68rem', color: '#3A4A5C', margin: 0 }}>
                  {job.startLabel} – {job.endLabel}
                </p>

                {/* Duration pill */}
                <span
                  style={{
                    fontFamily: '"DM Mono",monospace',
                    fontSize: '0.63rem',
                    color: '#00FFB2',
                    background: 'rgba(0,255,178,0.08)',
                    border: '1px solid rgba(0,255,178,0.2)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                  }}
                >
                  {job.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Animated chevron */}
          <span
            aria-hidden="true"
            style={{
              marginLeft: '1rem',
              color: '#00FFB2',
              fontSize: '0.85rem',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              flexShrink: 0,
              marginTop: '0.15rem',
              display: 'inline-block',
            }}
          >
            ▾
          </span>
        </button>

        {/* Expandable body — CSS max-height accordion */}
        <div
          style={{
            maxHeight: isOpen ? '400px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: '1rem 1.75rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {job.bullets.map((b, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  fontFamily: '"DM Mono",monospace',
                  fontSize: '0.76rem',
                  color: '#E8EDF5',
                  opacity: 0.72,
                  lineHeight: 1.7,
                }}
              >
                <span style={{ color: '#00FFB2', flexShrink: 0, marginTop: '0.1rem' }}>›</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  // Track which card is expanded; null = all collapsed
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="experience" style={{ padding: '8rem 8vw', background: '#030712' }} aria-label="Experience">
      <h2
        style={{
          fontFamily: '"Playfair Display",serif',
          fontSize: 'clamp(2rem,5vw,4rem)',
          color: '#E8EDF5',
          marginBottom: '4rem',
        }}
      >
        Where I've <span style={{ color: '#FF6B35' }}>Worked</span>
      </h2>

      <div style={{ maxWidth: '780px' }}>
        {JOBS.map((job, i) => (
          <AccordionJobCard
            key={job.company}
            job={job}
            delay={i * 120}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>
    </section>
  );
}
