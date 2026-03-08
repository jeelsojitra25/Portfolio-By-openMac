/**
 * Min-Heap (Priority Queue)
 * Insert: O(log n) | ExtractMin: O(log n) | Peek: O(1)
 */
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.cmp = comparator;
  }

  size() { return this.heap.length; }
  peek() { return this.heap[0] ?? null; }

  insert(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    if (!this.heap.length) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.cmp(this.heap[i], this.heap[p]) < 0) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.cmp(this.heap[l], this.heap[smallest]) < 0) smallest = l;
      if (r < n && this.cmp(this.heap[r], this.heap[smallest]) < 0) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }

  /** Top-K extraction: O(n log k) */
  static topK(arr, k, comparator = (a, b) => b.score - a.score) {
    const heap = new MinHeap((a, b) => -comparator(a, b));
    for (const item of arr) {
      heap.insert(item);
      if (heap.size() > k) heap.extractMin();
    }
    const result = [];
    while (heap.size()) result.unshift(heap.extractMin());
    return result;
  }
}

module.exports = MinHeap;
