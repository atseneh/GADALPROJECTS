 const ServiceEnums:{[key:string]:number} = {
    Property:2,
    Machinery:1,
    Vehicle:3,
    Others:4,
}
export const services = {
    2:"Property",
    1:'Machinery',
    3:'Vehicle',
    4:"Others",
}
const transactionTypeEnums:{[key:string]:number} = {
    sale:2,
    rent:1,
}
export default {
    ServiceEnums,
    transactionTypeEnums
}