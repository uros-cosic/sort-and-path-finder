import { Cell } from "./Cell";
import { BFS } from "./algorithms/breadthFirstSearch";
import { dijakstra } from "./algorithms/dijakstra";
import { bellmanFord } from "./algorithms/bellmanFord";

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
      rngWeight(),
      grid[target.x][target.y].distance
    );
    target.x = row;
    target.y = col;
    grid[row][col] = target;
  }
  return grid;
};

/* ALGORITHMS */

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
  let { path, visitedOrdered } = bellmanFord(grid, start, target, R, C);

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
