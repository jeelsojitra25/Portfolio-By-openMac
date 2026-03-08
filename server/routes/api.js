const router = require('express').Router();
const { cacheMiddleware } = require('../middleware/cache');
const benchmarks = require('../data/benchmarks.json');
const models = require('../data/models.json');
const capabilities = require('../data/capabilities.json');
const archData = require('../data/architecture.json');
const TopologicalSort = require('../dsa/TopologicalSort');
const MinHeap = require('../dsa/MinHeap');

// Binary search helper: O(log n) score range query
function binarySearchRange(sorted, min, max) {
  const results = [];
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const avg = Object.values(sorted[mid].scores).reduce((a, b) => a + b, 0) / 3;
    if (avg < min) lo = mid + 1;
    else if (avg > max) hi = mid - 1;
    else {
      // Expand both directions
      let l = mid, r = mid;
      while (l > 0 && Object.values(sorted[l-1].scores).reduce((a,b)=>a+b,0)/3 >= min) l--;
      while (r < sorted.length - 1 && Object.values(sorted[r+1].scores).reduce((a,b)=>a+b,0)/3 <= max) r++;
      return sorted.slice(l, r + 1);
    }
  }
  return results;
}

const sortedBenchmarks = [...benchmarks].sort((a, b) => {
  const avgA = Object.values(a.scores).reduce((x, y) => x + y, 0) / 3;
  const avgB = Object.values(b.scores).reduce((x, y) => x + y, 0) / 3;
  return avgA - avgB;
});

router.get('/benchmarks', cacheMiddleware, (req, res) => {
  const { min, max } = req.query;
  if (min !== undefined && max !== undefined) {
    return res.json(binarySearchRange(sortedBenchmarks, parseFloat(min), parseFloat(max)));
  }
  // Top-K via MinHeap
  const top = MinHeap.topK(benchmarks, 5, (a, b) => a.scores.qwen25 - b.scores.qwen25);
  res.json(top);
});

router.get('/stats', cacheMiddleware, (_req, res) => {
  res.json({
    parameters: '72B',
    contextWindow: '128K',
    languages: 29,
    variants: ['0.5B', '1.5B', '7B', '14B', '72B'],
    license: 'Apache 2.0',
    organization: 'Alibaba Cloud',
  });
});

router.get('/models', cacheMiddleware, (_req, res) => res.json(models));

router.get('/capabilities', cacheMiddleware, (_req, res) => res.json(capabilities));

router.get('/architecture', cacheMiddleware, (_req, res) => {
  const dag = TopologicalSort.fromJSON(archData);
  const sorted = dag.sort();
  res.json({ nodes: sorted, edges: archData.edges });
});

module.exports = router;
