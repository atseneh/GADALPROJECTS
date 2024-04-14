import axios from 'axios'
import BASE_URL from '../apiConfig'
async function getUsersPackage(userId:string){
const token = localStorage.getItem('token')
try {
    const {data} = await axios.get(
        `${BASE_URL}usersPackage?userId=${userId}`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
         }
    )
    return data
} catch (error:any) {
    console.log(error)
    throw new Error(error?.response.data.message)
}
}
export default getUsersPackage