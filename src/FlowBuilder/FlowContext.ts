import { createContext, useContext } from "react";

const noop = ({
  type,
  edgeId,
  source,
  target,
  x,
  y,
}: {
  type: string;
  edgeId: string;
  source: string;
  target: string;
  x: number;
  y: number;
}) => {};

const ControllerDispatch = createContext({ insertNode: noop });

export function useControllerDispatch() {
  const { insertNode } = useContext(ControllerDispatch);
  return insertNode;
}

export default ControllerDispatch;
