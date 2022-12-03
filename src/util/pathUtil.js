import { Cell } from "./Cell";

const rngWeight = (max = 100, min = 1) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const makeGrid = (
  row,
  col,
  start,
  target,
  keepWalls = false,
  prevGrid = null
) => {
  if (row < 2 || col < 2) return [];
  let res = [];
  for (let i = 0; i < row; i++) {
    let curr = [];
    for (let j = 0; j < col; j++) {
      const rngW = rngWeight();
      if (keepWalls) {
        if (prevGrid[i][j].type === "wall")
          curr.push(new Cell(i, j, "wall", 0));
        else curr.push(new Cell(i, j, "unvisited", rngW));
      } else {
        curr.push(new Cell(i, j, "unvisited", rngW));
      }
    }
    res.push(curr);
  }
  start.start = true;
  start.type = "unvisited";
  target.target = true;
  target.type = "unvisited";
  res[start.x][start.y] = start;
  res[target.x][target.y] = target;
  return res;
};

export const clearGrid = (grid, keepWalls = false) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (keepWalls) {
        if (grid[i][j].type === "wall") continue;
        grid[i][j].type = "unvisited";
      } else {
        if (grid[i][j].type === "wall") grid[i][j].weight = rngWeight();
        grid[i][j].type = "unvisited";
      }
    }
  }
  return grid;
};

export const calculateGridSize = (
  tableStartX,
  tableStartY,
  additionalHeight = 0,
  cellSize = 25
) => {
  const row = Math.floor(
    (window.innerHeight - tableStartX - additionalHeight) / cellSize
  );
  const col = Math.floor((window.innerWidth - tableStartY) / cellSize);
  return {
    row,
    col,
  };
};

export const gridWallToggle = (grid, row, col) => {
  grid[row][col].type = "wall";
  return grid;
};

export const nodeToggle = (grid, row, col, type, start, target) => {
  if (type === "start") {
    grid[start.x][start.y] = new Cell(
      start.x,
      start.y,
      start.type,
      rngWeight()
    );
    start.x = row;
    start.y = col;
    grid[row][col] = start;
  } else {
    grid[target.x][target.y] = new Cell(
      target.x,
      target.y,
      target.type,
      rngWeight()
    );
    target.x = row;
    target.y = col;
    grid[row][col] = target;
  }
  return grid;
};

/* ALGORITHMS */

/* Breadth First Search */

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

function BFS(grid, start, target, R, C) {
  let visited = [];
  let visitedOrdered = [];
  let prev = {};

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
    };
  }

  return {
    path: [],
    visitedOrdered,
  };
}

export function visualizeBFS(grid, start, target, R, C) {
  let res = grid.slice();
  let { path, visitedOrdered } = BFS(grid, start, target, R, C);
  for (let node of visitedOrdered) {
    res[node.x][node.y].type = "visited";
  }
  for (let node of path) {
    res[node.x][node.y].type = "path";
  }
  return res;
}

export function animateBFS(
  grid,
  start,
  target,
  R,
  C,
  updateGrid,
  setIsVisualizing,
  setVisualized,
  visSpeed = 1,
  pathSpeed = 10
) {
  let { path, visitedOrdered } = BFS(grid, start, target, R, C);

  function animateSP(nodes) {
    for (let i = 0; i <= nodes.length; i++) {
      setTimeout(() => {
        if (i === nodes.length) {
          setIsVisualizing(false);
          setVisualized(true);
          return;
        }
        const node = nodes[i];
        grid[node.x][node.y].type = "pathAnimated";
        updateGrid(grid);
      }, pathSpeed * i);
    }
  }

  for (let i = 0; i <= visitedOrdered.length; i++) {
    if (i === visitedOrdered.length) {
      setTimeout(() => {
        animateSP(path);
      }, visSpeed * i);
      return;
    }
    setTimeout(() => {
      const node = visitedOrdered[i];
      grid[node.x][node.y].type = "visitedAnimated";
      updateGrid(grid);
    }, visSpeed * i);
  }
}

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

