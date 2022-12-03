import start from "../data/img/start.png";
import target from "../data/img/target.png";

function Image({ node }) {
  return (
    <img
      src={node === "start" ? start : target}
      alt={node === "start" ? "start node" : "target node"}
      className="Image"
      style={{
        zIndex: 1,
        height: "25px",
        width: "25px",
      }}
    />
  );
}

export default Image;
