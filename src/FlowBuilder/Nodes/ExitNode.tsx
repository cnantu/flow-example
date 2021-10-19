import React from "react";
import { Handle, Position } from "react-flow-renderer";

const colors: Record<string, string> = {
  input: "#0041d0",
  output: "#ff0072",
  default: "black",
  exit: "grey",
};

function getStyle(type: string) {
  return {
    display: "flex",
    justifyContent: type !== "exit" ? "flex-end" : "center",
    alignItems: type !== "exit" ? "flex-end" : "center",
    padding: "4px 8px",
    fontSize: "12px",
    border: `2px dashed ${colors[type] || colors.default}`,
    borderRadius: "2px",
  };
}

export default function ExitNode({
  data,
  isConnectable,
}: {
  data: any;
  isConnectable: boolean;
}) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "grey" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div style={getStyle("exit")}>{data.label || ""}</div>
    </>
  );
}
