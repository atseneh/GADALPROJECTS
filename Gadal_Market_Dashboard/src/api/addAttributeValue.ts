import axios from 'axios'
import BASE_URL from './apiConfig'
async function addAttributeValue(newValue:{value:string,id:string}){
const {value,id} = newValue
try {
    const {data} = await axios.put(
        `${BASE_URL}addNewAttributeValue/${id}`,{value:value}
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default addAttributeValue