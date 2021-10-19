import React, { useState, useCallback } from "react";
import {
  useZoomPanHelper,
  ArrowHeadType,
  Edge,
  ElementId,
  Node,
  Elements,
} from "react-flow-renderer";

import Flow from "./Flow";

let id = 0;
const getId = (): ElementId => `node_${id++}`;

function Controller() {
  const [elements, setElements] = useState<Elements>([]);
  const { project } = useZoomPanHelper();

  const hideDropTargets = useCallback(
    (show: boolean) => {
      setElements((els) =>
        els.map((el) => {
          // console.log(type, el);
          if (el.type === "dropTarget") {
            // when you update a simple type you can just update the value
            el.isHidden = show;
          }
          if (el.type === "buttonedge") {
            // when you update a simple type you can just update the value
            el.data.isHidden = show;
          }
          return el;
        })
      );
    },
    [setElements]
  );

  const insertNode = useCallback(
    ({
      type,
      edgeId,
      source,
      target,
      x,
      y,
    }: {
      type: string;
      edgeId: ElementId;
      source: ElementId;
      target: ElementId;
      x: number;
      y: number;
    }): void => {
      const position = project({ x, y });

      const nodeId = getId();
      const newNode: Node = {
        id: nodeId,
        type: "default",
        position,
        data: { label: `${type}`, type },
      };

      const edge1: Edge = {
        id: getId(),
        type: "buttonedge",
        source: source,
        target: nodeId,
        arrowHeadType: ArrowHeadType.Arrow,
        data: { label: `dropTarget`, insertNode },
      };
      const edge2: Edge = {
        id: getId(),
        type: "buttonedge",
        source: nodeId,
        target: target,
        arrowHeadType: ArrowHeadType.Arrow,
        data: { label: `dropTarget`, insertNode },
      };

      setElements((es) => es.concat([newNode, edge1, edge2]));
      setElements((es) => es.filter((el) => el.id !== edgeId));

      hideDropTargets(true);
    },
    [project, hideDropTargets]
  );

  const addNode = ({
    type,
    x,
    y,
  }: {
    type: string;
    x: number;
    y: number;
  }): void => {
    const position = project({ x, y });

    const nodeId = getId();
    const newNode: Node = {
      id: nodeId,
      type: "default",
      position,
      data: { label: `${type}`, type },
    };

    if (type !== "output") {
      const exitNodePosition = project({
        x: x + 75 - 10, // 75 is width of node
        y: y + 250,
      });
      const exitId = getId();
      const exitNode: Node = {
        id: exitId,
        type: "exit",
        position: exitNodePosition,
        data: { label: `Exit` },
        connectable: true,
      };

      const edge: Edge = {
        id: getId(),
        type: "buttonedge",
        source: nodeId,
        target: exitId,
        arrowHeadType: ArrowHeadType.Arrow,
        data: { label: `dropTarget`, insertNode },
      };

      setElements((es) => es.concat([newNode, exitNode, edge]));
    } else {
      setElements((es) => es.concat([newNode]));
    }
    hideDropTargets(true);
  };

  return (
    <Flow
      elements={elements}
      setElements={setElements}
      addNode={addNode}
      hideDropTargets={hideDropTargets}
    />
  );
}

export default Controller;
