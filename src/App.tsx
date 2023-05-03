import { useEffect, useState } from "react";
import JsonEditor from "./components/JSONEditor";
import JsonViewer from "./components/JSONViewer";
import { merkletree } from "./merkletree/merkletree";
import { Grant, MerkleTree } from "./types";

import "./styles/styles.css";

export default function App() {
  const [value, setValue] = useState<Grant[]>(initialJson);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [merkleTree, setMerkleTree] = useState<MerkleTree>(defaultMerkleTree);

  // compute a new merkle tree on value change
  useEffect(() => {
    // mark the state as computing
    setIsComputing(true);
    // create a worker to offload the tree computation
    const worker = new Worker(
      new URL("./workers/merkle-worker.ts", import.meta.url)
    );
    // send the new value to the worker
    if (window.Worker) {
      worker.postMessage(value);
      // update the merkle tree and mark the state as done computing on worker response
      worker.onmessage = ({ data }) => {
        console.log("received response from worker!");
        setMerkleTree(data);
        setIsComputing(false);
      };
    } else {
      // execute the merkle tree computation on the main thread if the browser does not provide web workers
      console.warn(
        "this browser does not provide web workers, computation might freeze the UI"
      );
      const newMerkleTree = merkletree.generateMerkleTree(value);
      setMerkleTree(newMerkleTree);
      setIsComputing(false);
    }

    // terminate the worker on cleanup - this prevents a previous iteration of the
    return () => {
      worker.terminate();
    };
  }, [value]);

  return (
    <div className="hompe-page">
      <div className="editor-container" id="jsoneditor-left">
        <JsonEditor value={value} onChange={setValue} />
      </div>

      <div className="editor-container" id="jsoneditor-right">
        <JsonViewer loading={isComputing} value={merkleTree} />
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
