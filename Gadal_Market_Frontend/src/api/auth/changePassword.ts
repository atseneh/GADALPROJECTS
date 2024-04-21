import axios from 'axios'
import BASE_URL from '../apiConfig'
async function changePassword(credentials:{oldPassword:string,newPassword:string}){
const token = localStorage.getItem('token')
try {
    const {data} = await axios.put(`${BASE_URL}auth/changePassword`,
    credentials,
    {
        headers:{
            Authorization:`Bearer ${token}`
        }
     }
)
    return data
} catch (error:any) {
    console.log(error)
    throw error.response.data
}
}
export default changePassword  