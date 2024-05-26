import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getMessagesOfUser(userId:string,searchString?:string){
let url = `${BASE_URL}getMessages/${userId}`
if(searchString){
    url = `${url}?searchQuery=${searchString}`
}
try {
    const {data} = await axios.get(
        url
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getMessagesOfUser