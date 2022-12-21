/* Dijakstra's */

class PriorityQueue {
  constructor() {
    this.PQ = [];
    this.map = {};
  }

  size() {
    return this.PQ.length;
  }

  leftChildIdx(idx) {
    let childIdx = 2 * idx + 1;
    return childIdx;
  }

  rightChildIdx(idx) {
    let childIdx = 2 * idx + 2;
    return childIdx;
  }

  parentIdx(idx) {
    return Math.floor((idx - 1) / 2);
  }

  isEmpty() {
    return this.size() === 0;
  }

  swim(k) {
    let parent = this.parentIdx(k);
    while (k > 0 && this.less(k, parent)) {
      this.swap(parent, k);
      k = parent;
      parent = this.parentIdx(k);
    }
  }

  add(val) {
    this.PQ.push(val);
    if (!this.map[val[0]]) this.map[val[0]] = [this.size() - 1];
    else this.map[val[0]].push(this.size() - 1);
    this.swim(this.size() - 1);
  }

  poll() {
    return this.removeAt(0);
  }

  swap(i, j) {
    let temp = this.PQ[i];
    this.map[this.PQ[i][0]] = j;
    this.map[this.PQ[j][0]] = i;
    this.PQ[i] = this.PQ[j];
    this.PQ[j] = temp;
  }

  less(i, j) {
    return this.PQ[i][1] <= this.PQ[j][1];
  }

  sink(k) {
    while (true) {
      let left = this.leftChildIdx(k);
      let right = this.rightChildIdx(k);
      let smallest = left;

      if (right < this.size() && this.less(right, left)) smallest = right;
      if (left >= this.size() || this.less(k, smallest)) break;

      this.swap(smallest, k);
      k = smallest;
    }
  }

  remove(el) {
    let idx = this.map[el];
    if (idx) this.removeAt(idx);
    return Boolean(idx);
  }

  removeAt(i) {
    if (this.isEmpty()) return null;
    let removed_data = this.PQ[i];
    this.swap(i, this.size() - 1);
    this.PQ.pop();
    delete this.map[removed_data[0]];

    if (i === this.size()) return removed_data;
    let el = this.PQ[i][0];
    this.sink(i);
    if (this.PQ[i][0] === el) this.swim(i);
    return removed_data;
  }
}

function convertToAdjList(grid, R, C) {
  let adjList = {};

  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, 1, -1];

  const explore_neighbours = (r, c) => {
    let n = [];
    for (let i = 0; i < 4; i++) {
      let rr = r + dr[i];
      let cc = c + dc[i];
      if (rr < 0 || cc < 0) continue;
      if (rr >= R || cc >= C) continue;
      if (grid[rr][cc].type === "wall") continue;
      n.push([`${rr}:${cc}`, grid[rr][cc].weight]);
    }
    return n;
  };

  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      adjList[`${i}:${j}`] = explore_neighbours(i, j);
    }
  }

  return adjList;
}

// Can improve performance using Indexed Priority Queue

export function dijakstra(grid, start, target, R, C) {
  let adjList = convertToAdjList(grid, R, C);
  let visited = {};
  let dist = {};
  let prev = {};
  let visitedOrdered = [];
  let s = `${start.x}:${start.y}`;
  dist[s] = 0;
  let pq = new PriorityQueue();
  pq.add([s, 0]);

  while (!pq.isEmpty()) {
    const [id, minVal] = pq.poll();
    visited[id] = true;
    let [id_x, id_y] = id.split(":");
    visitedOrdered.push(grid[id_x][id_y]);
    if (dist[id] < minVal) continue;
    for (let [edgeId, weight] of adjList[id]) {
      if (visited[edgeId]) continue;
      let newDist = dist[id] + weight;
      if (!dist[edgeId] || newDist < dist[edgeId]) {
        prev[edgeId] = grid[id_x][id_y];
        dist[edgeId] = newDist;
        pq.add([edgeId, newDist]);
      }
    }
    if (grid[id_x][id_y] === target) break;
  }

  const reconstructPath = (prev, start, target) => {
    let path = [];
    for (let at = target; at !== undefined; at = prev[`${at.x}:${at.y}`]) {
      path.push(at);
    }
    path.reverse();
    if (path[0].isSame(start)) return path;
    return [];
  };

  return {
    dist,
    path: reconstructPath(prev, start, target),
    visitedOrdered,
  };
}
