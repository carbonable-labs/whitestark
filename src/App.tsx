import VanillaJSONEditor from "./components/VanillaJSONEditor";
import VanillaJSONViewer from "./components/VanillaJSONViewer";

import { Mode } from "vanilla-jsoneditor";

import { useState } from "react";
import "./styles/styles.css";
import "./styles/vanillaJse.css";

export default function App() {
  const [initialJson, setInitialJson] = useState({
    json: [
      {
        address:
          "0x208555013ffe57ce0f78be91ce8b368eba6645a52bb90fed2c427617d619d03",
        allocation: 5,
      },
      {
        address:
          "0x009d02bAA050B9e8F3eb98fF0FA1eDe8e1b20D65CEae9f05E018b4d8dA3E4b7f",
        allocation: 1,
      },
    ],

    text: undefined,
  });

  const [viewerJson, setViewerJson] = useState(initialJson);

  const readOnly = true;

  return (
    <div className="hompe--page">
      <div className="editor-container" id="jsoneditor-left">
        <VanillaJSONEditor
          mode={Mode.text}
          content={initialJson}
          onChange={setInitialJson}
        />
      </div>

      <div className="editor-container" id="jsoneditor-right">
        <VanillaJSONViewer
          content={viewerJson}
          innitialJson={initialJson}
          onChange={setViewerJson}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
