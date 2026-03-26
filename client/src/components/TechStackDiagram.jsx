import { useEffect, useRef, useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';

// ─── Node definitions ─────────────────────────────────────────────────────────
// Each node is placed on a grid: col (0–4 left-to-right), row (0–2 top-bottom).
const NODES = [
  {
    id: 'browser',
    label: 'Browser',
    icon: '◉',
    desc: 'Entry point — renders the UI and handles user events',
    col: 0,
    row: 0,
  },
  {
    id: 'react',
    label: 'React + Vite',
    icon: '⬡',
    desc: 'Component-based UI with lightning-fast HMR dev server',
    col: 1,
    row: 0,
  },
  {
    id: 'api',
    label: 'REST API',
    icon: '⇌',
    desc: 'JSON over HTTP — standardised resource contracts',
    col: 2,
    row: 0,
  },
  {
    id: 'express',
    label: 'Express + Node',
    icon: '▣',
    desc: 'Minimal, unopinionated server-side runtime',
    col: 3,
    row: 0,
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    icon: '⬟',
    desc: 'Relational store — ACID-compliant, battle-tested',
    col: 4,
    row: 0,
  },
  {
    id: 'threejs',
    label: 'Three.js',
    icon: '△',
    desc: 'WebGL scenes for immersive visual experiences',
    col: 2,
    row: 1,
  },
  {
    id: 'redis',
    label: 'Redis Cache',
    icon: '◈',
    desc: 'In-memory store — sub-millisecond read latency',
    col: 3,
    row: 1,
  },
  {
    id: 'groq',
    label: 'Groq AI API',
    icon: '✦',
    desc: 'Ultra-fast LLM inference — the newest, most exciting piece',
    col: 2,
    row: 2,
    pulse: true,
  },
];

// ─── Edge definitions ─────────────────────────────────────────────────────────
const EDGES = [
  { from: 'browser', to: 'react' },
  { from: 'react',   to: 'api' },
  { from: 'api',     to: 'express' },
  { from: 'express', to: 'postgres' },
  { from: 'api',     to: 'threejs' },
  { from: 'express', to: 'redis' },
  { from: 'threejs', to: 'groq' },
];

// ─── Layout constants ─────────────────────────────────────────────────────────
const NODE_W  = 138;
const NODE_H  = 68;
const COL_GAP = 58;
const ROW_GAP = 78;
const PAD_X   = 16;
const PAD_Y   = 20;

const SVG_W = PAD_X * 2 + 5 * NODE_W + 4 * COL_GAP;
const SVG_H = PAD_Y * 2 + 3 * NODE_H + 2 * ROW_GAP;

function nodePos(node) {
  return {
    x: PAD_X + node.col * (NODE_W + COL_GAP),
    y: PAD_Y + node.row * (NODE_H + ROW_GAP),
  };
}

// ─── Animated edge ────────────────────────────────────────────────────────────
function Edge({ edge, animated }) {
  const from = NODES.find(n => n.id === edge.from);
  const to   = NODES.find(n => n.id === edge.to);
  if (!from || !to) return null;

  const fp      = nodePos(from);
  const tp      = nodePos(to);
  const sameRow = from.row === to.row;

  let x1, y1, x2, y2;
  if (sameRow) {
    x1 = fp.x + NODE_W; y1 = fp.y + NODE_H / 2;
    x2 = tp.x;          y2 = tp.y + NODE_H / 2;
  } else {
    x1 = fp.x + NODE_W / 2; y1 = fp.y + NODE_H;
    x2 = tp.x + NODE_W / 2; y2 = tp.y;
  }

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const d  = sameRow
    ? `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
    : `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;

  // Rough path length for dash animation
  const dx  = x2 - x1;
  const dy  = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) * 1.2;

  return (
    <path
      d={d}
      fill="none"
      stroke="rgba(0,255,178,0.5)"
      strokeWidth="1.5"
      strokeDasharray="6 5"
      style={{
        strokeDashoffset: animated ? 0 : len,
        transition: animated ? 'stroke-dashoffset 1s ease' : 'none',
      }}
    />
  );
}

