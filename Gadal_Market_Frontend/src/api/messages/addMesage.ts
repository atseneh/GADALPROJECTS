import axios from 'axios'
import BASE_URL from '../apiConfig'
// add a new message to an exisitng convo
async function addMessage(messageDetail:FormData
//     {
//     messageId:string;
//     message:{
//         message:string,
//         messageType:string,
//     };
//     sender:string;
//     receiver:string;
// }
){
try {
    const {data} = await axios.put(
        `${BASE_URL}addConversations`,messageDetail
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default addMessage