import VanillaJSONEditor from "./VanillaJSONEditor";
import VanillaJSONViewer from "./VanillaJSONViewer";
import { useEffect, useState } from "react";
import "./styles.css";
import "./vanillaJse.css";

export default function App() {
  const [initialJson, setInitialJson] = useState({
    json: [
      {
        address:
          "0x208555013ffe57ce0f78be91ce8b368eba6645a52bb90fed2c427617d619d03",
        quantity: 5,
      },
      {
        address:
          "0x009d02bAA050B9e8F3eb98fF0FA1eDe8e1b20D65CEae9f05E018b4d8dA3E4b7f",
        quantity: 1,
      },
    ],

    text: undefined,
  });

  const [viewerJson, setViewerJson] = useState(initialJson);

  const readOnly = true;

  useEffect(() => {
    setViewerJson(initialJson);
  }, [initialJson]);

  return (
    <div className="hompe--page">
      <div className="editor-container" id="jsoneditor-left">
        <VanillaJSONEditor
          mode="text"
          content={initialJson}
          onChange={setInitialJson}
        />
      </div>

      <div className="editor-container" id="jsoneditor-right">
        <VanillaJSONViewer
          mode="true"
          content={viewerJson}
          onChange={setViewerJson}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
