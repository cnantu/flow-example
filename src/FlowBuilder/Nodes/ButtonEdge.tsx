import React, { MouseEvent, DragEvent } from "react";
import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
  ElementId,
} from "react-flow-renderer";

const colors: Record<string, string> = {
  input: "#0041d0",
  output: "#ff0072",
  default: "black",
};

const foreignObjectWidth = 180;
const foreignObjectHeight = 70;

const nodeWidth = 172;
const nodeHeight = 36;

function getStyle(type: string) {
  return {
    display: "flex",
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: `${foreignObjectWidth - 4}px`,
    height: `${foreignObjectHeight - 4}px`,
    margin: "4px",
    fontSize: "12px",
    border: `1px dashed ${colors[type] || colors.default}`,
    borderRadius: "2px",
  };
}

const onEdgeClick = (evt: MouseEvent, id: ElementId) => {
  evt.stopPropagation();
  console.log("onEdgeClick", id);
};

export default function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}: {
  id: ElementId;
  source: ElementId;
  target: ElementId;
  sourceX: any;
  sourceY: any;
  targetX: any;
  targetY: any;
  sourcePosition: any;
  targetPosition: any;
  style: any;
  data: any;
  arrowHeadType: any;
  markerEndId: any;
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { insertNode } = data;
    if (insertNode) {
      const type = event.dataTransfer.getData("application/reactflow");
    //   console.log("dropTarget dropNode", type);
      insertNode({
        type,
        edgeId: id,
        source,
        target,
        x: edgeCenterX - nodeWidth / 2,
        y: edgeCenterY - nodeHeight / 2,
      });
    }
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      <foreignObject
        width={foreignObjectWidth}
        height={foreignObjectHeight}
        x={edgeCenterX - foreignObjectWidth / 2}
        y={edgeCenterY - foreignObjectHeight / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.isHidden ? (
            <button
              className="edgebutton"
              onClick={(event) => onEdgeClick(event, id)}
            >
              +
            </button>
          ) : (
            <div
              style={getStyle(data?.type || "default")}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
            >
              <button
                className="edgebutton"
                onClick={(event) => onEdgeClick(event, id)}
              >
                +
              </button>
            </div>
          )}
        </body>
      </foreignObject>
    </>
  );
}
