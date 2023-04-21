export type leaveType = {
  leaf: string | number;
  address_bn: string | number;
  address: string | number;
  allocation: number;
  index: number;
  proof: (string | number)[];
};

export type Grant = {
  address: string;
  allocation: number;
};
