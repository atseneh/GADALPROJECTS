import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getUsersAds(userId:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}products?consignee=${userId}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getUsersAds