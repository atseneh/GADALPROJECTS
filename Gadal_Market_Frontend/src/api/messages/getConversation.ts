import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getConversation(messageId:string){
try {
    const {data} = await axios.get(
        `${BASE_URL}getConversations/${messageId}`
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getConversation