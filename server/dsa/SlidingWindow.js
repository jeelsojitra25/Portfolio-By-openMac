/**
 * Sliding Window Rate Limiter — O(1) per request
 * Circular buffer of timestamps per IP
 */
class SlidingWindow {
  constructor(windowMs = 60_000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.clients = new Map(); // ip -> { buffer, pointer, count }
  }

  _getClient(ip) {
    if (!this.clients.has(ip)) {
      this.clients.set(ip, {
        buffer: new Array(this.maxRequests).fill(0),
        pointer: 0,
        count: 0,
      });
    }
    return this.clients.get(ip);
  }

  /** Returns { allowed, remaining, retryAfter } */
  check(ip) {
    const now = Date.now();
    const client = this._getClient(ip);
    const windowStart = now - this.windowMs;

    // Count valid timestamps in the window
    let valid = 0;
    for (let i = 0; i < this.maxRequests; i++) {
      if (client.buffer[i] > windowStart) valid++;
    }

    if (valid >= this.maxRequests) {
      // Find oldest timestamp to compute retry-after
      const oldest = Math.min(...client.buffer.filter(t => t > windowStart));
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((oldest + this.windowMs - now) / 1000),
      };
    }

    // Record this request
    client.buffer[client.pointer] = now;
    client.pointer = (client.pointer + 1) % this.maxRequests;

    return { allowed: true, remaining: this.maxRequests - valid - 1, retryAfter: 0 };
  }

  cleanup() {
    const cutoff = Date.now() - this.windowMs;
    for (const [ip, client] of this.clients) {
      const hasRecent = client.buffer.some(t => t > cutoff);
      if (!hasRecent) this.clients.delete(ip);
    }
  }
}

module.exports = SlidingWindow;
