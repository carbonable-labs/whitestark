import { merkletree } from "./merkle";
import { dataType, leaveType } from "../Types";
import keccak256 from "keccak256";

export const whitelist = {
  assert(condition: boolean, message?: string) {
    if (!condition) {
      throw new Error(message || "Verification failed");
    }
  },

  async run(data: dataType) {
    const leaves = await merkletree.getLeaves(data);
    const merkle = (await merkletree.generateMerkleRoot(leaves.map((item: leaveType) => item.leaf)));
    const root = merkle.getHexRoot();
    if (leaves[leaves.length - 1].leaf === 0) {
      leaves.pop();
    }
    for (const [index, item] of leaves.entries()) {
      item.index = index;
      item.proof = await merkletree.generateMerkleProof(
        merkle,
        item.leaf
      );
      console.log(
        item.proof,
        await merkletree.verifyMerkleProof(merkle, item.leaf, merkle.getProof(keccak256(item.leaf)))
      );
    }
    return { root: root, leaves: leaves};
  },
};
