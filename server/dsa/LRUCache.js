/**
 * LRU Cache with TTL support
 * Time: O(1) get/put | Space: O(capacity)
 */
class LRUCache {
  constructor(capacity = 500, ttlMs = 5 * 60 * 1000) {
    this.capacity = capacity;
    this.ttlMs = ttlMs;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    // Sentinel nodes
    this.head = { key: null, value: null, prev: null, next: null };
    this.tail = { key: null, value: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _isExpired(node) {
    return Date.now() - node.timestamp > this.ttlMs;
  }

  get(key) {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }
    const node = this.cache.get(key);
    if (this._isExpired(node)) {
      this._remove(node);
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    this._remove(node);
    this._addToFront(node);
    this.hits++;
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this._remove(this.cache.get(key));
    }
    const node = { key, value, timestamp: Date.now(), prev: null, next: null };
    this.cache.set(key, node);
    this._addToFront(node);
    if (this.cache.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.cache.delete(lru.key);
    }
  }

  stats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total ? ((this.hits / total) * 100).toFixed(2) + '%' : '0%',
      size: this.cache.size,
      capacity: this.capacity,
    };
  }

  invalidate(key) {
    if (this.cache.has(key)) {
      this._remove(this.cache.get(key));
      this.cache.delete(key);
    }
  }
}

module.exports = LRUCache;
