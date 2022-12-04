import Image from "./Image";
import { useContext } from "react";
import { StateContext } from "../stateContext";

import data from "../data/data.json";

function Legend() {
  const { state } = useContext(StateContext);

  const getDescription = () => {
    if (!state.algorithm) return;
    let dataDesc = data.algorithms[state.mode][state.algorithm].description;
    let endIdx = dataDesc.indexOf("]");
    let firstWord = dataDesc.slice(0, endIdx);
    firstWord = firstWord.replace("[", "");
    let otherWords = dataDesc.slice(endIdx);
    otherWords = otherWords.replace("]", "");
    return { first: firstWord, other: otherWords };
  };

  return (
    <div className="Legend">
      <div className="legend">
        {state.mode === "path" ? (
          <div className="legend-items">
            <ul className="d-flex justify-content-between m-0 p-0">
              <li className="list-group-item d-flex">
                <Image node="start" /> <p>Start Node</p>
              </li>
              <li className="list-group-item d-flex">
                <Image node="target" /> <p>Target Node</p>
              </li>
              <li className="list-group-item d-flex">
                <div className="Cell unvisited" /> <p>Unvisited Node</p>
              </li>
              <li className="list-group-item d-flex">
                <div className="Cell visited" /> <p>Visited Node</p>
              </li>
              <li className="list-group-item d-flex">
                <div className="Cell wall" /> <p>Wall Node</p>
              </li>
              <li className="list-group-item d-flex">
                <div className="Cell path" /> <p>Path Node</p>
              </li>
              {(state.algorithm === "dijakstra's" ||
                state.algorithm === "bellman-ford") && (
                <li className="list-group-item d-flex">
                  <div
                    className="Cell weightedCyrcle justify-content-center align-items-center text-center"
                    style={{
                      height: "25px",
                      width: "25px",
                      fontSize: "0.7rem",
                      color: "var(--bs-white)",
                    }}
                  >
                    88
                  </div>{" "}
                  <p>Weighted Node</p>
                </li>
              )}
            </ul>
            {state.algorithm ? (
              <p className="text-center my-3">
                <b>{getDescription().first}</b>
                {" " + getDescription().other}
              </p>
            ) : (
              <p className="text-center my-3">
                Select an Algorithm to Visualize It
              </p>
            )}
          </div>
        ) : (
          <div className="legend-items">
            <ul className="d-flex justify-content-between m-0 p-0">
              <li className="list-group-item d-flex">
                <div className="legend-sort unordered"></div>
                <p>Unordered Node</p>
              </li>
              <li className="list-group-item d-flex">
                <div className="legend-sort sorted"></div>
                <p>Sorted Node</p>
              </li>
            </ul>
            {state.algorithm ? (
              <p className="text-center my-3">
                <b>{getDescription().first}</b>
                {" " + getDescription().other}
              </p>
            ) : (
              <p className="text-center my-3">
                Select an Algorithm to Visualize It
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Legend;
