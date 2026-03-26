const router = require('express').Router();
const nodemailer = require('nodemailer');
const pool = require('../db/connection');
const { contactRules, validate } = require('../middleware/sanitize');
const crypto = require('crypto');

// ─── SMTP Transport ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup — failure is non-fatal
transporter.verify((err) => {
  if (err) {
    console.warn('[mailer] SMTP not available:', err.message);
  } else {
    console.log('[mailer] SMTP ready');
  }
});

// ─── Route ────────────────────────────────────────────────────────────
router.post('/', contactRules, validate, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const ip = req.ip || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

    await pool.query(
      'INSERT INTO contacts (name, email, message, ip_hash) VALUES ($1, $2, $3, $4)',
      [name, email, message, ipHash]
    );

    // Send notification email — non-blocking; failure does not affect the response
    const to = process.env.CONTACT_EMAIL_TO;
    if (to) {
      transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to,
        subject: `New contact from ${name}`,
        text: [
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Message:\n${message}`,
        ].join('\n'),
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <pre style="font-family:inherit">${message}</pre>
        `,
      }).catch((err) => {
        console.error('[mailer] Failed to send contact notification:', err.message);
      });
    }

    res.status(201).json({ success: true, message: 'Message received. Thank you!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
