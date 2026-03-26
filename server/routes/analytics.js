const router = require('express').Router();
const pool = require('../db/connection');

// ─── GET /api/analytics/summary ──────────────────────────────────────
// Returns: total contact submissions, this-month submissions, total page views
router.get('/summary', async (_req, res, next) => {
  try {
    const [contactTotal, contactMonth, pageViews] = await Promise.all([
      // Total contact submissions
      pool.query('SELECT COUNT(*) AS count FROM contacts'),

      // Contact submissions this calendar month
      pool.query(
        `SELECT COUNT(*) AS count
           FROM contacts
          WHERE date_trunc('month', created_at) = date_trunc('month', NOW())`
      ),

      // Page views: GET requests to non-API paths recorded by the analytics middleware
      pool.query(
        `SELECT COUNT(*) AS count
           FROM analytics
          WHERE method = 'GET'
            AND path NOT LIKE '/api/%'`
      ),
    ]);

    res.json({
      contacts: {
        total: Number(contactTotal.rows[0].count),
        thisMonth: Number(contactMonth.rows[0].count),
      },
      pageViews: Number(pageViews.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/analytics/pageview ────────────────────────────────────
// Manually records a page view into the analytics table
router.post('/pageview', async (req, res, next) => {
  try {
    const pagePath = (req.body && req.body.path) ? String(req.body.path).slice(0, 255) : '/';

    await pool.query(
      `INSERT INTO analytics (method, path, status, duration, ip_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      ['GET', pagePath, 200, 0, null]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
