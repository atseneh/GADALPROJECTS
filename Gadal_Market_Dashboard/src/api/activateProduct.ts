import axios from 'axios'
import BASE_URL from './apiConfig'
async function activateProduct(productData:any){
const {productId,...others} = productData
try {
    const {data} = await axios.put(`${BASE_URL}products/activateProduct/${productId}`,others)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default activateProduct  