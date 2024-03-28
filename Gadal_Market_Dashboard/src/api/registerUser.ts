import axios from 'axios'
import BASE_URL from './apiConfig'
async function registerUser(userData:any){
try {
    const {data} = await axios.post(`${BASE_URL}users`,userData)
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default registerUser  