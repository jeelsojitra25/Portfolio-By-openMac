const router = require('express').Router();
const SlidingWindow = require('../dsa/SlidingWindow');

// ─── Per-IP rate limit: 10 messages / 60 s ────────────────────────────
const chatLimiter = new SlidingWindow(60_000, 10);

// Cleanup stale IPs every 5 minutes
setInterval(() => chatLimiter.cleanup(), 5 * 60_000);

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama3-8b-8192';

const SYSTEM_PROMPT =
  "You are Jeel Sojitra's portfolio assistant. Answer questions about Jeel's skills, " +
  "experience, and projects based on this context: Jeel is a Full-Stack Developer and CS " +
  "student in Manitoba, Canada. He has worked at Government of Manitoba (Technical Records " +
  "Clerk, 2024-2025) and Home Depot (department supervisor). He built ApplyMate (AI job " +
  "application tracker using Groq/React/Spring Boot) and an AI Chat Translation app. His " +
  "skills include React, Node.js, Express, PostgreSQL, Java Spring Boot, Python, Three.js, " +
  "Docker. He is passionate about AI integration and building tools that solve real problems.";

// ─── POST /api/chatbot ────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    // Input validation
    const message = req.body && req.body.message;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message is required and must be a non-empty string.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'message must be 1000 characters or fewer.' });
    }

    // Rate limiting by IP
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const { allowed, remaining, retryAfter } = chatLimiter.check(ip);

    res.set('X-RateLimit-Limit', 10);
    res.set('X-RateLimit-Remaining', remaining);

    if (!allowed) {
      res.set('Retry-After', retryAfter);
      return res.status(429).json({
        error: 'Too many messages. Please wait before sending another.',
        retryAfter,
      });
    }

    // Groq API call
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'Chatbot is not configured.' });
    }

    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message.trim() },
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const errBody = await groqResponse.text();
      console.error('[chatbot] Groq API error:', groqResponse.status, errBody);
      return res.status(502).json({ error: 'Upstream AI service returned an error.' });
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content ?? '';

    return res.json({ reply });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
