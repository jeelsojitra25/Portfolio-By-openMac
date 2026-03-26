import { useEffect, useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';

const STATS = [
  { label: 'Years Coding',    value: 3,  suffix: '+' },
  { label: 'Projects Built',  value: 10, suffix: '+' },
  { label: 'Internships',     value: 2,  suffix: ''  },
  { label: 'Tech Stacks',     value: 4,  suffix: ''  },
];

function CountUp({ target, suffix, visible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const DURATION = 1400;
    const STEPS = 50;
    const increment = target / STEPS;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, DURATION / STEPS);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span
      style={{
        fontFamily: '"Playfair Display",serif',
        fontSize: 'clamp(2.4rem,6vw,4rem)',
        fontWeight: 900,
        color: '#14b8a6',
        lineHeight: 1,
      }}
    >
      {count}{suffix}
    </span>
  );
}

export default function PersonalStats() {
  const [ref, visible] = useIntersection();

  return (
    <section
      ref={ref}
      id="personalstats"
      aria-label="Personal statistics"
      style={{
        padding: '5rem 8vw',
        background: 'rgba(20,184,166,0.04)',
        borderTop: '1px solid rgba(20,184,166,0.1)',
        borderBottom: '1px solid rgba(20,184,166,0.1)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '2.5rem',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {STATS.map(({ label, value, suffix }, idx) => (
          <div
            key={label}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
              transition: `opacity 0.6s ease ${idx * 100}ms, transform 0.6s ease ${idx * 100}ms`,
            }}
          >
            <CountUp target={value} suffix={suffix} visible={visible} />
            <p
              style={{
                fontFamily: '"Bebas Neue",sans-serif',
                fontSize: '0.78rem',
                letterSpacing: '0.16em',
                color: 'var(--ink-500)',
                marginTop: '0.6rem',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
