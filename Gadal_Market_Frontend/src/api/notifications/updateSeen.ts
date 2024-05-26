import axios from 'axios'
import BASE_URL from '../apiConfig'
async function updateSeen(userId:string){
try {
    const {data} = await axios.put(
        `${BASE_URL}notifications/updateSeen/${userId}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default updateSeen