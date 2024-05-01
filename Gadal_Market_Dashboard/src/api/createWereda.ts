import axios from 'axios'
import BASE_URL from './apiConfig'
async function createWereda(weredaData:any){
try {
    const {data} = await axios.post(`${BASE_URL}wereda`,weredaData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default createWereda  