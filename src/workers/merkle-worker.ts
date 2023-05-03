import { merkletree } from "../merkletree/merkletree";

self.onmessage = ({ data }: MessageEvent<any>) => {
  const tree = merkletree.generateMerkleTree(data);
  self.postMessage(tree);
};

export {};
