const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db/connection');
const authenticate = require('../middleware/authenticate');
const { loginRules, validate } = require('../middleware/sanitize');

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: ACCESS_TTL,
  });
}

function signRefresh(payload) {
  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: REFRESH_TTL,
  });
}

router.post('/login', loginRules, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { sub: rows[0].id, email: rows[0].email };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (admin_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [rows[0].id, tokenHash, expiresAt]
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7 * 24 * 3600 * 1000,
    });
    res.json({ accessToken });
  } catch (err) { next(err); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const { rows } = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked = FALSE AND expires_at > NOW()',
      [tokenHash]
    );
    if (!rows.length) return res.status(401).json({ error: 'Refresh token revoked or expired' });

    const accessToken = signAccess({ sub: decoded.sub, email: decoded.email });
    res.json({ accessToken });
  } catch (err) { next(err); }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await pool.query('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1', [tokenHash]);
      res.clearCookie('refresh_token');
    }
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
