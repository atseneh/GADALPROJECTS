import axios from 'axios'
import BASE_URL from '../apiConfig'
async function updateSeen(detail:{
    messageId:string,
    userId:string
}){
try {
    const {data} = await axios.put(
        `${BASE_URL}updateSeen/${detail.messageId}/${detail.userId}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default updateSeen