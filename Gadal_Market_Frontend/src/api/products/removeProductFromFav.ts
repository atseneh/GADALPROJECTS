import axios from 'axios'
import BASE_URL from '../apiConfig'

async function removeProductFromFav(data:{
    productId:string,userId:string
}){
const {productId,userId} = data
try {
    const {data} = await axios.put(
        `${BASE_URL}users/removeFromFav/${productId}/${userId}`,
        )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default removeProductFromFav  