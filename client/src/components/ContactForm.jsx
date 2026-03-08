import { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { sanitize } from '../utils/sanitize';
import { apiUrl } from '../utils/api';

const field = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', color: '#E8EDF5', fontFamily: '"DM Mono", monospace', fontSize: '0.85rem',
  outline: 'none', transition: 'border-color 0.2s',
};

export default function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    setForm(f => ({ ...f, [e.target.name]: sanitize(e.target.value) }));
  }, []);

  const debouncedChange = useDebounce(handleChange, 300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
      <input required type="text" name="name" placeholder="Your name" defaultValue={form.name}
        onChange={debouncedChange} style={field} aria-label="Name"
        onFocus={e => e.target.style.borderColor = 'rgba(0,255,178,0.4)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />

      <input required type="email" name="email" placeholder="your@email.com" defaultValue={form.email}
        onChange={debouncedChange} style={field} aria-label="Email"
        onFocus={e => e.target.style.borderColor = 'rgba(0,255,178,0.4)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />

      <textarea required name="message" placeholder="Your message…" rows={5} defaultValue={form.message}
        onChange={debouncedChange} style={{ ...field, resize: 'vertical' }} aria-label="Message"
        onFocus={e => e.target.style.borderColor = 'rgba(0,255,178,0.4)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />

      <button type="submit" disabled={loading} style={{ padding: '0.75rem', background: '#00FFB2', color: '#030712', border: 'none', borderRadius: '10px', fontFamily: '"DM Mono", monospace', fontSize: '0.9rem', fontWeight: 500, cursor: loading ? 'wait' : 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Sending…' : 'Send Message'}
      </button>

      {status === 'success' && <p style={{ color: '#00FFB2', fontFamily: '"DM Mono", monospace', fontSize: '0.8rem' }}>Message received. Thank you!</p>}
      {status === 'error'   && <p style={{ color: '#FF6B35', fontFamily: '"DM Mono", monospace', fontSize: '0.8rem' }}>Something went wrong. Try again.</p>}
    </form>
  );
}
