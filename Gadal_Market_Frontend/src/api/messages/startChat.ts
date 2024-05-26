import axios from 'axios'
import BASE_URL from '../apiConfig'
// add a new message to an exisitng convo
async function createMessage(messageDetail:{
    product:string;
    owner:string;
    buyer:string;
    message:{
        message:string,
        messageType:string,
    };
}){
try {
    const {data} = await axios.post(
        `${BASE_URL}createMessage`,messageDetail
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default createMessage