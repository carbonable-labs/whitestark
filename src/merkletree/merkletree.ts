// intial proposition: https://github.com/Astraly-Labs/astraly-contracts/blob/main/tests/test_lottery_tickets.py

const starknet = require("starknet");
import { BigNumberish } from "starknet/utils/number";

import { Grant, MerkleTree, Leaf } from "../types";

export const merkletree = {
  assert(condition: boolean, message?: string) {
    if (!condition) {
      throw new Error(message || "Verification failed");
    }
  },

  generateMerkleTree(data: Grant[]): MerkleTree {
    const leaves = this.getLeaves(data);
    const root = this.generateMerkleRoot(leaves.map((item: Leaf) => item.leaf));
    if (leaves[leaves.length - 1].leaf === 0) {
      leaves.pop();
    }
    for (const [index, item] of leaves.entries()) {
      item.index = index;
      item.proof = this.generateMerkleProof(
        leaves.map((element: Leaf) => element.leaf),
        index
      );
      this.assert(this.verifyMerkleProof(item.leaf, item.proof, root));
    }
    return { root: root, leaves: leaves };
  },

  getNextLevel(level: BigNumberish[]) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      let node;
      if (Number(level[i]) <= Number(level[i + 1])) {
        node = this.hashFn([level[i], level[i + 1]]);
      } else {
        node = this.hashFn([level[i + 1], level[i]]);
      }
      nextLevel.push(node);
    }
    return nextLevel;
  },

  generateProofHelper(
    level: BigNumberish[],
    index: number,
    proof: BigNumberish[]
  ): BigNumberish[] {
    if (level.length === 1) {
      return proof;
    }
    if (level.length % 2) {
      level.push(0);
    }

    let indexParent = 0;
    for (let i = 0; i < level.length; i++) {
      if (i === index) {
        indexParent = Math.floor(i / 2);
        if (i % 2) {
          proof.push(level[index - 1]);
        } else {
          proof.push(level[index + 1]);
        }
      }
    }

    const nextLevel = this.getNextLevel(level);
    return this.generateProofHelper(nextLevel, indexParent, proof);
  },

  generateMerkleProof(values: BigNumberish[], index: number) {
    return this.generateProofHelper(values, index, []);
  },

  generateMerkleRoot(values: BigNumberish[]): BigNumberish {
    if (values.length === 1) {
      return values[0];
    }
    if (values.length % 2) {
      values.push(0);
    }
    const nextLevel = this.getNextLevel(values);
    return this.generateMerkleRoot(nextLevel);
  },

  verifyMerkleProof(
    leaf: BigNumberish,
    proof: BigNumberish[],
    root: BigNumberish
  ) {
    let curr = leaf;

    for (const proof_elem of proof) {
      if (Number(curr) <= Number(proof_elem)) {
        curr = this.hashFn([curr, proof_elem]);
      } else {
        curr = this.hashFn([proof_elem, curr]);
      }
    }

    return curr === root;
  },

  getLeaf(address: string, allocation: number) {
    return this.hashFn([address, allocation]);
  },

  getLeaves(data: Grant[]) {
    const values: Leaf[] = data.map((leave: Grant) => {
      const address = this.hexToBn(leave.address);
      const leaf = this.getLeaf(address, leave.allocation);

      return {
        leaf: leaf,
        address_bn: address,
        address: leave.address,
        allocation: leave.allocation,
        index: 0,
        proof: [0, ""],
      };
    });

    if (values.length % 2) {
      values.push({
        leaf: 0,
        address_bn: 0,
        address: "0",
        allocation: 0,
        index: 0,
        proof: [0, ""],
      });
    }

    return values;
  },

  hexToBn(hex: string) {
    const bn = starknet.number.toBN(hex.replace("0x", ""), 16);
    return bn.toString();
  },

  hashFn(inputs: [any, any]) {
    return this.hexToBn(starknet.hash.pedersen(inputs));
  },
};
