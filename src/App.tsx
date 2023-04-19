import JsonEditor from "./components/JSONEditor";
import JsonViewer from "./components/JSONViewer";
import { Grant } from "./Types";

import { useState } from "react";
import "./styles/styles.css";

export default function App() {
  const [value, setValue] = useState<Grant[]>(initialJson);

  return (
    <div className="hompe-page">
      <div className="editor-container" id="jsoneditor-left">
        <JsonEditor value={value} onChange={setValue} />
      </div>

      <div className="editor-container" id="jsoneditor-right">
        <JsonViewer value={value} />
      </div>
    </div>
  );
}

const initialJson = [
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
];
