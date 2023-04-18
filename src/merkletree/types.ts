 
export type leaveType = {
    leaf: string | number,
    address_bn: string | number,
    address: string | number,
    allocation: number,
    index: number,
    proof: (string | number) []
}
  
export type dataItem = {
    address : string,
    allocation: number
}
  
 export type dataType = dataItem[]