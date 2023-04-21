import { BigNumberish } from "starknet/utils/number";

export type Leaf = {
  leaf: BigNumberish;
  address_bn: BigNumberish;
  address: BigNumberish;
  allocation: number;
  index: number;
  proof: BigNumberish[];
};

export type Grant = {
  address: string;
  allocation: number;
};

export type MerkleTree = {
  root: BigNumberish;
  leaves: Leaf[];
};
