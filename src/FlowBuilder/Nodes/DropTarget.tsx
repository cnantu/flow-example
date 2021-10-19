import React, { DragEvent } from "react";
import { Handle, Position } from "react-flow-renderer";

const colors: Record<string, string> = {
  input: "#0041d0",
  output: "#ff0072",
  default: "black",
};

function getStyle(type: string) {
  return {
    display: "flex",
    // flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "150px",
    height: "50px",
    padding: "8px",
    fontSize: "12px",
    border: `2px dashed ${colors[type] || colors.default}`,
    borderRadius: "2px",
  };
}

export default function DropTargetNode({
  data,
  isConnectable,
  xPos,
  yPos,
}: {
  data: any;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
}) {
  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
    console.log("dropTarget onDragEnter");
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { addNode, accept } = data;
    if (addNode) {
      const type = event.dataTransfer.getData("application/reactflow");
      console.log("dropTarget dropNode", type);
      if (Array.isArray(accept)) {
        if (accept.includes(type)) {
          addNode({ type, x: xPos, y: yPos });
          // dropNode({ type, x: event.clientX, y: event.clientY });
        }
      } else {
        addNode({ type, x: xPos, y: yPos });
      }
    }
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "grey" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div
        style={getStyle(data.type)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
      >
        {/* {data.type ? `Accept only ${data.type} nodes` : "Accept all nodes"} */}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "grey" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
    </>
  );
}
