import { useState, useRef, useEffect, useCallback } from 'react';
import { apiUrl } from '../utils/api';

const CONTACT_EMAIL = 'Jeelsojitra2512@gmail.com';
const MAX_MESSAGES  = 10;
const SESSION_KEY   = 'jeel_ai_chat';

const GREETING = {
  role: 'assistant',
  text: "Hi! I'm Jeel's portfolio AI. Ask me about his skills, experience, or projects.",
};

// ─── sessionStorage helpers ───────────────────────────────────────────────────
function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return [GREETING];
}

function saveSession(messages) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
  } catch {
    // ignore quota errors
  }
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '4px 2px', alignItems: 'center' }} aria-label="Assistant is typing">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: '#00FFB2',
            display: 'inline-block',
            animation: `chatDot 1.1s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '82%',
          padding: '0.55rem 0.85rem',
          borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
          background: isUser
            ? 'rgba(0,255,178,0.14)'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isUser ? 'rgba(0,255,178,0.28)' : 'rgba(255,255,255,0.07)'}`,
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.76rem',
          color: isUser ? '#00FFB2' : '#D6D1C7',
          lineHeight: 1.65,
          wordBreak: 'break-word',
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ─── Chat panel ───────────────────────────────────────────────────────────────
function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState(loadSession);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Persist + scroll on message change
  useEffect(() => {
    saveSession(messages);
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(id);
  }, []);

  const send = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput('');

    const next = [...messages, { role: 'user', text: trimmed }].slice(-MAX_MESSAGES);
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/chatbot'), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: trimmed }),
        signal:  AbortSignal.timeout(12000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = typeof data.reply === 'string' ? data.reply : (data.message ?? 'No response.');

      setMessages(prev => [...prev, { role: 'assistant', text: reply }].slice(-MAX_MESSAGES));
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `AI assistant is offline. Contact Jeel directly at ${CONTACT_EMAIL}.`,
        },
      ].slice(-MAX_MESSAGES));
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Ask Jeel's AI"
      aria-modal="true"
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '24px',
        width: '320px',
        maxWidth: 'calc(100vw - 32px)',
        height: '480px',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(9,11,20,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,255,178,0.22)',
        borderRadius: '18px',
        boxShadow: '0 12px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,255,178,0.06)',
        zIndex: 1200,
        overflow: 'hidden',
        animation: 'chatSlideUp 0.28s cubic-bezier(0.34,1.36,0.64,1) both',
        // Mobile: full width at bottom
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span style={{ fontSize: '1rem', color: '#00FFB2' }}>✦</span>
          <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: '0.88rem', letterSpacing: '0.12em', color: '#E8EDF5' }}>
            Ask Jeel&apos;s AI
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: '#8b8597',
            cursor: 'pointer',
            padding: '0.2rem 0.5rem',
            fontFamily: '"DM Mono",monospace',
            fontSize: '0.7rem',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#E8EDF5'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8b8597'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.85rem 0.9rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,255,178,0.2) transparent',
        }}
      >
        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} />
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '14px 14px 14px 3px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        style={{
          display: 'flex',
          gap: '0.45rem',
          padding: '0.75rem 0.9rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask me anything..."
          maxLength={300}
          disabled={loading}
          aria-label="Message input"
          style={{
            flex: 1,
            fontFamily: '"DM Mono",monospace',
            fontSize: '0.75rem',
            padding: '0.55rem 0.8rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#E8EDF5',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e  => { e.currentTarget.style.borderColor = 'rgba(0,255,178,0.4)'; }}
          onBlur={e   => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Send message"
          style={{
            fontFamily: '"DM Mono",monospace',
            fontSize: '0.72rem',
            padding: '0.55rem 0.9rem',
            borderRadius: '8px',
            border: '1px solid rgba(0,255,178,0.5)',
            background: 'rgba(0,255,178,0.1)',
            color: '#00FFB2',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            opacity: input.trim() && !loading ? 1 : 0.4,
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

// ─── Floating trigger button ──────────────────────────────────────────────────
function TriggerButton({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close chat' : 'Open portfolio AI chat'}
      aria-expanded={open}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: open ? 'rgba(9,11,20,0.95)' : '#00FFB2',
        border: open ? '1.5px solid rgba(0,255,178,0.6)' : 'none',
        boxShadow: open
          ? '0 0 0 4px rgba(0,255,178,0.12), 0 4px 20px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,255,178,0.4), 0 0 0 4px rgba(0,255,178,0.12)',
        cursor: 'pointer',
        zIndex: 1201,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        color: open ? '#00FFB2' : '#030712',
        transition: 'background 0.25s, box-shadow 0.25s, transform 0.2s',
        transform: open ? 'rotate(180deg) scale(0.92)' : 'scale(1)',
      }}
      onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'scale(1.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = open ? 'rotate(180deg) scale(0.92)' : 'scale(1)'; }}
    >
      {open ? '✕' : '✉'}
    </button>
  );
}

// ─── Root export — mounts globally in App.jsx ─────────────────────────────────
export default function AIChatbot() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen(v => !v), []);
  const close  = useCallback(() => setOpen(false),   []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.45; }
          40%            { transform: scale(1);   opacity: 1;    }
        }
        @media (max-width: 480px) {
          /* Full-width panel pinned to bottom on small screens */
          [role="dialog"][aria-label="Ask Jeel's AI"] {
            right: 0 !important;
            bottom: 80px !important;
            width: 100vw !important;
            max-width: 100vw !important;
            border-radius: 18px 18px 0 0 !important;
          }
        }
      `}</style>

      {open && <ChatPanel onClose={close} />}
      <TriggerButton open={open} onClick={toggle} />
    </>
  );
}
