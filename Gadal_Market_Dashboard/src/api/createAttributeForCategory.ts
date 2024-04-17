import axios from 'axios'
import BASE_URL from './apiConfig'
async function createAttributes(attributeData:any){
try {
    const {data} = await axios.post(
        `${BASE_URL}categoryAttributes`,attributeData
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default createAttributes