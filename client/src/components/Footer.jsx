import { useRef } from 'react';

function spawnConfetti(el) {
  const colors = ['#00FFB2', '#FF6B35', '#E8EDF5'];
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.cssText = `left:${rect.left + rect.width/2 + (Math.random()-0.5)*80}px;top:${rect.top}px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-delay:${Math.random()*0.3}s;animation-duration:${0.6+Math.random()*0.4}s;`;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

export default function Footer() {
  const nameRef = useRef(null);
  return (
    <footer style={{ padding:'3rem 8vw', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem' }} role="contentinfo">
      <div>
        <p style={{ fontFamily:'"Playfair Display",serif', fontSize:'1.25rem', color:'#E8EDF5', fontWeight:700 }}>
          Jeel{' '}
          <span
            ref={nameRef}
            onMouseEnter={() => spawnConfetti(nameRef.current)}
            style={{ color:'#00FFB2', cursor:'pointer', userSelect:'none' }}
            title="Made with care"
          >Sojitra</span>
        </p>
        <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.68rem', color:'#3A4A5C', marginTop:'0.3rem' }}>
          © {new Date().getFullYear()} · Winnipeg, MB · Open to opportunities
        </p>
      </div>

      <nav aria-label="Footer links">
        <ul style={{ display:'flex', gap:'2rem', listStyle:'none', flexWrap:'wrap' }}>
          {[
            { label:'GitHub',    href:'https://github.com/jeelsojitra25' },
            { label:'LinkedIn',  href:'https://linkedin.com/in/jeelsojitra' },
            { label:'Email',     href:'mailto:Jeelsojitra2512@gmail.com' },
            { label:'Website',   href:'https://jeelsojitra.tech' },
          ].map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.75rem', color:'#3A4A5C', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#00FFB2'}
                onMouseLeave={e => e.target.style.color='#3A4A5C'}
              >{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
