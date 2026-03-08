const LRUCache = require('../dsa/LRUCache');

const cache = new LRUCache(500, 5 * 60_000);

/**
 * LRU cache middleware — caches GET responses by URL
 */
function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') return next();
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }
  res.set('X-Cache', 'MISS');
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.put(key, data);
    return originalJson(data);
  };
  next();
}

module.exports = { cacheMiddleware, cache };
