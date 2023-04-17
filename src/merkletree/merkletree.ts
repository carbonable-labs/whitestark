// intial proposition: https://github.com/Astraly-Labs/astraly-contracts/blob/main/tests/test_lottery_tickets.py

const starknet = require("starknet");

import {dataType} from "./types";

export const merkletree = {
  getNextLevel(level: (string | number)[]) {
    let nextLevel = [];
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

  generateProofHelper(level: (string | number)[], index: number, proof: (string | number)[]) : (string | number)[] {
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

  generateMerkleProof(values: (string | number)[], index: number) {
    return this.generateProofHelper(values, index, []);
  },

  generateMerkleRoot(values: (string | number)[]) : string | number{
    if (values.length === 1) {
      return values[0];
    }
    if (values.length % 2) {
      values.push(0);
    }
    const nextLevel = this.getNextLevel(values);
    return this.generateMerkleRoot(nextLevel);
  },

  verifyMerkleProof(leaf: string, proof: (string | number)[], root: string | number) {
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

  getLeaf(address : string, allocation: number) {
    return this.hashFn([address, allocation]);
  },

  getLeaves(data : dataType) {
    let values = [];
    for (const row of data) {
      const address = this.hexToBn(row.address);
      const leaf = this.getLeaf(address, row.allocation);

      values.push({
        leaf: leaf,
        address_bn: address,
        address: row.address,
        allocation: row.allocation,
        index: 0,
        proof: [0, ""]
      });
    }

    if (values.length % 2) {
      values.push({
        leaf: 0,
        address_bn: 0,
        address: 0,
        allocation: 0,
        index: 0,
        proof: [0, ""]
      });
    }

    return values;
  },

  hexToBn(hex: string) {
    const bn = starknet.number.toBN(hex.replace("0x", ""), 16);
    return bn.toString();
  },

  hashFn(inputs : [any, any]) {
    return this.hexToBn(starknet.hash.pedersen(inputs));
  },
};
