import { useIntersection } from '../hooks/useIntersection';

const ICONS = {
  code: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  math: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  language: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  context: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  ),
  instruction: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  tool: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
};

const CAPABILITIES = [
  { id: 1, name: 'Code Generation', icon: 'code', description: 'Writes, debugs, and refactors across 40+ programming languages.' },
  { id: 2, name: 'Math Reasoning', icon: 'math', description: 'Solves competition-level problems with step-by-step chain-of-thought.' },
  { id: 3, name: 'Multilingual', icon: 'language', description: 'Native fluency across 29 languages with cross-lingual transfer.' },
  { id: 4, name: 'Long Context', icon: 'context', description: '128K token context window — entire codebases, books, legal docs.' },
  { id: 5, name: 'Instruction Following', icon: 'instruction', description: 'Precise alignment to complex, multi-step instructions and formats.' },
  { id: 6, name: 'Tool Use', icon: 'tool', description: 'Native function calling and agentic task completion with external APIs.' },
];

function CapCard({ cap, delay }) {
  const [ref, visible] = useIntersection();
  return (
    <div
      ref={ref}
      className="glass-card reveal"
      style={{
        padding: '2rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
      role="article"
      aria-label={cap.name}
    >
      <div style={{ marginBottom: '1rem' }}>{ICONS[cap.icon]}</div>
      <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', color: '#E8EDF5', marginBottom: '0.5rem' }}>{cap.name}</h3>
      <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.78rem', color: '#3A4A5C', lineHeight: 1.65 }}>{cap.description}</p>
    </div>
  );
}

export default function CapabilityGrid() {
  return (
    <section id="capabilities" style={{ padding: '8rem 8vw', background: '#030712' }} aria-label="Capabilities">
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#E8EDF5', marginBottom: '4rem', maxWidth: '600px' }}>
        What Qwen2.5 <span style={{ color: '#00FFB2' }}>Knows</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {CAPABILITIES.map((cap, i) => <CapCard key={cap.id} cap={cap} delay={i * 80} />)}
      </div>
    </section>
  );
}
