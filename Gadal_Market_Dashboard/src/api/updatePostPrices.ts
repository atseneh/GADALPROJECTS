import axios from 'axios'
import BASE_URL from './apiConfig'
async function updatePostPrices(priceData:{[key:string]:number}){
try {
    const {data} = await axios.put(`${BASE_URL}updatePostPrices`,priceData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default updatePostPrices  