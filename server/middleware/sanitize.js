const { body, validationResult } = require('express-validator');

/**
 * Contact form validation rules
 */
const contactRules = [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 1, max: 2000 }).escape(),
];

/**
 * Admin login validation rules
 */
const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8, max: 128 }),
];

/**
 * Middleware to check validation results
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }
  next();
}

module.exports = { contactRules, loginRules, validate };
