import React, { useReducer, useCallback } from "react";
import {
  useZoomPanHelper,
  ArrowHeadType,
  Edge,
  ElementId,
  Node,
  Elements,
  XYPosition,
} from "react-flow-renderer";

import ControllerDispatch from "./FlowContext";
import Flow from "./Flow";

let id = 0;
const getId = (): ElementId => `node_${id++}`;

function hideDropTargets(elements: Elements, show: boolean): Elements {
  return elements.map((el) => {
    if (el.type === "dropTarget") {
      // when you update a simple type you can just update the value
      el.isHidden = show;
    }
    if (el.type === "buttonedge") {
      // when you update a simple type you can just update the value
      el.data.isHidden = show;
    }
    return el;
  });
}

const initialState: Elements = [];

function reducer(state: Elements, action: any): Elements {
  switch (action.type) {
    case "setElements": {
      const { elements } = action.payload;
      return elements;
    }
    case "insertNode": {
      const { node, inEdge, outEdge, edgeId } = action.payload;

      console.log("insertNode", action.payload);

      let newState = state.concat([node, inEdge, outEdge]);
      newState = newState.filter((el) => el.id !== edgeId);
      newState = hideDropTargets(newState, true);

      return newState;
    }
    case "addNode": {
      console.log("addNode", action.payload);
      const { node, exitNode, edge } = action.payload;

      let newState = state.concat([node, exitNode, edge]);
      newState = hideDropTargets(newState, true);

      return newState;
    }
    case "hideDropTargets": {
      const { hide } = action.payload;
      return hideDropTargets(state, hide);
    }
  }
  return state;
}

const createEdge = ({
  source,
  target,
}: {
  source: ElementId;
  target: ElementId;
}) => {
  const edge: Edge = {
    id: getId(),
    type: "buttonedge",
    source,
    target,
    arrowHeadType: ArrowHeadType.Arrow,
    data: { label: `dropTarget` },
  };
  return edge;
};

const createNode = ({
  type,
  dataType,
  x,
  y,
  project,
}: {
  type: string;
  dataType: string;
  x: number;
  y: number;
  project: (position: XYPosition) => XYPosition;
}) => {
  const position = project({ x, y });

  const id = getId();
  const node: Node = {
    id,
    type,
    position,
    data: { label: `${dataType}`, type: dataType },
  };
  return node;
};

function Controller() {
  const { project } = useZoomPanHelper();
  const [elements, dispatch] = useReducer(reducer, initialState);

  const hideDropTargets = useCallback(
    (hide: boolean) => dispatch({ type: "hideDropTargets", payload: { hide } }),
    [dispatch]
  );
  const insertNode = useCallback(
    ({ type, edgeId, source, target, x, y }) => {
      const node = createNode({ type: "default", dataType: type, x, y, project });
      const inEdge = createEdge({ source, target: node.id });
      const outEdge = createEdge({ source: node.id, target });
      dispatch({
        type: "insertNode",
        payload: { node, inEdge, outEdge, edgeId },
      });
    },
    [dispatch, project]
  );
  const addNode = useCallback(
    ({ type, x, y }) => {
      const node = createNode({ type: "default", dataType: type, x, y, project });
      const exitNode = createNode({
        type: "exit",
        dataType: "exit",
        x: x + 65,
        y: y + 250,
        project,
      });
      const edge = createEdge({ source: node.id, target: exitNode.id });
      dispatch({ type: "addNode", payload: { node, exitNode, edge } });
    },
    [dispatch, project]
  );

  const setElements = useCallback(
    (elements) => dispatch({ type: "setElements", payload: { elements } }),
    [dispatch]
  );

  return (
    <ControllerDispatch.Provider value={{ insertNode }}>
      <Flow
        elements={elements}
        setElements={setElements}
        addNode={addNode}
        hideDropTargets={hideDropTargets}
      />
    </ControllerDispatch.Provider>
  );
}

export default Controller;
