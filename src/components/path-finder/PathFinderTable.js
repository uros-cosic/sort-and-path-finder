import { useState, useEffect, useContext } from "react";

import Cell from "./Cell";
import { StateContext } from "../../stateContext";
import { FaTrashAlt, FaCaretSquareRight } from "react-icons/fa";

import {
  makeGrid,
  calculateGridSize,
  visualizeBFS,
  animateBFS,
  gridWallToggle,
  nodeToggle,
  visualizeDijakstra,
  visualizeBellmanFord,
  animateBellmanFord,
  animateDijakstra,
  clearGrid,
} from "../../util/pathUtil";
import { Cell as CellNode } from "../../util/Cell";

function PathFinderTable() {
  let { state } = useContext(StateContext);

  const [table, setTable] = useState({
    grid: [],
    start: null,
    target: null,
    row_len: 0,
    col_len: 0,
  });

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualized, setVisualized] = useState(false);

  const [mousePressed, setMousePressed] = useState(false);
  const [nodesChanging, setNodesChanging] = useState({
    node: null,
    changing: false,
  });

  // Get Algorithm
  const getAlgorithm = (algorithmName) => {
    const available = {
      bfs: {
        animate: animateBFS,
        visualize: visualizeBFS,
      },
      "dijakstra's": {
        animate: animateDijakstra,
        visualize: visualizeDijakstra,
      },
      "bellman-ford": {
        animate: animateBellmanFord,
        visualize: visualizeBellmanFord,
      },
    };
    if (!available[algorithmName]) return null;
    return available[algorithmName];
  };

  // Onload
  useEffect(() => {
    const { x, y } = document
      .getElementById("pathTable")
      .getBoundingClientRect();
    const btnsDivHeight = document.getElementById("pathTableBtns").clientHeight;
    const { row, col } = calculateGridSize(y, x, btnsDivHeight);
    const start = new CellNode(1, 1);
    const target = new CellNode(row - 2, col - 2);
    setTable({
      grid: makeGrid(row, col, start, target),
      start,
      target,
      row_len: row,
      col_len: col,
    });
  }, []);

  const updateGrid = (newGrid) => {
    setTable({
      ...table,
      grid: newGrid,
    });
  };

  const handleVisualize = () => {
    let errorEl = document.getElementById("pathFinderError");
    if (!state.algorithm) {
      errorEl.innerText = "Select an Algorithm From Navbar to Visualize It";
      return;
    }
    errorEl.innerText = "";
    if (isVisualizing) return;
    if (visualized) {
      let tmpGrid = clearGrid(table.grid);
      getAlgorithm(state.algorithm)["animate"](
        tmpGrid,
        table.start,
        table.target,
        table.row_len,
        table.col_len,
        updateGrid,
        setIsVisualizing,
        setVisualized
      );
    } else {
      setIsVisualizing(true);
      getAlgorithm(state.algorithm)["animate"](
        table.grid,
        table.start,
        table.target,
        table.row_len,
        table.col_len,
        updateGrid,
        setIsVisualizing,
        setVisualized
      );
    }
  };

  const handleClear = () => {
    if (isVisualizing) return;
    updateGrid(clearGrid(table.grid));
    setVisualized(false);
  };

  const handleMousePress = (row, col) => {
    if (isVisualizing) return;
    setMousePressed(true);
    if (table.start.x === row && table.start.y === col) {
      setNodesChanging({
        node: "start",
        changing: true,
      });
    } else if (table.target.x === row && table.target.y === col) {
      setNodesChanging({
        node: "target",
        changing: true,
      });
    } else {
      table.grid[row][col].weight = 0;
      updateGrid(gridWallToggle(table.grid, row, col));
      if (visualized) {
        let tempGrid = clearGrid(table.grid, true);
        updateGrid(
          getAlgorithm(state.algorithm)["visualize"](
            tempGrid,
            table.start,
            table.target,
            table.row_len,
            table.col_len
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    setMousePressed(false);
    setNodesChanging({
      node: null,
      changing: false,
    });
  };

  const handleMouseEnter = (row, col) => {
    if (!mousePressed) return;
    if (!nodesChanging.changing) {
      let temp = new CellNode(row, col);
      if (!table.start.isSame(temp) && !table.target.isSame(temp)) {
        table.grid[row][col].weight = 0;
        updateGrid(gridWallToggle(table.grid, row, col));
        if (visualized) {
          let tempGrid = clearGrid(table.grid, true);
          updateGrid(
            getAlgorithm(state.algorithm)["visualize"](
              tempGrid,
              table.start,
              table.target,
              table.row_len,
              table.col_len
            )
          );
        }
      }
    } else {
      let nodeType = nodesChanging.node;
      if (nodeType === "start") {
        if (!table.target.isSame(new CellNode(row, col))) {
          updateGrid(
            nodeToggle(
              table.grid,
              row,
              col,
              nodeType,
              table.start,
              table.target
            )
          );
          if (visualized) {
            let tempGrid = clearGrid(table.grid, true);
            updateGrid(
              getAlgorithm(state.algorithm)["visualize"](
                tempGrid,
                table.start,
                table.target,
                table.row_len,
                table.col_len
              )
            );
          }
        }
      }
      if (nodeType === "target") {
        if (!table.start.isSame(new CellNode(row, col))) {
          updateGrid(
            nodeToggle(
              table.grid,
              row,
              col,
              nodeType,
              table.start,
              table.target
            )
          );
          if (visualized) {
            let tempGrid = clearGrid(table.grid, true);
            updateGrid(
              getAlgorithm(state.algorithm)["visualize"](
                tempGrid,
                table.start,
                table.target,
                table.row_len,
                table.col_len
              )
            );
          }
        }
      }
    }
  };

  return (
    <div className="PathFinderTable" id="pathTable">
      <div
        className="pathTable-buttons d-flex m-2 align-items-center"
        id="pathTableBtns"
      >
        <button
          className="btn btn-primary d-flex justify-content-center align-items-center mx-1 p-2"
          onClick={handleVisualize}
        >
          <FaCaretSquareRight className="mx-1" /> Visualize
        </button>
        <button
          className="btn btn-danger d-flex justify-content-center align-items-center mx-1 p-2"
          onClick={handleClear}
        >
          <FaTrashAlt className="mx-1" /> Clear
        </button>
        <p id="pathFinderError" className="text-danger p-0 m-0 text-center"></p>
      </div>
      {table.grid.length ? (
        <div className="pathTable-items d-flex flex-column justify-content-center align-items-center">
          {table.grid.map((row, idx) => {
            return (
              <div key={idx} className="tableRow d-flex">
                {row.map((cell, idx) => {
                  return (
                    <Cell
                      key={idx}
                      cell={cell}
                      onMousePress={(row, col) => {
                        handleMousePress(row, col);
                      }}
                      onMouseEnter={(row, col) => {
                        handleMouseEnter(row, col);
                      }}
                      onMouseUp={() => {
                        handleMouseUp();
                      }}
                      algorithm={state.algorithm}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="loading" />
      )}
    </div>
  );
}

export default PathFinderTable;
