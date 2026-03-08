const router = require('express').Router();
const pool = require('../db/connection');
const { contactRules, validate } = require('../middleware/sanitize');
const crypto = require('crypto');

router.post('/', contactRules, validate, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const ip = req.ip || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

    await pool.query(
      'INSERT INTO contacts (name, email, message, ip_hash) VALUES ($1, $2, $3, $4)',
      [name, email, message, ipHash]
    );

    res.status(201).json({ success: true, message: 'Message received. Thank you!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
