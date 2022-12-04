function Node(val, next = null) {
  this.val = val;
  this.next = next;
}

class Queue {
  constructor() {
    this.head = this.tail = null;
    this._size = 0;
  }

  isEmpty() {
    return this._size === 0;
  }

  enqueue(val) {
    let n = new Node(val);
    if (this.isEmpty()) {
      this.head = this.tail = n;
    } else {
      this.tail.next = n;
      this.tail = n;
    }
    this._size += 1;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    let tmp = this.head.val;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this._size -= 1;
    return tmp;
  }
}

export function BFS(grid, start, target, R, C) {
  let visited = [];
  let visitedOrdered = [];
  let prev = {};

  let moveCount = 0;
  let nodesInLayer = 1;
  let nodesInNext = 0;

  for (let i = 0; i < R; i++) {
    let curr = [];
    for (let j = 0; j < C; j++) curr.push(false);
    visited.push(curr);
  }

  let rq = new Queue();
  let cq = new Queue();

  let found = false;

  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, 1, -1];

  const explore_neighbours = (r, c, R, C) => {
    for (let i = 0; i < 4; i++) {
      let rr = r + dr[i];
      let cc = c + dc[i];

      if (rr < 0 || cc < 0 || rr >= R || cc >= C) continue;
      if (grid[rr][cc].type === "wall") continue;
      if (visited[rr][cc]) continue;

      rq.enqueue(rr);
      cq.enqueue(cc);
      nodesInNext += 1;
      visited[rr][cc] = true;
      visitedOrdered.push(grid[rr][cc]);
      prev[`${rr}:${cc}`] = grid[r][c];
    }
  };

  rq.enqueue(start.x);
  cq.enqueue(start.y);

  while (!rq.isEmpty()) {
    let r = rq.dequeue();
    let c = cq.dequeue();
    if (!visited[r][c]) {
      visited[r][c] = true;
      visitedOrdered.push(grid[r][c]);
    }
    if (grid[r][c].target) {
      found = true;
      break;
    }
    explore_neighbours(r, c, R, C);
    nodesInLayer -= 1;
    if (nodesInLayer === 0) {
      moveCount += 1;
      nodesInLayer = nodesInNext;
      nodesInNext = 0;
    }
  }

  const reconstructPath = (start, target, prev) => {
    let path = [];
    for (let at = target; at !== undefined; at = prev[`${at.x}:${at.y}`]) {
      path.push(at);
    }
    path.reverse();
    if (start.isSame(path[0])) return path;
    return [];
  };

  if (found) {
    return {
      path: reconstructPath(start, target, prev),
      visitedOrdered,
      moveCount,
    };
  }

  return {
    path: [],
    visitedOrdered,
    moveCount,
  };
}
