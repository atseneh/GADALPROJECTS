import axios from 'axios'
import BASE_URL from '../apiConfig'
// add a new message to an exisitng convo
async function addReveiw(reveiewDetail:{
    user:string;
    product:string;
    description:string;
    stars:number;
}){
try {
    const {data} = await axios.post(
        `${BASE_URL}reviews`,reveiewDetail
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default addReveiw