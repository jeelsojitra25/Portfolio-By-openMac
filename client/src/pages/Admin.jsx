import { useState } from 'react';

export default function Admin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken]       = useState(null);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
      const { accessToken } = await res.json();
      setToken(accessToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#E8EDF5', fontFamily: '"DM Mono", monospace', fontSize: '0.85rem', outline: 'none',
  };

  if (token) {
    return (
      <div style={{ padding: '8rem 8vw', minHeight: '100vh', background: '#030712' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', color: '#00FFB2', marginBottom: '2rem' }}>Admin Dashboard</h1>
        <p style={{ fontFamily: '"DM Mono", monospace', color: '#E8EDF5', opacity: 0.7 }}>Authenticated. Token: <code style={{ color: '#00FFB2' }}>{token.slice(0, 30)}…</code></p>
        <button onClick={() => { fetch('/api/auth/logout', { method: 'POST', credentials: 'include', headers: { Authorization: `Bearer ${token}` } }); setToken(null); }}
          style={{ marginTop: '2rem', padding: '0.65rem 1.5rem', background: '#FF6B35', color: '#030712', border: 'none', borderRadius: '8px', fontFamily: '"DM Mono", monospace', cursor: 'pointer' }}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#030712' }}>
      <form onSubmit={login} aria-label="Admin login" style={{ width: '100%', maxWidth: '380px', padding: '2.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', color: '#E8EDF5', marginBottom: '2rem', fontSize: '1.5rem' }}>Admin Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} aria-label="Email" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} aria-label="Password" />
        {error && <p style={{ color: '#FF6B35', fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#00FFB2', color: '#030712', border: 'none', borderRadius: '10px', fontFamily: '"DM Mono", monospace', fontSize: '0.9rem', cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
