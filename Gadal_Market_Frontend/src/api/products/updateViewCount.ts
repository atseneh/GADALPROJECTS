import axios from 'axios'
import BASE_URL from '../apiConfig'
interface viewCountArgs {
id:string,
count:number
}
async function updateViewCount(countData:viewCountArgs){
const {id,count} = countData
try {
    const {data} = await axios.put(`${BASE_URL}products/${id}`,{viewCount:count})
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default updateViewCount  