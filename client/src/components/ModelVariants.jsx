import { useIntersection } from '../hooks/useIntersection';

const MODELS = [
  { size: '0.5B', useCases: ['Edge', 'IoT'],        vram: '1 GB',  featured: false },
  { size: '1.5B', useCases: ['Mobile', 'Browser'],  vram: '3 GB',  featured: false },
  { size: '7B',   useCases: ['Local', 'Chat'],       vram: '8 GB',  featured: false },
  { size: '14B',  useCases: ['Enterprise', 'RAG'],   vram: '16 GB', featured: false },
  { size: '72B',  useCases: ['Research', 'Frontier'],vram: '80 GB', featured: true  },
];

function ModelCard({ model }) {
  const [ref, visible] = useIntersection();
  return (
    <div
      ref={ref}
      className="glass-card reveal"
      style={{
        minWidth: '200px', padding: '2rem 1.5rem', textAlign: 'center', flexShrink: 0,
        border: model.featured ? '1.5px solid rgba(0,255,178,0.5)' : undefined,
        boxShadow: model.featured ? '0 0 40px rgba(0,255,178,0.1)' : undefined,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        position: 'relative',
      }}
      aria-label={`${model.size} variant`}
    >
      {model.featured && (
        <div className="pulse-ring" style={{ borderRadius: '16px', inset: '-8px' }} aria-hidden="true" />
      )}
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: model.featured ? '#00FFB2' : '#E8EDF5', fontWeight: 900, lineHeight: 1 }}>
        {model.size.replace('B', '')}<span style={{ fontSize: '1.2rem' }}>B</span>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0 0.5rem' }}>
        {model.useCases.map(t => (
          <span key={t} style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: model.featured ? '#00FFB2' : '#3A4A5C', border: `1px solid ${model.featured ? 'rgba(0,255,178,0.3)' : 'rgba(58,74,92,0.5)'}`, borderRadius: '4px', padding: '0.15rem 0.5rem' }}>{t}</span>
        ))}
      </div>
      <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', color: '#3A4A5C' }}>VRAM: {model.vram}</p>
    </div>
  );
}

export default function ModelVariants() {
  return (
    <section id="models" style={{ padding: '8rem 8vw', background: '#030712', overflow: 'hidden' }} aria-label="Model Variants">
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#E8EDF5', marginBottom: '3rem' }}>
        Choose Your <span style={{ color: '#00FFB2' }}>Scale</span>
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '1rem' }}>
        {MODELS.map(m => (
          <div key={m.size} style={{ scrollSnapAlign: 'start' }}>
            <ModelCard model={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
