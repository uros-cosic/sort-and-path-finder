function Node({ node, nodeWidth }) {
  return (
    <div
      className={`Node ${node.type}`}
      style={{
        height: node.height,
        width: nodeWidth,
      }}
    ></div>
  );
}

export default Node;
