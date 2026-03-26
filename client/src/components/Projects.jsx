import { useIntersection } from '../hooks/useIntersection';

const PROJECTS = [
  {
    name: 'ApplyMate',
    tagline: 'AI-Powered Job Application Tracker',
    year: '2026',
    description: 'A full-stack web application that lets users track job applications from applied to offer stage. Integrates the Groq AI API to auto-generate resume match scores, tailored cover letters, and follow-up emails — cutting application prep time significantly.',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Groq AI API'],
    links: [
      { label: 'GitHub', href: 'https://github.com/jeelsojitra25/ApplyMate' },
    ],
    accent: '#00FFB2',
    featured: true,
  },
  {
    name: 'AI Chat Translation',
    tagline: 'Multilingual Chat Interface Prototype',
    year: '2024',
    description: 'A Figma-based prototype for a real-time AI chat translation interface, designed using agile methodology. Focused on user-centered design principles, WCAG accessibility standards, and cross-language communication patterns.',
    stack: ['JavaScript', 'HTML', 'CSS', 'Figma'],
    links: [],
    accent: '#FF6B35',
    featured: false,
  },
  {
    name: 'Manitoba Transcript DB',
    tagline: 'Pre-1990 Student Record Digitization System',
    year: '2025',
    description: 'A digitization system for pre-1990 student records built for the Government of Manitoba. Single HTML file with no build tools — runs entirely in the browser using React via CDN and Claude AI for intelligent record parsing, with localStorage for persistence.',
    stack: ['React', 'Claude AI', 'localStorage', 'HTML'],
    links: [
      { label: 'GitHub', href: '#' },
      { label: 'Demo', href: '#' },
    ],
    accent: '#00FFB2',
    featured: false,
  },
  {
    name: 'Transcript Overlap Splitter',
    tagline: 'Microfiche PDF De-duplication Tool',
    year: '2025',
    description: 'A Python/Tkinter desktop tool that detects double-scanned microfiche pages using OCR term counting and automatically splits PDFs to remove duplicates. Built for the Government of Manitoba digitization workflow.',
    stack: ['Python', 'Tkinter', 'PyMuPDF', 'Tesseract OCR'],
    links: [
      { label: 'GitHub', href: '#' },
    ],
    accent: '#FF6B35',
    featured: false,
  },
  {
    name: 'Jeel Portfolio',
    tagline: 'This Portfolio — Full-Stack with AI Chatbot',
    year: '2026',
    description: 'This portfolio itself. Full-stack React + Node.js + PostgreSQL + Three.js. Features a Command Palette (⌘K), custom cursor, live GitHub stats, and an AI chatbot — all deployed and served from a single repository.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Three.js', 'Groq AI'],
    links: [
      { label: 'GitHub', href: '#' },
      { label: 'Live', href: '#' },
    ],
    accent: '#00FFB2',
    featured: false,
  },
];

function ProjectCard({ project, delay }) {
  const [ref, visible] = useIntersection();
  return (
    <div
      ref={ref}
      className="glass-card"
      style={{
        padding:'2.5rem',
        opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
        transition:`opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        border: project.featured ? `1.5px solid rgba(0,255,178,0.25)` : undefined,
        position:'relative', overflow:'hidden',
      }}
    >
      {project.featured && (
        <div style={{ position:'absolute', top:'1.25rem', right:'1.25rem', fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.65rem', letterSpacing:'0.15em', color:'#00FFB2', border:'1px solid rgba(0,255,178,0.3)', padding:'0.2rem 0.6rem', borderRadius:'4px' }}>
          FEATURED
        </div>
      )}

      {/* Year */}
      <p style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.75rem', letterSpacing:'0.2em', color:'#3A4A5C', marginBottom:'0.5rem' }}>{project.year}</p>

      {/* Title */}
      <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(1.4rem,3vw,2rem)', color:'#E8EDF5', fontWeight:700, marginBottom:'0.3rem' }}>
        {project.name}
      </h3>
      <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.78rem', color:project.accent, marginBottom:'1.25rem' }}>
        {project.tagline}
      </p>

      {/* Description */}
      <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.79rem', color:'#E8EDF5', opacity:0.72, lineHeight:1.85, marginBottom:'1.75rem' }}>
        {project.description}
      </p>

      {/* Stack */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.75rem' }}>
        {project.stack.map(tech => (
          <span key={tech} style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.7rem', color:'#E8EDF5', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'6px', padding:'0.3rem 0.65rem' }}>
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display:'flex', gap:'1rem' }}>
        {project.links.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.78rem', color:project.accent, textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', borderBottom:`1px solid ${project.accent}33`, paddingBottom:'1px' }}>
            {label} →
          </a>
        ))}
        {project.links.length === 0 && (
          <span style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.72rem', color:'#3A4A5C' }}>Design prototype — no repo</span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" style={{ padding:'8rem 8vw', background:'#030712' }} aria-label="Projects">
      <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(2rem,5vw,4rem)', color:'#E8EDF5', marginBottom:'4rem' }}>
        Things I've <span style={{ color:'#00FFB2' }}>Built</span>
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'1.75rem' }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.name} project={p} delay={i * 120} />)}
      </div>
    </section>
  );
}
