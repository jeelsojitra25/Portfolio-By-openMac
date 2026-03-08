import { useIntersection } from '../hooks/useIntersection';

const JOBS = [
  {
    role: 'STEP Student — Governance & Policy Branch',
    company: 'Government of Manitoba',
    period: 'May 2025',
    type: 'Government',
    bullets: [
      'Handled secure data classification and organization of government records in compliance with internal policies.',
      'Operated Microsoft 365 (Excel, Word, Outlook, Teams) daily in a professional corporate environment.',
      'Supported data accuracy, access control, and documentation aligned with least-privilege security principles.',
      'Collaborated with internal stakeholders while maintaining strict confidentiality and information integrity.',
    ],
  },
  {
    role: 'Tool Rental Associate / Technician',
    company: 'The Home Depot',
    period: 'May 2025',
    type: 'Retail',
    bullets: [
      'Assisted customers with product selection and tailored recommendations based on project needs.',
      'Maintained stocked shelves, organized aisles, and visually appealing tool displays.',
      'Handled POS transactions, returns, and exchanges efficiently under high-traffic conditions.',
      'Promoted store services and specials to support sales targets.',
    ],
  },
];

function JobCard({ job, delay }) {
  const [ref, visible] = useIntersection();
  return (
    <div
      ref={ref}
      style={{ display:'flex', gap:'2rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)', transition:`opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}
    >
      {/* Timeline */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
        <div style={{ width:12, height:12, borderRadius:'50%', background:'#00FFB2', boxShadow:'0 0 10px rgba(0,255,178,0.7)', marginTop:4 }} />
        <div style={{ width:1, flex:1, background:'rgba(0,255,178,0.12)', marginTop:4 }} />
      </div>

      {/* Card */}
      <div className="glass-card" style={{ flex:1, padding:'1.75rem', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.5rem' }}>
          <div>
            <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'1.05rem', color:'#E8EDF5', fontWeight:700 }}>{job.role}</h3>
            <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.75rem', color:'#00FFB2', marginTop:'0.2rem' }}>{job.company}</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <span style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.7rem', letterSpacing:'0.12em', color:'#3A4A5C', border:'1px solid rgba(58,74,92,0.4)', padding:'0.2rem 0.6rem', borderRadius:'4px' }}>{job.type}</span>
            <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.68rem', color:'#3A4A5C', marginTop:'0.3rem' }}>{job.period}</p>
          </div>
        </div>
        <ul style={{ listStyle:'none', marginTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {job.bullets.map((b, i) => (
            <li key={i} style={{ display:'flex', gap:'0.75rem', fontFamily:'"DM Mono",monospace', fontSize:'0.76rem', color:'#E8EDF5', opacity:0.72, lineHeight:1.7 }}>
              <span style={{ color:'#00FFB2', flexShrink:0, marginTop:'0.1rem' }}>›</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" style={{ padding:'8rem 8vw', background:'#030712' }} aria-label="Experience">
      <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(2rem,5vw,4rem)', color:'#E8EDF5', marginBottom:'4rem' }}>
        Where I've <span style={{ color:'#FF6B35' }}>Worked</span>
      </h2>
      <div style={{ maxWidth:'780px' }}>
        {JOBS.map((job, i) => <JobCard key={job.company} job={job} delay={i * 120} />)}
      </div>
    </section>
  );
}
