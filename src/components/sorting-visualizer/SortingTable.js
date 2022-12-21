import { useState, useEffect, useContext } from "react";
import {
  generateRandomArray,
  visualizeQuickSort,
  visualizeMergeSort,
  visualizeBubbleSort,
  animateQuickSort,
  animateSorted,
  animateMergeSort,
  animateBubbleSort,
} from "../../util/sortUtil";
import { StateContext } from "../../stateContext";

import { FaSignal, FaRedoAlt } from "react-icons/fa";

import Node from "./Node";

function SortingTable() {
  const { state } = useContext(StateContext);

  const [table, setTable] = useState({
    nodes: [],
    maxHeight: 20,
    nodeWidth: 20,
    nodesNum: 2,
  });

  const [sorted, setSorted] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sliderVal, setSliderVal] = useState(50);

  // Get an algorithm
  const getAlgorithm = (algorithmName) => {
    const available = {
      "quick sort": {
        animate: animateQuickSort,
        visualize: visualizeQuickSort,
        animateSorted: animateSorted,
      },
      "merge sort": {
        animate: animateMergeSort,
        visualize: visualizeMergeSort,
        animateSorted: animateSorted,
      },
      "bubble sort": {
        animate: animateBubbleSort,
        visualize: visualizeBubbleSort,
        animateSorted: animateSorted,
      },
    };
    if (!available[algorithmName]) return null;
    return available[algorithmName];
  };

  const setNodes = (arr) => {
    setTable({
      ...table,
      nodes: arr,
    });
  };

  // On load
  useEffect(() => {
    const tableItemsDiv = document.getElementById("table-items");
    const { y } = tableItemsDiv.getBoundingClientRect();
    let maxHeight = window.innerHeight - y;
    let maxNodes = parseInt(window.innerWidth / table.nodeWidth);
    setTable({
      ...table,
      nodes: generateRandomArray(maxNodes, maxHeight),
      maxHeight,
      nodesNum: maxNodes,
    });
  }, []);

  const handleSortClick = () => {
    let errEl = document.getElementById("sortingTableError");
    if (!state.algorithm) {
      errEl.innerText = "Select an Algorithm From Navbar to Visualize It";
      return;
    }
    errEl.innerText = "";
    if (isSorting) return;
    if (sorted) {
      setSorted(false);
      setIsSorting(true);
      let arr = table.nodes.slice();
      for (let node of arr) node.type = "unordered";
      getAlgorithm(state.algorithm)["animateSorted"](
        arr,
        setNodes,
        setSorted,
        setIsSorting,
        sliderVal
      );
    } else {
      setIsSorting(true);
      getAlgorithm(state.algorithm)["animate"](
        table.nodes,
        setNodes,
        setSorted,
        setIsSorting,
        sliderVal
      );
    }
  };

  const handleResetClick = () => {
    if (isSorting) return;
    setSorted(false);
    setTable({
      ...table,
      nodes: generateRandomArray(table.nodesNum, table.maxHeight),
    });
  };

  return (
    <div className="SortingTable">
      <div className="sortingTable-buttons d-flex m-2 align-items-center">
        <button
          className="btn btn-primary justify-content-center align-items-center mx-1 p-2"
          onClick={handleSortClick}
        >
          <FaSignal className="mx-1" />
          Sort
        </button>
        <button
          className="btn btn-danger justify-content-center align-items-center mx-1 p-2"
          onClick={handleResetClick}
        >
          <FaRedoAlt className="mx-1" />
          Generate New Array
        </button>
        <p id="sortingTableError" className="p-0 m-0"></p>
        <div className="slidecontainer">
          <label htmlFor="" className="justify-content-between">
            Sorting Speed
          </label>
          <input
            type="range"
            className="slider"
            min="1"
            max="100"
            value={sliderVal}
            onInput={(e) => {
              setSliderVal(e.target.value);
            }}
          />
        </div>
      </div>
      <div id="table-items">
        {table.nodes.length ? (
          <div className="sortingTable d-flex">
            {table.nodes.map((node, idx) => {
              return <Node key={idx} node={node} nodeWidth={table.nodeWidth} />;
            })}
          </div>
        ) : (
          <div className="loading" />
        )}
      </div>
    </div>
  );
}

export default SortingTable;