function dijakstra(grid, start, target, R, C) {
  let adjList = convertToAdjList(grid, R, C);
  //let n = Object.keys(adjList).length;

  let visited = {};
  let dist = {};
  let prev = {};
  let visitedOrdered = [];
  let s = `${start.x}:${start.y}`;
  dist[s] = 0;
  let pq = new PriorityQueue();
  pq.add([s, 0]);

  // Can improve performance by stoping early (target found)
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

export const visualizeDijakstra = (grid, start, target, R, C) => {
  const { path, visitedOrdered } = dijakstra(grid, start, target, R, C);
  for (let node of visitedOrdered) {
    node.type = "visited";
  }

  for (let node of path) {
    node.type = "path";
  }
  return grid;
};

export const animateDijakstra = (
  grid,
  start,
  target,
  R,
  C,
  updateGrid,
  setIsVisualizing,
  setVisualized,
  visSpeed = 1,
  pathSpeed = 10
) => {
  let { path, visitedOrdered } = dijakstra(grid, start, target, R, C);

  function animateSP(nodes) {
    for (let i = 0; i <= nodes.length; i++) {
      setTimeout(() => {
        if (i === nodes.length) {
          setIsVisualizing(false);
          setVisualized(true);
          return;
        }
        const node = nodes[i];
        grid[node.x][node.y].type = "pathAnimated";
        updateGrid(grid);
      }, pathSpeed * i);
    }
  }

  for (let i = 0; i <= visitedOrdered.length; i++) {
    if (i === visitedOrdered.length) {
      setTimeout(() => {
        animateSP(path);
      }, visSpeed * i);
      return;
    }
    setTimeout(() => {
      const node = visitedOrdered[i];
      grid[node.x][node.y].type = "visitedAnimated";
      updateGrid(grid);
    }, visSpeed * i);
  }
};

/* Bellman-Ford */

function Edge(from, to, cost) {
  this.from = from;
  this.to = to;
  this.cost = cost;
}

const convertToEdgeList = (arr, R, C) => {
  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, 1, -1];
  const explore_neighbours = (r, c, edgeList, V) => {
    for (let i = 0; i < 4; i++) {
      let rr = r + dr[i];
      let cc = c + dc[i];
      if (rr < 0 || cc < 0) continue;
      if (rr >= R || cc >= C) continue;
      if (arr[rr][cc].type === "wall") continue;
      edgeList.push(new Edge(arr[r][c], arr[rr][cc], arr[rr][cc].weight));
      V++;
    }
  };
  let edgeList = [];
  let V = 0;
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      explore_neighbours(i, j, edgeList, V);
    }
  }
  return {
    edgeList,
    V,
  };
};

function bellmanFord(arr, start, target, R, C) {
  const { edgeList, V } = convertToEdgeList(arr, R, C);
  let dist = {};
  let prev = {};
  let visitedOrdered = [];
  let s = `${start.x}:${start.y}`;
  dist[s] = 0;
  for (let v = 0; v < V - 1; v++) {
    for (const edge of edgeList) {
      let { from, to, cost } = edge;
      let fromId = `${from.x}:${from.y}`;
      let toId = `${to.x}:${to.y}`;
      if (!dist[fromId]) dist[fromId] = Number.NEGATIVE_INFINITY;
      if (!dist[toId]) dist[toId] = Number.NEGATIVE_INFINITY;
      if (dist[fromId] + cost < dist[toId]) {
        dist[toId] = dist[fromId] + cost;
        prev[toId] = from;
        visitedOrdered.push(to);
      }
    }
  }
  // Find nodes that are the part of the negative cycle
  for (let v = 0; v < V - 1; v++) {
    for (const edge of edgeList) {
      let { from, to, cost } = edge;
      let fromId = `${from.x}:${from.y}`;
      let toId = `${to.x}:${to.y}`;
      if (dist[fromId] + cost < dist[toId]) {
        dist[toId] = Number.NEGATIVE_INFINITY;
      }
    }
  }

  const reconstructPath = (prev, target) => {
    // Target is unreachable
    let targetId = `${target.x}:${target.y}`;
    if (dist[targetId] && dist[targetId] === Number.NEGATIVE_INFINITY) {
      return [];
    }
    let path = [];
    for (let at = target; at !== undefined; at = prev[`${at.x}:${at.y}`]) {
      path.push(at);
    }
    path.reverse();
    return path;
  };

  return {
    dist,
    path: reconstructPath(prev, start, target),
    visitedOrdered,
  };
}

export const visualizeBellmanFord = (table, start, target, R, C) => {
  const { visitedOrdered, path } = bellmanFord(table, start, target, R, C);
  for (const node of visitedOrdered) node.type = "visited";
  for (const node of path) node.type = "path";
  return table;
};

export const animateBellmanFord = (
  grid,
  start,
  target,
  R,
  C,
  updateGrid,
  setIsVisualizing,
  setVisualized
) => {
  let { path, visitedOrdered } = dijakstra(grid, start, target, R, C);

  function animateSP(nodes) {
    for (let i = 0; i <= nodes.length; i++) {
      setTimeout(() => {
        if (i === nodes.length) {
          setIsVisualizing(false);
          setVisualized(true);
          return;
        }
        const node = nodes[i];
        grid[node.x][node.y].type = "pathAnimated";
        updateGrid(grid);
      }, 10 * i);
    }
  }

  for (let i = 0; i <= visitedOrdered.length; i++) {
    if (i === visitedOrdered.length) {
      setTimeout(() => {
        animateSP(path);
      }, 1 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedOrdered[i];
      grid[node.x][node.y].type = "visitedAnimated";
      updateGrid(grid);
    }, 1 * i);
  }
};
