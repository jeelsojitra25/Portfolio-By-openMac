/**
 * Topological Sort (Kahn's Algorithm — BFS)
 * Time: O(V + E) | Space: O(V)
 * Used to order architecture diagram layers by dependency
 */
class TopologicalSort {
  constructor() {
    this.graph = new Map();  // node -> [neighbors]
    this.inDegree = new Map();
    this.nodes = new Map();  // id -> node data
  }

  addNode(id, data = {}) {
    this.nodes.set(id, { id, ...data });
    if (!this.graph.has(id)) this.graph.set(id, []);
    if (!this.inDegree.has(id)) this.inDegree.set(id, 0);
  }

  addEdge(from, to) {
    if (!this.graph.has(from)) this.addNode(from);
    if (!this.graph.has(to)) this.addNode(to);
    this.graph.get(from).push(to);
    this.inDegree.set(to, (this.inDegree.get(to) || 0) + 1);
  }

  sort() {
    const queue = [];
    const result = [];

    // Enqueue all nodes with in-degree 0
    for (const [id, deg] of this.inDegree) {
      if (deg === 0) queue.push(id);
    }

    while (queue.length) {
      const node = queue.shift();
      result.push({ ...this.nodes.get(node), order: result.length });

      for (const neighbor of (this.graph.get(node) || [])) {
        const newDeg = this.inDegree.get(neighbor) - 1;
        this.inDegree.set(neighbor, newDeg);
        if (newDeg === 0) queue.push(neighbor);
      }
    }

    if (result.length !== this.nodes.size) {
      throw new Error('Cycle detected in DAG');
    }

    return result;
  }

  /** Build from JSON { nodes: [{id,...}], edges: [{from,to}] } */
  static fromJSON({ nodes = [], edges = [] }) {
    const g = new TopologicalSort();
    for (const n of nodes) g.addNode(n.id, n);
    for (const e of edges) g.addEdge(e.from, e.to);
    return g;
  }
}

module.exports = TopologicalSort;
