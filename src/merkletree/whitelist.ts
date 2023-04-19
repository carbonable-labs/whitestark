import { merkletree } from "./merkletree";
import { dataType, leaveType } from "../Types";

export const whitelist = {
  assert(condition: boolean, message?: string) {
    if (!condition) {
      throw new Error(message || "Verification failed");
    }
  },

  async run(data: dataType) {
    const leaves = await merkletree.getLeaves(data);
    const root = await merkletree.generateMerkleRoot(leaves.map((item: leaveType) => item.leaf));
    if (leaves[leaves.length - 1].leaf === 0) {
      leaves.pop();
    }
    for (const [index, item] of leaves.entries()) {
      item.index = index;
      item.proof = await merkletree.generateMerkleProof(
        leaves.map((element: leaveType) => element.leaf),
        index
      );
      whitelist.assert(
        await merkletree.verifyMerkleProof(item.leaf, item.proof, root)
      );
    }
    return { root: root, leaves: leaves };
  },
};
