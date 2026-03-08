const STATS = [
  'FULL STACK DEVELOPER', 'CS @ UWINNIPEG · 2026', 'REACT · NODE · POSTGRES',
  'AI INTEGRATION', 'OPEN TO WORK', 'WINNIPEG · MB · CANADA',
  '4 LANGUAGES SPOKEN', 'GROQ AI · REST APIs', 'WCAG ACCESSIBILITY',
];

export default function StatsTicker() {
  const items = [...STATS, ...STATS];
  return (
    <div style={{ overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'0.85rem 0', background:'rgba(0,255,178,0.02)' }} aria-label="Key facts">
      <div className="ticker-track">
        {items.map((s, i) => (
          <span key={i} style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.9rem', letterSpacing:'0.14em', color:'#E8EDF5', paddingRight:'3rem' }}>
            {s}<span style={{ color:'#00FFB2', marginLeft:'3rem' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
