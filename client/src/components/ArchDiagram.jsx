import { useState, useEffect } from 'react';
import { useIntersection } from '../hooks/useIntersection';

const ARCH_NODES = [
  { id: 'input',    label: 'Token Embedding',    desc: '32K vocab tokenizer',      order: 0 },
  { id: 'rope',     label: 'RoPE Encoding',      desc: 'Rotary Position Embedding', order: 1 },
  { id: 'attn',     label: 'Grouped Query Attn', desc: 'GQA — 8x KV cache reduction', order: 2 },
  { id: 'mlp',      label: 'SwiGLU MLP',         desc: 'Gated linear unit activation', order: 3 },
  { id: 'norm',     label: 'RMS Norm',           desc: 'Pre-norm architecture',     order: 4 },
  { id: 'residual', label: 'Residual Stream',    desc: '128-layer deep residual',   order: 5 },
  { id: 'output',   label: 'LM Head',            desc: 'Logits → next token',       order: 6 },
];

export default function ArchDiagram() {
  const [ref, visible] = useIntersection();
  const [shown, setShown] = useState([]);

  useEffect(() => {
    if (!visible) return;
    ARCH_NODES.forEach((n, i) => {
      setTimeout(() => setShown(prev => [...prev, n.id]), i * 120);
    });
  }, [visible]);

  return (
    <section id="architecture" style={{ padding: '8rem 8vw', background: '#030712' }} aria-label="Architecture">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Diagram */}
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#E8EDF5', marginBottom: '2rem' }}>
            Architecture <span style={{ color: '#00FFB2' }}>Internals</span>
          </h2>
          {ARCH_NODES.map((node, i) => (
            <div
              key={node.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                opacity: shown.includes(node.id) ? 1 : 0,
                transform: shown.includes(node.id) ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
              aria-label={node.label}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00FFB2', boxShadow: '0 0 8px rgba(0,255,178,0.6)' }} />
                {i < ARCH_NODES.length - 1 && <div style={{ width: 1, height: 28, background: 'rgba(0,255,178,0.2)', marginTop: 2 }} />}
              </div>
              <div className="glass-card" style={{ flex: 1, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '0.9rem', letterSpacing: '0.08em', color: '#E8EDF5' }}>{node.label}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', color: '#3A4A5C' }}>{node.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial text */}
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#E8EDF5', marginBottom: '2rem' }}>
            Engineered for <span style={{ color: '#FF6B35' }}>Scale</span>
          </h2>
          {[
            ['Grouped Query Attention', 'GQA reduces the KV-cache memory footprint by 8× without sacrificing attention quality, enabling efficient 128K context inference at production throughput.'],
            ['SwiGLU Activation', 'The gated linear unit activations in the MLP blocks deliver measurably better loss curves than standard GELU, with no additional parameter cost.'],
            ['RoPE Embeddings', 'Rotary position encodings enable seamless length extrapolation far beyond training context, critical for long-document tasks.'],
            ['Pre-norm Architecture', 'RMSNorm before each sublayer stabilizes training at 72B scale and enables aggressive learning rates without gradient explosions.'],
          ].map(([title, body]) => (
            <div key={title} style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '0.85rem', letterSpacing: '0.12em', color: '#00FFB2', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.8rem', color: '#E8EDF5', lineHeight: 1.8, opacity: 0.75 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
