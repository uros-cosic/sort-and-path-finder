import { useContext } from "react";
import { StateContext } from "../stateContext";

function Navbar() {
  const { state, setState } = useContext(StateContext);

  const handleDropClick = (e) => {
    setState({
      algorithm: e.target.innerText.toLowerCase(),
    });
  };

  const swapModes = (e) => {
    const clickedEl = document.getElementById(e.target.id);
    const defaultClass = "list-group-item";
    const selectedClass = defaultClass + " underline";
    for (let el of clickedEl.parentNode.childNodes) {
      el.className = defaultClass;
    }
    clickedEl.className = selectedClass;
    setState({
      algorithm: "",
      mode: e.target.id.split("-")[0],
    });
  };

  return (
    <nav className="Navbar">
      <div className="nav-items">
        <ul className="nav-items-left d-flex nav-items-left m-0 p-0 justify-content-between`">
          <li className="list-group-item">
            <a href="/" className="logo text-white">
              S&P Visualizer
            </a>
          </li>
          <li
            id="path-link"
            className="list-group-item underline"
            onClick={(e) => swapModes(e)}
          >
            Path Finder
          </li>
          <li
            id="sort-link"
            className="list-group-item"
            onClick={(e) => swapModes(e)}
          >
            Sorting
          </li>
        </ul>
        <ul className="d-flex nav-items-right justify-content-center m-0 p-0">
          <div className="dropdown">
            <li className="dropbtn list-group-item">Algorithm</li>
            <div className="dropdown-content">
              {state.mode === "path" ? (
                <>
                  <li
                    className="list-group-item"
                    onClick={(e) => handleDropClick(e)}
                  >
                    BFS
                  </li>
                  <li
                    className="list-group-item"
                    onClick={(e) => handleDropClick(e)}
                  >
                    Dijakstra's
                  </li>
                  <li
                    className="list-group-item"
                    onClick={(e) => handleDropClick(e)}
                  >
                    Bellman-Ford
                  </li>
                </>
              ) : (
                <>
                  <li
                    className="list-group-item"
                    onClick={(e) => handleDropClick(e)}
                  >
                    Quick Sort
                  </li>
                  <li
                    className="list-group-item"
                    onClick={(e) => handleDropClick(e)}
                  >
                    Merge Sort
                  </li>
                  <li
                    className="list-group-item"
                    onClick={(e) => handleDropClick(e)}
                  >
                    Bubble Sort
                  </li>
                </>
              )}
            </div>
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
