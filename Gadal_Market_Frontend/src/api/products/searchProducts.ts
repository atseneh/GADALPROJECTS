import axios from 'axios'
import BASE_URL from '../apiConfig'
interface QueryData {
    searchTerm:string;
    category?:string;
    transactionType?:number;
    productType?:number;
    minPrice?:string|null,
    maxPrice?:string|null,
    attributes?:[],
    // pageSize?:number,
    // pageNumber?:number,
    // consignee?:string,
    // sortCriteria?:string,
    // brand?:string|null,
}
async function search(queryData:QueryData){
const {
    searchTerm,
    category,
    transactionType,
    productType,
    minPrice,
    maxPrice,
    attributes,
} = queryData
let url = `${BASE_URL}searchProductsAndFilter?searchTerm=${searchTerm}`
if(category){
    url = `${url}&category=${category}`
}
if(transactionType){
    url = `${url}&transactionType=${transactionType}`
}
if(productType){
    url = `${url}&productType=${productType}`
}
if(minPrice&&maxPrice){
    url = `${url}&minPrice=${minPrice}&maxPrice=${maxPrice}`
}
if(attributes&&attributes.length>0){
    attributes.forEach((attr:any)=>{
    url = `${url}&attributes=${attr.attributes}&attributeValues=${attr.attributeValues}`
    })
  }
try {
    const {data} = await axios.get(
        url
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default search