import { useState, useRef } from 'react';
import { useSearch } from '../hooks/useSearch';

export default function SearchBar() {
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);
  const { results, loading, search } = useSearch();
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    search(v);
    setOpen(true);
  };

  const handleSelect = (word) => {
    setQuery(word);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div style={{ position: 'relative', maxWidth: '480px' }} role="search" aria-label="Search Qwen2.5 features">
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A4A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search capabilities, benchmarks, models…"
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={open}
          style={{
            width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', color: '#E8EDF5', fontFamily: '"DM Mono", monospace', fontSize: '0.85rem',
            outline: 'none', transition: 'border-color 0.2s',
          }}
          onMouseOver={e => e.target.style.borderColor = 'rgba(0,255,178,0.3)'}
          onMouseOut={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        {loading && (
          <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, border: '2px solid rgba(0,255,178,0.3)', borderTopColor: '#00FFB2', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} aria-hidden="true" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'rgba(3,7,18,0.95)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
            listStyle: 'none', padding: '0.5rem', zIndex: 100,
          }}
        >
          {results.map((r, i) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              onMouseDown={() => handleSelect(r.word)}
              style={{
                padding: '0.6rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                fontFamily: '"DM Mono", monospace', fontSize: '0.8rem', color: '#E8EDF5',
                display: 'flex', justifyContent: 'space-between',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,178,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span>{r.word}</span>
              {r.meta?.category && <span style={{ color: '#3A4A5C', fontSize: '0.7rem' }}>{r.meta.category}</span>}
            </li>
          ))}
        </ul>
      )}

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
