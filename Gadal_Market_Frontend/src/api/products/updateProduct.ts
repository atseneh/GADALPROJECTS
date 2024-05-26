import axios from 'axios'
import BASE_URL from '../apiConfig'
async function updateProduct(productData:FormData){
const productId = productData.get('id')
try {
    const {data} = await axios.put(`${BASE_URL}products/${productId}`,productData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default updateProduct  