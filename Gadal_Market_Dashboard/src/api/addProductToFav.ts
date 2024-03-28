import axios from 'axios'
import BASE_URL from './apiConfig'

async function addProductToFav(productId:string,userId?:string){
try {
    const {data} = await axios.put(`${BASE_URL}users/addToFav/${userId||'653f2561c250b545217d192b'}/${productId}`)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default addProductToFav  