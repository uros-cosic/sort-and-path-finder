import { useContext } from "react";
import { StateContext } from "../stateContext";

import Legend from "./Legend";
import PathFinderTable from "./path-finder/PathFinderTable";
import SortingTable from "./sorting-visualizer/SortingTable";

function Main() {
  const { state } = useContext(StateContext);

  return (
    <div className="Main">
      <Legend />
      {state.mode === "path" ? <PathFinderTable /> : <SortingTable />}
    </div>
  );
}

export default Main;
