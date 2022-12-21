export const dfs = (grid, start, target, R, C) => {
  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, 1, -1];

  const visited = [];
  for (let i = 0; i < R; i++) {
    let curr = [];
    for (let j = 0; j < C; j++) curr.push(false);
    visited.push(curr);
  }
  const visitedOrdered = [];
  const prev = {};
  let found = false;

  const stack = [];

  const explore_neighbours = (r, c, R, C) => {
    for (let i = 0; i < 4; i++) {
      let rr = r + dr[i];
      let cc = c + dc[i];

      if (rr < 0 || cc < 0 || rr >= R || cc >= C) continue;
      if (grid[rr][cc].type === "wall") continue;
      if (visited[rr][cc]) continue;

      visited[rr][cc] = true;
      visitedOrdered.push(grid[rr][cc]);
      prev[`${rr}:${cc}`] = grid[r][c];
      stack.push(grid[rr][cc]);
    }
  };

  stack.push(start);
  visited[start.x][start.y] = true;

  while (stack.length) {
    let curr = stack.pop();
    let r = curr.x;
    let c = curr.y;
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
};
