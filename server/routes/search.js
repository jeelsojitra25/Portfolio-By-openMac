const router = require('express').Router();
const Trie = require('../dsa/Trie');

// Pre-load all searchable terms at startup
const trie = new Trie();
const terms = [
  { word: 'code generation', meta: { category: 'capability' } },
  { word: 'math reasoning', meta: { category: 'capability' } },
  { word: 'multilingual', meta: { category: 'capability' } },
  { word: 'long context', meta: { category: 'capability' } },
  { word: 'instruction following', meta: { category: 'capability' } },
  { word: 'tool use', meta: { category: 'capability' } },
  { word: 'mmlu', meta: { category: 'benchmark' } },
  { word: 'humaneval', meta: { category: 'benchmark' } },
  { word: 'gsm8k', meta: { category: 'benchmark' } },
  { word: 'math benchmark', meta: { category: 'benchmark' } },
  { word: 'bbh', meta: { category: 'benchmark' } },
  { word: 'qwen2.5 72b', meta: { category: 'model' } },
  { word: 'qwen2.5 7b', meta: { category: 'model' } },
  { word: 'qwen2.5 14b', meta: { category: 'model' } },
  { word: 'qwen2.5 1.5b', meta: { category: 'model' } },
  { word: 'qwen2.5 0.5b', meta: { category: 'model' } },
  { word: 'apache 2.0 license', meta: { category: 'info' } },
  { word: 'open source', meta: { category: 'info' } },
  { word: 'grouped query attention', meta: { category: 'architecture' } },
  { word: 'swiglu', meta: { category: 'architecture' } },
  { word: 'rope embeddings', meta: { category: 'architecture' } },
  { word: '128k context', meta: { category: 'feature' } },
  { word: 'alibaba cloud', meta: { category: 'info' } },
];
terms.forEach(({ word, meta }) => trie.insert(word, meta));

router.get('/', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  const results = trie.autocomplete(q);
  res.json(results);
});

module.exports = router;
