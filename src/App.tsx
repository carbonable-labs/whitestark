import JsonEditor from "./components/JSONEditor";
import JsonViewer from "./components/JSONViewer";
import { whitelist } from "./merkletree/whitelist";
import { Grant, MerkleTree } from "./Types";

import { useEffect, useState } from "react";
import "./styles/styles.css";

export default function App() {
  const [value, setValue] = useState<Grant[]>(initialJson);
  const [merkletree, setMerkletree] = useState<MerkleTree>(defaultMerkleTree);

  // compute a new merkle tree when value change
  useEffect(() => {
    const right = document.getElementById("jsoneditor-right");

    try {
      right?.classList.add("editor-container-computing");
      const data: MerkleTree = whitelist.run(value);
      setMerkletree(data);
    } catch (error) {
      console.log(error);
    }
  }, [value]);

  return (
    <div className="hompe-page">
      <div className="editor-container" id="jsoneditor-left">
        <JsonEditor value={value} onChange={setValue} />
      </div>

      <div className="editor-container" id="jsoneditor-right">
        <JsonViewer value={merkletree} />
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

const defaultMerkleTree = {
  root: "",
  leaves: [
    {
      leaf: 0,
      address_bn: 0,
      address: "0",
      allocation: 0,
      index: 0,
      proof: [0, ""],
    },
  ],
};
