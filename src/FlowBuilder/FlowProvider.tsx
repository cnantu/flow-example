import React from "react";
import { ReactFlowProvider } from "react-flow-renderer";

import FlowController from "./FlowController";

function FlowProvider() {
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <FlowController />
      </ReactFlowProvider>
    </div>
  );
}

export default FlowProvider;
