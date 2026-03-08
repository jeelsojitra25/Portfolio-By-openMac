/**
 * Bloom Filter — O(1) membership check
 * Bit array: 1,000,000 bits | 7 hash functions | ~0.1% false positive rate
 */
const crypto = require('crypto');

class BloomFilter {
  constructor(size = 1_000_000, hashCount = 7) {
    this.size = size;
    this.hashCount = hashCount;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  _hash(item, seed) {
    const h = crypto.createHash('sha256')
      .update(`${seed}:${item}`)
      .digest();
    // Read 4 bytes as unsigned int
    const val = h.readUInt32BE(0);
    return val % this.size;
  }

  _setBit(pos) {
    this.bits[Math.floor(pos / 8)] |= (1 << (pos % 8));
  }

  _getBit(pos) {
    return (this.bits[Math.floor(pos / 8)] >> (pos % 8)) & 1;
  }

  add(item) {
    for (let i = 0; i < this.hashCount; i++) {
      this._setBit(this._hash(item, i));
    }
  }

  mightContain(item) {
    for (let i = 0; i < this.hashCount; i++) {
      if (!this._getBit(this._hash(item, i))) return false;
    }
    return true;
  }
}

module.exports = BloomFilter;
