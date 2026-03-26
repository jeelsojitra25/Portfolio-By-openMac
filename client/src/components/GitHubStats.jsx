import { useEffect, useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';

const USERNAME = 'jeelsojitra25';

function Counter({ target, visible, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible || !target) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(2rem,5vw,3.5rem)', color:'#00FFB2', fontWeight:900 }}>
      {count}{suffix}
    </span>
  );
}

export default function GitHubStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);
  const [ref, visible] = useIntersection();

  useEffect(() => {
    fetch('/api/github-stats')
      .then(r => r.json())
      .then(d => {
        if (d.repos !== undefined) {
          setStats({ repos: d.repos, followers: d.followers, following: d.following });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  const items = stats
    ? [
        { label: 'Public Repos',  value: stats.repos,     suffix: '' },
        { label: 'Followers',     value: stats.followers,  suffix: '' },
        { label: 'Following',     value: stats.following,  suffix: '' },
        { label: 'Languages',     value: 4,               suffix: '+' },
      ]
    : null;

  return (
    <section ref={ref} id="githubstats" style={{ padding:'6rem 8vw', background:'#030712', borderTop:'1px solid rgba(255,255,255,0.04)' }} aria-label="GitHub statistics">
      <p style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.8rem', letterSpacing:'0.2em', color:'#3A4A5C', marginBottom:'3rem' }}>
        GITHUB · LIVE STATS
      </p>

      {error && (
        <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.8rem', color:'#3A4A5C' }}>
          Stats temporarily unavailable — <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer" style={{ color:'#00FFB2' }}>visit GitHub directly</a>
        </p>
      )}

      {!stats && !error && (
        <div style={{ display:'flex', gap:'3rem', flexWrap:'wrap' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ width:'120px' }}>
              <div style={{ height:'48px', background:'rgba(255,255,255,0.04)', borderRadius:'8px', marginBottom:'0.5rem', animation:'pulse 1.5s ease infinite' }} />
              <div style={{ height:'14px', background:'rgba(255,255,255,0.03)', borderRadius:'4px', width:'70%' }} />
            </div>
          ))}
        </div>
      )}

      {items && (
        <div style={{ display:'flex', gap:'4rem', flexWrap:'wrap', alignItems:'flex-end' }}>
          {items.map(({ label, value, suffix }) => (
            <div key={label}>
              <Counter target={value} visible={visible} suffix={suffix} />
              <p style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:'0.72rem', letterSpacing:'0.15em', color:'#3A4A5C', marginTop:'0.4rem' }}>{label}</p>
            </div>
          ))}
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.78rem', color:'#00FFB2', textDecoration:'none', border:'1px solid rgba(0,255,178,0.25)', padding:'0.6rem 1.25rem', borderRadius:'8px', alignSelf:'center', transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(0,255,178,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            View Profile →
          </a>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
    </section>
  );
}
