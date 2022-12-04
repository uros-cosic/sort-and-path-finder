/* Bellman-Ford */

/* Very slow performance */

function Edge(from, to, cost) {
  this.from = from;
  this.to = to;
  this.cost = cost;
}

const convertToEdgeList = (arr, R, C) => {
  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, 1, -1];
  let edgeList = [];
  let V = {};

  const explore_neighbours = (r, c, edgeList) => {
    for (let i = 0; i < 4; i++) {
      let rr = r + dr[i];
      let cc = c + dc[i];
      if (rr < 0 || cc < 0) continue;
      if (rr >= R || cc >= C) continue;
      if (arr[rr][cc].type === "wall") continue;
      edgeList.push(new Edge(arr[r][c], arr[rr][cc], arr[rr][cc].weight));
      V[`${rr}:${cc}`] = true;
    }
  };

  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      if (arr[i][j].type === "wall") continue;
      explore_neighbours(i, j, edgeList);
    }
  }

  return {
    edgeList,
    V: Object.keys(V).length,
  };
};

export function bellmanFord(arr, start, target, R, C) {
  const { edgeList, V } = convertToEdgeList(arr, R, C);
  let dist = {};
  let prev = {};
  let visited = {};
  let visitedOrdered = [];
  let s = `${start.x}:${start.y}`;
  dist[s] = 0;
  for (let i = 0; i < V - 1; i++) {
    for (const edge of edgeList) {
      let { from, to, cost } = edge;
      let fromId = `${from.x}:${from.y}`;
      let toId = `${to.x}:${to.y}`;
      if (dist[toId] === undefined) dist[toId] = Number.POSITIVE_INFINITY;
      if (dist[fromId] === undefined) dist[fromId] = Number.POSITIVE_INFINITY;
      if (dist[fromId] + cost < dist[toId]) {
        dist[toId] = dist[fromId] + cost;
        if (!visited[toId]) visitedOrdered.push(to);
        visited[toId] = true;
        prev[toId] = from;
      }
    }
  }

  // Find nodes that are the part of the negative cycle
  for (let i = 0; i < V - 1; i++) {
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
    let targetId = `${target.x}:${target.y}`;
    // Target is unreachable
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
    path: reconstructPath(prev, target),
    visitedOrdered,
  };
}
