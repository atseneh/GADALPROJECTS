import axios from 'axios'
import BASE_URL from '../apiConfig'

async function updateUser(userData:FormData){
const token = localStorage.getItem('token')
try {
    const {data} = await axios.put(
        `${BASE_URL}users`,userData,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
         }
        )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.error)
}
}
export default updateUser  