// ─── Single node ──────────────────────────────────────────────────────────────
function DiagramNode({ node, visible, onHover, onLeave }) {
  const pos = nodePos(node);
  const cx  = pos.x + NODE_W / 2;
  const cy  = pos.y + NODE_H / 2;

  return (
    <g
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translate(0,0)' : 'translate(0,18px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={onLeave}
      role="img"
      aria-label={`${node.label}: ${node.desc}`}
    >
      {/* Pulse ring — only on Groq node */}
      {node.pulse && (
        <>
          <ellipse
            cx={cx} cy={cy}
            rx={NODE_W / 2 + 8} ry={NODE_H / 2 + 8}
            fill="none"
            stroke="rgba(0,255,178,0.35)"
            strokeWidth="1.5"
            style={{ animation: 'tsdPulse 2.2s ease-in-out infinite' }}
          />
          <ellipse
            cx={cx} cy={cy}
            rx={NODE_W / 2 + 16} ry={NODE_H / 2 + 16}
            fill="none"
            stroke="rgba(0,255,178,0.15)"
            strokeWidth="1"
            style={{ animation: 'tsdPulse 2.2s ease-in-out 0.4s infinite' }}
          />
        </>
      )}

      {/* Card body */}
      <rect
        x={pos.x} y={pos.y}
        width={NODE_W} height={NODE_H}
        rx="11"
        fill="rgba(9,11,20,0.88)"
        stroke={node.pulse ? 'rgba(0,255,178,0.75)' : 'rgba(0,255,178,0.45)'}
        strokeWidth="1.3"
      />

      {/* Icon */}
      <text
        x={pos.x + 16}
        y={cy}
        dominantBaseline="middle"
        fill="#00FFB2"
        fontSize="17"
        fontFamily="monospace"
      >
        {node.icon}
      </text>

      {/* Label */}
      <text
        x={pos.x + 36}
        y={cy - 1}
        dominantBaseline="middle"
        fill="#E8EDF5"
        fontSize="10.5"
        fontFamily='"Bebas Neue", sans-serif'
        letterSpacing="1.4"
      >
        {node.label}
      </text>
    </g>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
// Rendered as a fixed-position div so it escapes the SVG viewport.
function Tooltip({ node, svgEl }) {
  const [style, setStyle] = useState(null);

  useEffect(() => {
    if (!node || !svgEl) { setStyle(null); return; }

    const rect   = svgEl.getBoundingClientRect();
    const scaleX = rect.width  / SVG_W;
    const scaleY = rect.height / SVG_H;
    const pos    = nodePos(node);
    const cx     = pos.x + NODE_W / 2;
    const ty     = pos.y;

    setStyle({
      position:       'fixed',
      left:           rect.left + cx * scaleX,
      top:            rect.top  + ty * scaleY - 10,
      transform:      'translate(-50%, -100%)',
      zIndex:         200,
      pointerEvents:  'none',
      background:     'rgba(9,11,20,0.97)',
      border:         '1px solid rgba(0,255,178,0.38)',
      borderRadius:   '10px',
      padding:        '0.5rem 0.85rem',
      maxWidth:       '220px',
      width:          'max-content',
      boxShadow:      '0 4px 28px rgba(0,255,178,0.18)',
    });
  }, [node, svgEl]);

  if (!style || !node) return null;

  return (
    <div style={style}>
      <p style={{ margin: 0, fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.76rem', letterSpacing: '0.12em', color: '#00FFB2' }}>
        {node.label}
      </p>
      <p style={{ margin: '0.2rem 0 0', fontFamily: '"DM Mono",monospace', fontSize: '0.67rem', color: '#E8EDF5', opacity: 0.78, lineHeight: 1.55 }}>
        {node.desc}
      </p>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function TechStackDiagram() {
  const [headerRef, headerVisible] = useIntersection(0.1);

  const [visibleNodes, setVisibleNodes] = useState(new Set());
  const [visibleEdges, setVisibleEdges] = useState(new Set());
  const [hoveredNode,  setHoveredNode]  = useState(null);
  const svgRef = useRef(null);

  // Stagger reveal when header enters viewport
  useEffect(() => {
    if (!headerVisible) return;

    NODES.forEach((node, i) => {
      setTimeout(() => {
        setVisibleNodes(prev => new Set([...prev, node.id]));
      }, i * 150);
    });

    EDGES.forEach((edge, i) => {
      const key = `${edge.from}→${edge.to}`;
      setTimeout(() => {
        setVisibleEdges(prev => new Set([...prev, key]));
      }, NODES.length * 150 + i * 130);
    });
  }, [headerVisible]);

  return (
    <section
      id="how-i-build"
      style={{ padding: '8rem 8vw', background: '#030712', position: 'relative' }}
      aria-label="How I Build — Tech Stack Flow"
    >
      {/* ── keyframes injected inline ── */}
      <style>{`
        @keyframes tsdPulse {
          0%, 100% { opacity: 0.35; transform: scale(1);    }
          50%       { opacity: 1;    transform: scale(1.07); }
        }
      `}</style>

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          opacity:    headerVisible ? 1 : 0,
          transform:  headerVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          marginBottom: '3rem',
        }}
      >
        <p style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.76rem', letterSpacing: '0.18em', color: '#3A4A5C', margin: '0 0 0.55rem' }}>
          ARCHITECTURE
        </p>
        <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(2rem,5vw,4rem)', color: '#E8EDF5', margin: 0 }}>
          How I <span style={{ color: '#00FFB2' }}>Build</span>
        </h2>
        <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.81rem', color: '#E8EDF5', opacity: 0.52, margin: '0.85rem 0 0', maxWidth: '520px', lineHeight: 1.9 }}>
          A full-stack data flow — from browser request to database and back, with AI inference at the edge.
        </p>
      </div>

      {/* Diagram — horizontally scrollable on narrow screens */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ minWidth: '640px', display: 'block', overflow: 'visible' }}
          aria-hidden="true"
        >
          {/* Edges first (drawn behind nodes) */}
          {EDGES.map(edge => (
            <Edge
              key={`${edge.from}→${edge.to}`}
              edge={edge}
              animated={visibleEdges.has(`${edge.from}→${edge.to}`)}
            />
          ))}

          {/* Nodes */}
          {NODES.map(node => (
            <DiagramNode
              key={node.id}
              node={node}
              visible={visibleNodes.has(node.id)}
              onHover={setHoveredNode}
              onLeave={() => setHoveredNode(null)}
            />
          ))}
        </svg>
      </div>

      {/* Tooltip — fixed overlay */}
      <Tooltip node={hoveredNode} svgEl={svgRef.current} />

      {/* Chip legend — always readable on mobile */}
      <div
        style={{
          marginTop: '2.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          opacity:    headerVisible ? 1 : 0,
          transform:  headerVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease 0.8s, transform 0.7s ease 0.8s',
        }}
      >
        {NODES.map(node => (
          <div
            key={node.id}
            className="glass-card"
            style={{
              padding: '0.4rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderColor: node.pulse ? 'rgba(0,255,178,0.55)' : undefined,
            }}
          >
            <span style={{ color: '#00FFB2', fontSize: '0.85rem', lineHeight: 1 }}>{node.icon}</span>
            <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#E8EDF5' }}>
              {node.label}
            </span>
            {node.pulse && (
              <span
                aria-label="Newest tech"
                style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: '#00FFB2',
                  boxShadow: '0 0 8px rgba(0,255,178,0.9)',
                  animation: 'tsdPulse 2.2s ease-in-out infinite',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
