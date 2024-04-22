import axios from 'axios'
import BASE_URL from './apiConfig'

async function updateUser(userData:any){
const token = localStorage.getItem('token')
const {userId,...others} = userData
try {
    const {data} = await axios.put(
        `${BASE_URL}users/${userId}`,others,
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