import Image from "../Image";

function Cell(props) {
  return (
    <div
      className={`Cell ${props.cell.type}`}
      onMouseDown={() => props.onMousePress(props.cell.x, props.cell.y)}
      onMouseEnter={() => props.onMouseEnter(props.cell.x, props.cell.y)}
      onMouseUp={() => props.onMouseUp()}
    >
      {props.cell.start ? (
        <Image node="start" />
      ) : props.cell.target ? (
        <Image node="target" />
      ) : (
        (props.algorithm === "dijakstra's" ||
          props.algorithm === "bellman-ford") &&
        props.cell.weight > 0 && (
          <div className="weightedCyrcle">
            <div className="weighted">{props.cell.weight}</div>
          </div>
        )
      )}
    </div>
  );
}

export default Cell;
