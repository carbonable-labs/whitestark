// intial proposition: https://github.com/Astraly-Labs/astraly-contracts/blob/main/tests/test_lottery_tickets.py

const starknet = require("starknet");

import {dataType} from "./types";

export const merkletree = {
 async getNextLevel(level: (string | number)[]) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      let node;
      if (Number(level[i]) <= Number(level[i + 1])) {
        node = await this.hashFn([level[i], level[i + 1]]);
      } else {
        node = await this.hashFn([level[i + 1], level[i]]);
      }
      nextLevel.push(node);
    }
    return nextLevel;
  },

  async generateProofHelper(level: (string | number)[], index: number, proof: (string | number)[]) : Promise<(string | number)[]> {
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

    const nextLevel = await this.getNextLevel(level);
    return await this.generateProofHelper(nextLevel, indexParent, proof);
  },

  async generateMerkleProof(values: (string | number)[], index: number) {
    return await this.generateProofHelper(values, index, []);
  },

  async generateMerkleRoot(values: (string | number)[]) : Promise<string | number>{
    if (values.length === 1) {
      return values[0];
    }
    if (values.length % 2) {
      values.push(0);
    }
    const nextLevel = await this.getNextLevel(values);
    return await this.generateMerkleRoot(nextLevel);
  },

  async verifyMerkleProof(leaf: string, proof: (string | number)[], root: string | number) {
    let curr = leaf;

    for (const proof_elem of proof) {
      if (Number(curr) <= Number(proof_elem)) {
        curr = await this.hashFn([curr, proof_elem]);
      } else {
        curr =await this.hashFn([proof_elem, curr]);
      }
    }

    return curr === root;
  },

  async getLeaf(address : string, allocation: number) {
    return await this.hashFn([address, allocation]);
  },

  async getLeaves(data : dataType) {
    const values = [];
    for (const row of data) {
      const address = await this.hexToBn(row.address);
      const leaf = await this.getLeaf(address, row.allocation);

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

  async hexToBn(hex: string) {
    const bn = starknet.number.toBN(hex.replace("0x", ""), 16);
    return bn.toString();
  },

  async hashFn(inputs : [any, any]) {
    return this.hexToBn(starknet.hash.pedersen(inputs));
  },
};