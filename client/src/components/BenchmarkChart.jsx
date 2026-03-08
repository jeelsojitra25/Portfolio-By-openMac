import { useIntersection } from '../hooks/useIntersection';

const BENCHMARKS = [
  { name: 'MMLU',      qwen: 88.7, gpt4o: 88.0, llama3: 82.0 },
  { name: 'HumanEval', qwen: 92.1, gpt4o: 90.2, llama3: 81.7 },
  { name: 'GSM8K',     qwen: 95.2, gpt4o: 94.2, llama3: 87.3 },
  { name: 'MATH',      qwen: 83.1, gpt4o: 76.6, llama3: 59.4 },
  { name: 'BBH',       qwen: 88.3, gpt4o: 87.0, llama3: 81.0 },
];

function Bar({ label, value, color, visible, delay }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
      <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', color: '#3A4A5C', width: '52px', textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          className="bar-fill"
          style={{
            background: color, width: visible ? `${value}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '0.85rem', color: '#E8EDF5', width: '44px' }}>{value}</span>
    </div>
  );
}

function BenchRow({ bench, visible }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1rem', letterSpacing: '0.12em', color: '#E8EDF5', marginBottom: '0.75rem' }}>{bench.name}</h3>
      <Bar label="Qwen2.5" value={bench.qwen}   color="#00FFB2" visible={visible} delay={0}   />
      <Bar label="GPT-4o"  value={bench.gpt4o}  color="#3A4A5C" visible={visible} delay={100} />
      <Bar label="Llama3"  value={bench.llama3} color="#FF6B35" visible={visible} delay={200} />
    </div>
  );
}

export default function BenchmarkChart() {
  const [ref, visible] = useIntersection();

  return (
    <section id="benchmarks" style={{ padding: '8rem 8vw', background: '#030712' }} aria-label="Benchmarks">
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#E8EDF5', marginBottom: '0.75rem' }}>
        Measured. Verified. <span style={{ color: '#00FFB2' }}>Unmatched.</span>
      </h2>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {[['Qwen2.5', '#00FFB2'], ['GPT-4o', '#3A4A5C'], ['Llama3', '#FF6B35']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', color: '#E8EDF5' }}>{l}</span>
          </div>
        ))}
      </div>

      <div ref={ref} style={{ maxWidth: '700px' }}>
        {BENCHMARKS.map(b => <BenchRow key={b.name} bench={b} visible={visible} />)}
      </div>
    </section>
  );
}
