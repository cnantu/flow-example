import React, { useState, useEffect, useCallback, DragEvent } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  OnLoadParams,
  Elements,
  Connection,
  Edge,
  ElementId,
  Node,
} from "react-flow-renderer";

import DropTargetSelectorNode from "./DropTarget";
import Sidebar from "./Sidebar";

import "./dnd.css";

type DropNodeType = ({
  type,
  x,
  y,
}: {
  type: string;
  x: number;
  y: number;
}) => void;

const dragTargets = (dropNode: DropNodeType) => [
  {
    id: "-1",
    type: "dropTarget",
    isHidden: true,
    data: { dropNode, type: "input", accept: ["input"] },
    position: { x: 400, y: 100 },
  },
  {
    id: "-2",
    type: "dropTarget",
    isHidden: true,
    data: { dropNode },
    position: { x: 400, y: 300 },
  },
  {
    id: "-3",
    type: "dropTarget",
    isHidden: true,
    data: { dropNode },
    position: { x: 400, y: 500 },
  },
  {
    id: "-4",
    type: "dropTarget",
    isHidden: true,
    data: { dropNode, type: "output", accept: ["output"] },
    position: { x: 400, y: 700 },
  },
];

const initialElements = (dropNode: DropNodeType) => {
  return [
    ...dragTargets(dropNode),
    // {
    //   id: "1",
    //   type: "input",
    //   data: { label: "input node" },
    //   position: { x: 250, y: 5 },
    // },
  ];
};

const nodeTypes = {
  dropTarget: DropTargetSelectorNode,
};

let id = 0;
const getId = (): ElementId => `dndnode_${id++}`;

const DnDFlow = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>([]);

  const onConnect = (params: Connection | Edge) =>
    setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance: OnLoadParams) =>
    setReactFlowInstance(_reactFlowInstance);

  const dropNode = useCallback(
    function ({ type, x, y }: { type: string; x: number; y: number }): void {
      console.log("dropNode", type);
      if (reactFlowInstance) {
        const position = reactFlowInstance.project({ x, y });

        const newNode: Node = {
          id: getId(),
          type,
          position,
          data: { label: `${type} node` },
        };

        setElements((es) => es.concat(newNode));
      }
      hideDropTargets(true);
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    setElements(initialElements(dropNode));
  }, [reactFlowInstance, dropNode]);

  function hideDropTargets(show: boolean) {
    setElements((els) =>
      els.map((el) => {
        // console.log(type, el);
        if (el.type === "dropTarget") {
          // when you update a simple type you can just update the value
          el.isHidden = show;
        }
        return el;
      })
    );
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    hideDropTargets(true);
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
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper">
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            nodeTypes={nodeTypes}
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
