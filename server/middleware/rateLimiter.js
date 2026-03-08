const SlidingWindow = require('../dsa/SlidingWindow');
const BloomFilter = require('../dsa/BloomFilter');
const crypto = require('crypto');

const window = new SlidingWindow(60_000, 100);
const strictWindow = new SlidingWindow(60_000, 20);
const bloom = new BloomFilter();

// Cleanup stale IPs every 5 minutes
setInterval(() => window.cleanup(), 5 * 60_000);

function hashIp(ip) {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'salt').digest('hex').slice(0, 16);
}

/**
 * Sliding window + bloom filter rate limiter middleware
 */
function rateLimiter(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const hashed = hashIp(ip);

  // Bloom filter: suspicious IPs get stricter limit
  const limiter = bloom.mightContain(hashed) ? strictWindow : window;
  const { allowed, remaining, retryAfter } = limiter.check(hashed);

  res.set('X-RateLimit-Limit', limiter.maxRequests);
  res.set('X-RateLimit-Remaining', remaining);

  if (!allowed) {
    bloom.add(hashed); // flag this IP
    res.set('Retry-After', retryAfter);
    return res.status(429).json({
      error: 'Too Many Requests',
      retryAfter,
    });
  }

  next();
}

module.exports = rateLimiter;
