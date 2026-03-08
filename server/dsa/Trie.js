/**
 * Trie with Levenshtein fallback
 * Insert: O(m) | Search: O(m) | Autocomplete: O(m + k)
 * m = word length, k = number of results
 */
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
    this.meta = null; // store category/relevance
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.words = []; // flat list for Levenshtein fallback
  }

  /** @param {string} word @param {Object} meta */
  insert(word, meta = null) {
    const lower = word.toLowerCase();
    if (!this.words.includes(lower)) this.words.push(lower);
    let node = this.root;
    for (const ch of lower) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
    node.meta = meta;
  }

  _dfs(node, prefix, results) {
    if (results.length >= 5) return;
    if (node.isEnd) results.push({ word: prefix, meta: node.meta });
    for (const ch of Object.keys(node.children).sort()) {
      if (results.length >= 5) return;
      this._dfs(node.children[ch], prefix + ch, results);
    }
  }

  autocomplete(prefix) {
    const lower = prefix.toLowerCase();
    let node = this.root;
    for (const ch of lower) {
      if (!node.children[ch]) return this._levenshtein(lower);
      node = node.children[ch];
    }
    const results = [];
    this._dfs(node, lower, results);
    return results.length ? results : this._levenshtein(lower);
  }

  _levenshtein(query) {
    const dist = (a, b) => {
      const dp = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
      );
      for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
          dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] :
            1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      return dp[a.length][b.length];
    };
    return this.words
      .map(w => ({ word: w, score: dist(query, w), meta: null }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }
}

module.exports = Trie;
