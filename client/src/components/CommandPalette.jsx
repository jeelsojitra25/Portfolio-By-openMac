import { useEffect, useState, useRef } from 'react';

const COMMANDS = [
  { id: 'about',      label: 'Go to About',           icon: '👤', action: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'skills',     label: 'Go to Skills',           icon: '⚡', action: () => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'experience', label: 'Go to Experience',       icon: '💼', action: () => document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'projects',   label: 'Go to Projects',         icon: '🛠', action: () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'contact',    label: 'Go to Contact',          icon: '✉️', action: () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'email',      label: 'Copy Email Address',     icon: '📋', action: () => { navigator.clipboard.writeText('Jeelsojitra2512@gmail.com'); } },
  { id: 'github',     label: 'Open GitHub',            icon: '🐙', action: () => window.open('https://github.com/jeelsojitra25', '_blank') },
  { id: 'linkedin',   label: 'Open LinkedIn',          icon: '🔗', action: () => window.open('https://linkedin.com/in/jeelsojitra', '_blank') },
  { id: 'applymate',  label: 'View ApplyMate on GitHub', icon: '🤖', action: () => window.open('https://github.com/jeelsojitra25/ApplyMate', '_blank') },
  { id: 'top',        label: 'Back to Top',            icon: '⬆️', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
];

export default function CommandPalette() {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState('');
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const run = (cmd) => {
    if (cmd.id === 'email') {
      cmd.action();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      cmd.action();
      setOpen(false);
    }
    setQuery('');
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) run(filtered[selected]);
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open command palette"
      style={{
        position:'fixed', bottom:'2rem', right:'2rem', zIndex:1500,
        fontFamily:'"DM Mono",monospace', fontSize:'0.72rem', letterSpacing:'0.06em',
        padding:'0.55rem 1rem', borderRadius:'10px',
        background:'rgba(3,7,18,0.85)', backdropFilter:'blur(16px)',
        border:'1px solid rgba(0,255,178,0.2)', color:'#3A4A5C',
        cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem',
        transition:'border-color 0.2s, color 0.2s',
        boxShadow:'0 0 20px rgba(0,255,178,0.06)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,255,178,0.5)'; e.currentTarget.style.color='#E8EDF5'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,255,178,0.2)'; e.currentTarget.style.color='#3A4A5C'; }}
    >
      <span>⌘ K</span>
      <span style={{ opacity:0.5 }}>·</span>
      <span>Quick Actions</span>
    </button>
  );

  return (
    <>
      {/* Backdrop */}
      <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(3,7,18,0.7)', backdropFilter:'blur(6px)', zIndex:1499 }} aria-hidden="true" />

      {/* Palette */}
      <div
        role="dialog"
        aria-label="Command palette"
        style={{
          position:'fixed', top:'20vh', left:'50%', transform:'translateX(-50%)',
          width:'min(540px, 92vw)', zIndex:1500,
          background:'rgba(6,12,26,0.97)', backdropFilter:'blur(24px)',
          border:'1px solid rgba(0,255,178,0.15)', borderRadius:'16px',
          boxShadow:'0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,178,0.05)',
          overflow:'hidden',
        }}
      >
        {/* Search input */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A4A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={onKey}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              fontFamily:'"DM Mono",monospace', fontSize:'0.9rem', color:'#E8EDF5',
            }}
          />
          <span style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.65rem', color:'#3A4A5C', border:'1px solid rgba(58,74,92,0.4)', padding:'0.15rem 0.4rem', borderRadius:'4px' }}>ESC</span>
        </div>

        {/* Results */}
        <ul style={{ listStyle:'none', padding:'0.5rem', maxHeight:'320px', overflowY:'auto' }} role="listbox">
          {filtered.length === 0 && (
            <li style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.8rem', color:'#3A4A5C', padding:'1rem', textAlign:'center' }}>No results</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              role="option"
              aria-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={() => run(cmd)}
              style={{
                display:'flex', alignItems:'center', gap:'0.9rem',
                padding:'0.7rem 1rem', borderRadius:'10px', cursor:'pointer',
                background: i === selected ? 'rgba(0,255,178,0.07)' : 'transparent',
                transition:'background 0.12s',
              }}
            >
              <span style={{ fontSize:'1rem', width:'20px', textAlign:'center', flexShrink:0 }}>{cmd.icon}</span>
              <span style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.82rem', color: i === selected ? '#E8EDF5' : '#3A4A5C', flex:1 }}>
                {cmd.id === 'email' && copied ? '✓ Copied to clipboard!' : cmd.label}
              </span>
              {i === selected && (
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.62rem', color:'#3A4A5C', border:'1px solid rgba(58,74,92,0.4)', padding:'0.15rem 0.4rem', borderRadius:'4px' }}>↵</span>
              )}
            </li>
          ))}
        </ul>

        {/* Footer hint */}
        <div style={{ padding:'0.6rem 1.25rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'1.25rem' }}>
          {[['↑↓','Navigate'],['↵','Select'],['esc','Close']].map(([key, hint]) => (
            <span key={key} style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontFamily:'"DM Mono",monospace', fontSize:'0.62rem', color:'#3A4A5C' }}>
              <span style={{ border:'1px solid rgba(58,74,92,0.4)', borderRadius:'3px', padding:'0.1rem 0.35rem' }}>{key}</span>
              {hint}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
