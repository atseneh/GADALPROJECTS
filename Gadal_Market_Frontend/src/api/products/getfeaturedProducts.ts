import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getFetauredProducts(type:number,transactionType:number){
try {
    const {data} = await axios.get(
        `${BASE_URL}productsOnHomePage?serviceType=${type}&transactionType=${transactionType}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getFetauredProducts