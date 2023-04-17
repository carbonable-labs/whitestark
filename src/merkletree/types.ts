 
export type leaveType = {
    leaf: string | number,
    address_bn: string | number,
    address: string | number,
    allocation: number,
    index: number,
    proof: any
}
  
export type dataItem = {
    address : string,
    allocation: number
}
  
 export type dataType = dataItem[]