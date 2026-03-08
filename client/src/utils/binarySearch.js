/**
 * Binary search for benchmarks in score range [min, max]
 * Expects pre-sorted array by avg score. O(log n)
 * @param {Array} sorted - sorted benchmark array
 * @param {number} min
 * @param {number} max
 */
export function binarySearchRange(sorted, min, max) {
  const avg = (b) => Object.values(b.scores).reduce((a, c) => a + c, 0) / Object.values(b.scores).length;

  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const score = avg(sorted[mid]);
    if (score < min) { lo = mid + 1; }
    else if (score > max) { hi = mid - 1; }
    else {
      let l = mid, r = mid;
      while (l > 0 && avg(sorted[l - 1]) >= min) l--;
      while (r < sorted.length - 1 && avg(sorted[r + 1]) <= max) r++;
      return sorted.slice(l, r + 1);
    }
  }
  return [];
}
