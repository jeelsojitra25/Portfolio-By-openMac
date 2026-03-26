require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const pool = require('./db/connection');
const { cache, cacheMiddleware } = require('./middleware/cache');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authenticate = require('./middleware/authenticate');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Headers ───────────────────────────────────────────────
//
// Helmet v7 enables most headers by default, but the directives below are
// listed explicitly so intent is clear and auditable.
//
// X-Content-Type-Options: nosniff
//   Prevents browsers from MIME-sniffing a response away from the declared
//   Content-Type. Stops certain content-injection attacks (e.g. a text file
//   being interpreted as executable script).
//
// X-Frame-Options: SAMEORIGIN
//   Allows this server's own pages to be framed (e.g. internal previews)
//   while blocking third-party framing, which mitigates clickjacking.
//
// Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
//   Instructs browsers to only contact this host over HTTPS for one year.
//   includeSubDomains extends coverage; preload allows browser-level HSTS.
//
// Referrer-Policy: no-referrer-when-downgrade
//   Sends the full URL as Referer when navigating same-scheme (https→https),
//   but strips it entirely on downgrade (https→http). Balances analytics
//   utility with privacy protection.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
  // X-Content-Type-Options: nosniff — blocks MIME-type sniffing attacks.
  xContentTypeOptions: true,
  // X-Frame-Options: SAMEORIGIN — clickjacking protection.
  frameguard: { action: 'sameorigin' },
  // Strict-Transport-Security — enforce HTTPS for one year.
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  // Referrer-Policy: no-referrer-when-downgrade.
  referrerPolicy: { policy: 'no-referrer-when-downgrade' },
}));
app.use(compression());

// ─── CORS ────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ─── Body / Cookie Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

// ─── HTTPS redirect in production ────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// ─── Logging ─────────────────────────────────────────────────────────
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// Async analytics insert
app.use(async (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const ip = req.ip || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
    pool.query(
      'INSERT INTO analytics (method, path, status, duration, ip_hash) VALUES ($1,$2,$3,$4,$5)',
      [req.method, req.path, res.statusCode, duration, ipHash]
    ).catch(() => {}); // fire-and-forget
  });
  next();
});

// ─── Rate Limiting ────────────────────────────────────────────────────
app.use('/api/', rateLimiter);

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api', require('./routes/api'));
app.use('/api/search', require('./routes/search'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Admin: update benchmark (JWT protected)
app.put('/api/admin/benchmarks/:id', authenticate, (req, res) => {
  // In a real DB-backed scenario update the record; for now return success
  res.json({ success: true, id: req.params.id });
});

// Health
app.get('/api/health', (req, res) => {
  const cacheStats = cache.stats();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cache: cacheStats,
    timestamp: new Date().toISOString(),
  });
});

// Cache API responses for 10 minutes.
cache.ttlMs = 10 * 60 * 1000;

app.get('/api/github-stats', cacheMiddleware, async (_req, res, next) => {
  try {
    const response = await fetch('https://api.github.com/users/jeelsojitra25');
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch GitHub stats' });
    }

    const data = await response.json();
    return res.json({
      repos: data.public_repos,
      followers: data.followers,
      following: data.following,
    });
  } catch (err) {
    return next(err);
  }
});

// ─── Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────
async function runMigrations() {
  const sql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('[db] Schema applied');
}

app.listen(PORT, async () => {
  try {
    await runMigrations();
  } catch (err) {
    console.error('[db] Migration error:', err.message);
  }
  console.log(`[server] Running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

module.exports = app;
