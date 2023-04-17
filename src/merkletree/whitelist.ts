import {merkletree} from "./merkletree";
// const fs = require("fs");
import {dataType, leaveType} from "./types";


export const whitelist = {
  assert(condition: boolean, message?: string) {
    if (!condition) {
      throw new Error(message || "Verification failed");
    }
  },

  /*read(path) {
        try {
            const data = fs.readFileSync(path, 'utf8');
            const json = JSON.parse(data);
            return json;
        } catch (err) {
            console.error(err);
            return;
        }
    },*/

  // write(obj, path) {
  //   const json = JSON.stringify(obj, null, 4);
  //   fs.writeFile(path, json, "utf8", (err) => {
  //     if (err) throw err;
  //     console.log("complete");
  //   });
  // },

  run(data : dataType) {
    const leaves = merkletree.getLeaves(data);
    const root = merkletree.generateMerkleRoot(leaves.map((item : leaveType) => item.leaf));
    if (leaves[leaves.length - 1].leaf === 0) {
      leaves.pop();
    }
    for (const [index, item] of leaves.entries()) {
      item.index = index;
      item.proof = merkletree.generateMerkleProof(
        leaves.map((element: leaveType) => element.leaf),
        index
      );
      whitelist.assert(
        merkletree.verifyMerkleProof(item.leaf, item.proof, root)
      );
    }
    return { root: root, leaves: leaves };
  },
};
