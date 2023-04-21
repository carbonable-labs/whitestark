const starknet = require("starknet");
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

export const merkletree = {

  async generateMerkleProof(merkle, leaf) {
    console.log(leaf, keccak256(leaf));
    return merkle.getHexProof(keccak256(leaf));
  },

  async verifyMerkleProof(merkle, leaf, proof) {
    return merkle.verify(proof, keccak256(leaf), merkle.root);
  },

  async generateMerkleRoot(list){
    const merkleTree = new MerkleTree(list, keccak256, {
      hashLeaves: true, // Hash each leaf using keccak256 to make them fixed-size
      sortPairs: true, // Sort the tree for determinstic output
      sortLeaves: true,
    });
    
    // Compute the Merkle Root in Hexadecimal
    return merkleTree;
  },


  async getLeaf(address, allocation) {
    return await this.hashFn([address, allocation]);
  },

  async getLeaves(data) {
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

  async hexToBn(hex) {
    const bn = starknet.number.toBN(hex.replace("0x", ""), 16);
    return bn.toString();
  },

  async hashFn(inputs) {
    return this.hexToBn(starknet.hash.pedersen(inputs));
  },

};