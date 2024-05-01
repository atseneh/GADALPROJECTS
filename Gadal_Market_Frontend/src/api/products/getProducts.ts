import axios from 'axios'
import BASE_URL from '../apiConfig'
interface QueryData {
    category?:string;
    transactionType?:number;
    productType?:number;
    minPrice?:string|null,
    maxPrice?:string|null,
    attributes?:[],
    pageSize?:number,
    pageNumber?:number,
    consignee?:string,
    sortCriteria?:string,
    brand?:string|null,
}
async function getProducts(queryData:QueryData){
const {
    category,
    transactionType,
    productType,
    minPrice,
    maxPrice,
    attributes,
    pageNumber,
    pageSize,
    consignee,
    sortCriteria,
    brand,
} = queryData
let url = `products?recordStatus=1&state=1&derivedState=1`
if(category){
url = `${url}&category=${category}`
}
if(transactionType){
    url = `${url}&transactionType=${transactionType}`
}
if(productType){
    url = `${url}&productType=${productType}`
}
if(sortCriteria){
    url = `${url}&sortCriteria=${sortCriteria}`
}
if(minPrice&&maxPrice){
    url = `${url}&minPrice=${minPrice}&maxPrice=${maxPrice}`
}
if(attributes&&attributes.length>0){
  attributes.forEach((attr:any)=>{
  url = `${url}&attributes=${attr.attributes}&attributeValues=${attr.attributeValues}`
  })
}
if(consignee) {
    url = `${url}&consignee=${consignee}`
}
if(pageSize && pageNumber) {
    url = `${url}&pageSize=${pageSize}&pageNum=${pageNumber}`
}
if(brand){
url = `${url}&brand=${brand}`
}
try {
    const {data} = await axios.get(
        `${BASE_URL}${url}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getProducts