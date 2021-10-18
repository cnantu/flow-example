import React, { DragEvent } from "react";

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
    width: "300px",
    height: "150px",
    padding: "8px",
    fontSize: "12px",
    border: `2px dashed ${colors[type] || colors.default}`,
    borderRadius: "2px",
  };
}

export default function DropTargetSelectorNode({
  data,
  isConnectable,
}: {
  data: any;
  isConnectable: boolean;
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

    const { dropNode, accept } = data;
    if (dropNode) {
      const type = event.dataTransfer.getData("application/reactflow");
      console.log("dropTarget dropNode", type);
      if (Array.isArray(accept)) {
        if (accept.includes(type)) {
          dropNode({ type, x: event.clientX, y: event.clientY });
        }
      } else {
        dropNode({ type, x: event.clientX, y: event.clientY });
      }
    }
  };

  return (
    <div
      style={getStyle(data.type)}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
    >
      {data.type ? `Accept only ${data.type} nodes` : "Accept all nodes"}
    </div>
  );
}
