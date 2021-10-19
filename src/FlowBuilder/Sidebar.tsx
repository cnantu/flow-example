import React, { DragEvent } from "react";
import { useStoreState } from "react-flow-renderer";

function FlowNodes() {
  const nodes = useStoreState((store) => store.nodes);

  return (
    <div className="nodes">
      {nodes.map((node) => (
        <div key={node.id}>
          {node.data?.label || ""} x: {node.__rf.position.x.toFixed(2)}, y:{" "}
          {node.__rf.position.y.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

const Sidebar = () => {
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the left.
      </div>
      <div
        className="react-flow__node-input"
        onDragStart={(event: DragEvent) => onDragStart(event, "trigger")}
        draggable
      >
        Trigger
      </div>
      <div
        className="react-flow__node-default"
        onDragStart={(event: DragEvent) => onDragStart(event, "delay")}
        draggable
      >
        Delay
      </div>
      <div
        className="react-flow__node-default"
        onDragStart={(event: DragEvent) => onDragStart(event, "email")}
        draggable
      >
        Email
      </div>
      <FlowNodes />
    </aside>
  );
};

export default Sidebar;
