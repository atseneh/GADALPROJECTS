import axios from 'axios'
import BASE_URL from './apiConfig'
interface QueryData {
    category?:string;
    transactionType?:number;
    productType?:number;
    pageSize?:number;
    pageNum?:number;
}
async function getProducts(queryData:QueryData){
const {
    category,
    transactionType,
    productType,
    pageSize,
    pageNum,
} = queryData
let url = `products?recordStatus=1`
if(category){
url = `${url}&category=${category}`
}
if(transactionType){
    url = `${url}&transactionType=${transactionType}`
}
if(productType){
    url = `${url}&productType=${productType}`
}
if(pageSize){
    url = `${url}&pageSize=${pageSize}`
}
if(pageNum){
    url = `${url}&pageNum=${pageNum}`
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