import React, { DragEvent, 
  // MouseEvent 
} from "react";
import ReactFlow, {
  addEdge,
  removeElements,
  Controls,
  Elements,
  Connection,
  // Node,
  Edge,
} from "react-flow-renderer";

import { nodeTypes, edgeTypes } from "./Nodes";
import Sidebar from "./Sidebar";

import "./dnd.css";

// const onNodeDragStop = (event: MouseEvent<any>, node: Node): void => {
//   console.log(event, node);
// };
// const onEdgeUpdate = (...params:any) => console.log("onEdgeUpdate", params);

function Flow({
  elements,
  setElements,
  addNode,
  hideDropTargets,
}: {
  elements: Elements;
  setElements: React.Dispatch<React.SetStateAction<Elements<any>>>;
  addNode: ({ type, x, y }: { type: string; x: number; y: number }) => void;
  hideDropTargets: (hide: boolean) => void;
}) {
  const onConnect = (params: Connection | Edge) =>
    setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    addNode({ type, x: event.clientX, y: event.clientY });
  };

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
    hideDropTargets(false);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <>
      <div className="reactflow-wrapper">
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          onElementsRemove={onElementsRemove}
          // onEdgeUpdate={onEdgeUpdate}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          // onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </>
  );
}

export default Flow;
